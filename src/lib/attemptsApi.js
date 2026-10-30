import { supabase } from './supabaseClient'

const TABLE = 'attempts'

/**
 * Logs one answered question. Fire-and-forget by design (callers don't
 * await the UI on this) — a logging failure should never block a student
 * mid-practice. Errors are only logged to the console.
 */
export async function logAttempt({ userId, examType, subject, instruction, mode, questionId, isCorrect }) {
    if (!userId) return
    try {
        const { error } = await supabase.from(TABLE).insert({
            user_id: userId,
            exam_type: examType || null,
            subject,
            instruction: instruction || null,
            mode,
            question_id: questionId ?? null,
            is_correct: isCorrect,
        })
        if (error) throw error
    } catch (err) {
        console.warn('[EXAMHUB] Could not log attempt:', err.message)
    }
}

/** Same as logAttempt but for many rows at once (used when an exam finishes). */
export async function logAttempts(rows) {
    const payload = rows
        .filter((r) => r.userId)
        .map((r) => ({
            user_id: r.userId,
            exam_type: r.examType || null,
            subject: r.subject,
            instruction: r.instruction || null,
            mode: r.mode,
            question_id: r.questionId ?? null,
            is_correct: r.isCorrect,
        }))
    if (payload.length === 0) return
    try {
        const { error } = await supabase.from(TABLE).insert(payload)
        if (error) throw error
    } catch (err) {
        console.warn('[EXAMHUB] Could not log exam attempts:', err.message)
    }
}

const DAY_MS = 24 * 60 * 60 * 1000
const dayKey = (date) => date.toISOString().slice(0, 10)
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Fetches every attempt a student has made and derives all the dashboard /
 * performance numbers from it in one pass, so there's one source of truth
 * (the `attempts` table) instead of separate queries drifting apart.
 *
 * Returns null if the table doesn't exist yet or the request fails, so
 * calling pages can fall back to a clean "no data yet" state instead of
 * crashing on an undefined shape.
 */
export async function fetchPerformanceSummary(userId) {
    if (!userId) return null

    let rows
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('subject,instruction,is_correct,created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(5000)
        if (error) throw error
        rows = data ?? []
    } catch (err) {
        console.warn('[EXAMHUB] Could not load performance data:', err.message)
        return null
    }

    const practiced = rows.length
    const correct = rows.filter((r) => r.is_correct).length
    const accuracy = practiced > 0 ? Math.round((correct / practiced) * 100) : 0

    // --- Last 7 days of activity, oldest first ---
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getTime() - i * DAY_MS)
        days.push({ key: dayKey(d), day: WEEKDAY_LABELS[d.getDay()], value: 0 })
    }
    const dayIndex = Object.fromEntries(days.map((d, i) => [d.key, i]))
    for (const row of rows) {
        const key = dayKey(new Date(row.created_at))
        const idx = dayIndex[key]
        if (idx !== undefined) days[idx].value += 1
    }
    const weeklyActivity = days.map(({ day, value }) => ({ day, value }))

    // --- Current streak: consecutive days up to and including today with activity ---
    const activeDayKeys = new Set(rows.map((r) => dayKey(new Date(r.created_at))))
    let streak = 0
    for (let i = 0; ; i++) {
        const d = new Date(today.getTime() - i * DAY_MS)
        if (!activeDayKeys.has(dayKey(d))) break
        streak += 1
    }

    // --- Accuracy per subject ---
    const bySubject = {}
    for (const row of rows) {
        const s = (bySubject[row.subject] ??= { practiced: 0, correct: 0 })
        s.practiced += 1
        if (row.is_correct) s.correct += 1
    }
    const subjectPerformance = Object.entries(bySubject)
        .map(([subject, s]) => ({ subject, accuracy: Math.round((s.correct / s.practiced) * 100), questions: s.practiced }))
        .sort((a, b) => b.questions - a.questions)

    // --- Accuracy per topic (subject + instruction), weakest first ---
    const byTopic = {}
    for (const row of rows) {
        if (!row.instruction) continue
        const key = `${row.subject}::${row.instruction}`
        const t = (byTopic[key] ??= { subject: row.subject, topic: row.instruction, practiced: 0, correct: 0 })
        t.practiced += 1
        if (row.is_correct) t.correct += 1
    }
    const MIN_QUESTIONS_FOR_WEAK_TOPIC = 3 // avoid flagging a topic from a single lucky/unlucky guess
    const weakTopics = Object.values(byTopic)
        .filter((t) => t.practiced >= MIN_QUESTIONS_FOR_WEAK_TOPIC)
        .map((t) => ({ subject: t.subject, topic: t.topic, accuracy: Math.round((t.correct / t.practiced) * 100), questions: t.practiced }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 6)

    return { practiced, accuracy, streak, weeklyActivity, subjectPerformance, weakTopics }
}