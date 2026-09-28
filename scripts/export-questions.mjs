// scripts/export-questions.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import your mock data. If your source is ESM, this works directly.
const { questionBank } = await import(path.resolve(__dirname, '../src/data/mockData.js'))

const all = Object.entries(questionBank).flatMap(([subject, qs]) =>
    qs.map((q) => ({
        subject,
        topic: q.instruction || 'General',
        instruction: q.instruction || null,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
    }))
)

const out = path.resolve(__dirname, 'questions.json')
fs.writeFileSync(out, JSON.stringify(all, null, 2))
console.log(`Wrote ${all.length} questions to ${out}`)