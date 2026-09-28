import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { UploadCloud, Download, TriangleAlert, CircleCheck, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { bulkInsertQuestions } from '../../lib/questionsApi'
import { examTypes, subjects } from '../../data/mockData'

const TEMPLATE_HEADERS = [
  'examType',
  'subject',
  'topic',
  'difficulty',
  'prompt',
  'optionA',
  'optionB',
  'optionC',
  'optionD',
  'answer',
  'explanation',
]

const TEMPLATE_ROW = [
  'jamb',
  'mathematics',
  'Algebra',
  'Intermediate',
  'If x + 5 = 12, what is the value of x?',
  '5',
  '6',
  '7',
  '8',
  'C',
  'Subtract 5 from both sides: x = 12 - 5 = 7.',
]

const examIds = new Set(examTypes.map((e) => e.id))
const subjectIds = new Set(subjects.map((s) => s.id))

function downloadTemplate() {
  const csv = Papa.unparse([TEMPLATE_HEADERS, TEMPLATE_ROW])
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'examhub-question-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function validateRow(row, index) {
  const errors = []
  const options = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF']
    .map((key) => (row[key] || '').trim())
    .filter(Boolean)

  if (!row.examType || !examIds.has(row.examType.trim())) {
    errors.push(`unknown examType "${row.examType || ''}"`)
  }
  if (!row.subject || !subjectIds.has(row.subject.trim())) {
    errors.push(`unknown subject "${row.subject || ''}"`)
  }
  if (!row.prompt?.trim()) errors.push('missing question text')
  if (options.length < 2) errors.push('needs at least 2 options')

  const answerLetter = (row.answer || '').trim().toUpperCase()
  const answerIndex = answerLetter.charCodeAt(0) - 65
  if (!answerLetter || answerIndex < 0 || answerIndex >= options.length) {
    errors.push(`answer "${row.answer || ''}" doesn't match an option letter`)
  }

  return {
    rowNumber: index + 2, // +1 for header row, +1 for 1-based display
    valid: errors.length === 0,
    errors,
    normalized: {
      examType: row.examType?.trim(),
      subject: row.subject?.trim(),
      topic: row.topic?.trim() || '',
      difficulty: row.difficulty?.trim() || 'Intermediate',
      prompt: row.prompt?.trim() || '',
      options,
      answer: answerIndex,
      explanation: row.explanation?.trim() || '',
    },
  }
}

export default function AdminBulkImport() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState([])
  const [parseError, setParseError] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)

  const validRows = rows.filter((r) => r.valid)
  const invalidRows = rows.filter((r) => !r.valid)

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    setParseError('')
    setResult(null)
    setRows([])

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data.length) {
          setParseError('The file has no data rows.')
          return
        }
        setRows(results.data.map((row, i) => validateRow(row, i)))
      },
      error: (err) => setParseError(err.message || 'Could not read this file.'),
    })
  }

  const handleImport = async () => {
    if (!validRows.length) return
    setImporting(true)
    setResult(null)
    try {
      const inserted = await bulkInsertQuestions(
        validRows.map((r) => r.normalized),
        user?.id
      )
      setResult({ success: true, count: inserted })
      setRows([])
      setFileName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setResult({ success: false, message: err.message || 'Import failed.' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-primary">Question bank</p>
        <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">Bulk import</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a CSV file to add many questions at once instead of one at a time.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
              <FileText size={18} />
            </span>
            <div>
              <p className="font-semibold">1. Start from the template</p>
              <p className="text-sm text-muted-foreground">
                Use the exact column headers so every row can be matched correctly.
              </p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex min-h-11 items-center rounded-lg border border-border bg-card px-5 font-semibold text-foreground"
          >
            <Download size={18} className="mr-2" />
            Download template
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <code>{TEMPLATE_HEADERS.join(', ')}</code>
          <p className="mt-2">
            <code>examType</code> must be one of: {examTypes.map((e) => e.id).join(', ')}. <code>subject</code> must
            be one of: {subjects.map((s) => s.id).join(', ')}. <code>answer</code> is the letter of the correct
            option (A, B, C…). Add up to 6 options (optionA–optionF); leave unused ones blank.
          </p>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="font-semibold">2. Upload your file</p>
          <label
            htmlFor="csv-upload"
            className="mt-3 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-6 py-8 text-center hover:border-primary"
          >
            <UploadCloud size={28} className="text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">{fileName || 'Click to choose a CSV file'}</p>
            <p className="mt-1 text-xs text-muted-foreground">.csv files only</p>
            <input
              ref={fileInputRef}
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>

        {parseError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            <TriangleAlert size={16} className="shrink-0" />
            {parseError}
          </div>
        )}

        {result?.success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-tertiary/10 px-4 py-3 text-sm font-medium text-tertiary">
            <CircleCheck size={16} className="shrink-0" />
            Imported {result.count} question{result.count === 1 ? '' : 's'} successfully.
          </div>
        )}
        {result && !result.success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            <TriangleAlert size={16} className="shrink-0" />
            {result.message}
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">3. Review and import</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-tertiary">{validRows.length} ready to import</span>
                {invalidRows.length > 0 && (
                  <>
                    {' '}
                    · <span className="font-semibold text-destructive">{invalidRows.length} need fixing</span>
                  </>
                )}
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={!validRows.length || importing}
              className="flex min-h-11 items-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-md disabled:opacity-50"
            >
              {importing ? 'Importing…' : `Import ${validRows.length} question${validRows.length === 1 ? '' : 's'}`}
            </button>
          </div>

          <div className="mt-5 max-h-96 overflow-y-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-border bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Row</th>
                  <th className="px-4 py-2">Question</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.rowNumber}>
                    <td className="px-4 py-2 text-muted-foreground">{r.rowNumber}</td>
                    <td className="max-w-md px-4 py-2">
                      <p className="line-clamp-1">{r.normalized.prompt || '—'}</p>
                    </td>
                    <td className="px-4 py-2">
                      {r.valid ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-tertiary">
                          <CircleCheck size={14} /> Ready
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-destructive" title={r.errors.join('; ')}>
                          {r.errors.join('; ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
