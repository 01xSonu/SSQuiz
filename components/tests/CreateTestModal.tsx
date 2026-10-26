'use client'

import { useState } from 'react'
import { X, Plus, Trash2, BookOpen, Clock, HelpCircle, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Subject } from '@/types'

interface CreateTestModalProps {
  subjects: Subject[]
  onClose: () => void
  onCreated: () => void
}

interface QuestionDraft {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correct_ans: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

export default function CreateTestModal({ subjects, onClose, onCreated }: CreateTestModalProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Test metadata
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [mode, setMode] = useState<'timed' | 'instant' | 'mock'>('timed')
  const [durationMin, setDurationMin] = useState(15)

  // Questions array
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correct_ans: 'A',
      explanation: '',
    },
  ])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correct_ans: 'A',
        explanation: '',
      },
    ])
  }

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleUpdateQuestion = (index: number, field: keyof QuestionDraft, value: string) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please enter a test title.')
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim() || !q.optionA.trim() || !q.optionB.trim()) {
        setError(`Question #${i + 1} needs a question text and at least options A and B.`)
        return
      }
    }

    setLoading(true)
    setError('')

    try {
      // 1. Insert test
      const { data: testData, error: testErr } = await supabase
        .from('tests')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          subject_id: subjectId || null,
          difficulty,
          mode,
          duration_min: Number(durationMin),
          total_marks: questions.length,
          is_published: true,
        })
        .select()
        .single()

      if (testErr || !testData) throw testErr || new Error('Failed to create test')

      // 2. Insert questions
      const questionsToInsert = questions.map((q, idx) => ({
        test_id: testData.id,
        question: q.question.trim(),
        options: {
          A: q.optionA.trim(),
          B: q.optionB.trim(),
          C: q.optionC.trim(),
          D: q.optionD.trim(),
        },
        correct_ans: q.correct_ans,
        explanation: q.explanation.trim() || null,
        marks: 1,
        order_num: idx + 1,
      }))

      const { error: qErr } = await supabase.from('questions').insert(questionsToInsert)
      if (qErr) throw qErr

      setLoading(false)
      onCreated()
      onClose()
    } catch (err: any) {
      setLoading(false)
      setError(err?.message || 'Failed to save test paper.')
    }
  }

  const inputClass =
    'w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <BookOpen size={20} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Test Paper</h3>
              <p className="text-xs text-gray-400">Add MCQs, answer keys, and instant explanations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Test Metadata */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Test Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Thermodynamics & Heat Transfer Practice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className={inputClass}
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.icon} {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="timed">⏱ Timed</option>
                  <option value="instant">⚡ Instant Feedback</option>
                  <option value="mock">🎯 Full Mock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 4 revision"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                Questions ({questions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                <Plus size={14} /> Add Another Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Q{idx + 1}. Question Details
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete question"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder={`Enter question #${idx + 1}...`}
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Options A, B, C, D */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const optField = `option${opt}` as keyof QuestionDraft
                      const isCorrect = q.correct_ans === opt
                      return (
                        <div key={opt} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuestion(idx, 'correct_ans', opt)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${
                              isCorrect
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-100'
                            }`}
                            title={`Mark Option ${opt} as correct`}
                          >
                            {opt}
                          </button>
                          <input
                            type="text"
                            placeholder={`Option ${opt}`}
                            value={q[optField]}
                            onChange={(e) => handleUpdateQuestion(idx, optField, e.target.value)}
                            className={inputClass}
                            required={opt === 'A' || opt === 'B'}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  <div>
                    <input
                      type="text"
                      placeholder="Step-by-step solution / Explanation (shown after submission)"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                      className={`${inputClass} text-xs`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/25 disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? 'Publishing...' : 'Publish Test Paper 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
