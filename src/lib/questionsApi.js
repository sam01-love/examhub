import { supabase } from './supabaseClient'

const TABLE = 'questions'

/**
 * Fetches questions for the admin table, newest first, with optional filters.
 * filters: { examType, subject, search }
 */
export async function fetchQuestions({ examType, subject, search, limit = 200 } = {}) {
  let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false }).limit(limit)

  if (examType) query = query.eq('exam_type', examType)
  if (subject) query = query.eq('subject', subject)
  if (search) query = query.ilike('prompt', `%${search}%`)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function fetchQuestionStats() {
  const { count: total, error: totalError } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
  if (totalError) throw totalError

  const { data: bySubject, error: subjectError } = await supabase.from(TABLE).select('subject')
  if (subjectError) throw subjectError

  const subjectCounts = (bySubject ?? []).reduce((acc, row) => {
    acc[row.subject] = (acc[row.subject] ?? 0) + 1
    return acc
  }, {})

  return { total: total ?? 0, subjectCounts }
}

export async function fetchQuestionById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/**
 * question: { examType, subject, topic, prompt, options: string[], answer: number, explanation, difficulty }
 */
export async function createQuestion(question, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      exam_type: question.examType,
      subject: question.subject,
      topic: question.topic || null,
      prompt: question.prompt,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation || null,
      difficulty: question.difficulty || 'Intermediate',
      created_by: userId ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateQuestion(id, question) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      exam_type: question.examType,
      subject: question.subject,
      topic: question.topic || null,
      prompt: question.prompt,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation || null,
      difficulty: question.difficulty || 'Intermediate',
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteQuestion(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

/**
 * Bulk inserts rows already normalized to the questions table shape.
 * Supabase caps request size, so this chunks large batches.
 */
export async function bulkInsertQuestions(rows, userId) {
  const payload = rows.map((row) => ({
    exam_type: row.examType,
    subject: row.subject,
    topic: row.topic || null,
    prompt: row.prompt,
    options: row.options,
    answer: row.answer,
    explanation: row.explanation || null,
    difficulty: row.difficulty || 'Intermediate',
    created_by: userId ?? null,
  }))

  const chunkSize = 200
  let inserted = 0
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize)
    const { error } = await supabase.from(TABLE).insert(chunk)
    if (error) throw error
    inserted += chunk.length
  }
  return inserted
}
