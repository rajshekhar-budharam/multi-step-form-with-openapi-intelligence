import React, { useState } from 'react'
import Modal from '../components/Modal'
import { generateSuggestion } from '../utils/api'
import { t } from '../i18n'

export function validate(values) {
  const errs = {}
  // require reason for applying at least
  if (!values.reasonForApplying) errs.reasonForApplying = 'required'
  return errs
}

export default function Step3({ value, onChange, lang = 'en', errors = {}, showErrors = false }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [activeField, setActiveField] = useState(null)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  async function handleHelp(field) {
    setActiveField(field)
    setModalOpen(true)
    setSuggestion('')
    setLoading(true)
    try {
      // Build a summary of Step1 and Step2 values
      const keys = [
        'name','nationalId','dob','gender','address','city','state','country','phone','email',
        'maritalStatus','dependents','employmentStatus','monthlyIncome','housingStatus'
      ]

      const lines = []
      for (const k of keys) {
        if (value[k] !== undefined && value[k] !== null && String(value[k]).trim() !== '') {
          lines.push(`${k}: ${value[k]}`)
        }
      }

      const applicantData = lines.length ? lines.join('\n') : 'No applicant data provided.'

      const exampleInstruction = `I am unemployed with no income. Help me describe my financial hardship.`

      const prompt = `Use the applicant data below to write a clear, empathetic, and concise paragraph for the field: "${t(lang, field)}".\n\nApplicant data:\n${applicantData}\n\nCurrent field value:\n${value[field] || '(empty)'}\n\nInstruction / example for tone and intent:\n"${exampleInstruction}"\n\nPlease produce one well-formed paragraph suitable for use in an application or explanation of circumstances.`

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY
      if (!apiKey) {
        setSuggestion('Missing OpenAI API key. Add VITE_OPENAI_API_KEY to a .env file and restart the dev server.')
      } else {
        const txt = await generateSuggestion(prompt, { apiKey, timeout: 10000 })
        setSuggestion(txt)
      }
    } catch (err) {
      setSuggestion('Could not generate suggestion: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function acceptSuggestion(updatedText) {
    onChange({ [activeField]: updatedText })
    setModalOpen(false)
  }

  function handle(field, v) {
    onChange({ [field]: v })
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  function showErrorFor(field) {
    return showErrors || touched[field]
  }

  const fields = ['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying']

  return (
    <section aria-labelledby="step3-title">
      <h2 id="step3-title" className="text-2xl font-bold mb-4 pb-3 border-b-2 border-indigo-600 text-gray-900">{t(lang, 'step3')}</h2>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label className="flex justify-between items-center">
              <span className="text-sm font-semibold">{t(lang, field)}</span>
              <button type="button" onClick={() => handleHelp(field)} className="text-sm px-2 py-1 bg-indigo-500 text-white rounded">{t(lang, 'helpMeWrite')}</button>
            </label>
            <textarea className="w-full mt-1 px-2 py-1 border rounded" rows={5} value={value[field]} onChange={e => handle(field, e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, [field]: true }))} />
            {showErrorFor(field) && errors[field] && <div className="text-xs text-red-600">{t(lang, errors[field])}</div>}
          </div>
        ))}
      </div>

      <Modal open={modalOpen} title={t(lang, 'suggestion')} onClose={() => setModalOpen(false)}>
        <div>
          {loading ? <div>Generating...</div> : (
            <>
              <textarea className="w-full border p-2" rows={8} value={suggestion} onChange={(e) => setSuggestion(e.target.value)} />
              <div className="mt-2 flex gap-2 justify-end">
                <button onClick={() => { setModalOpen(false) }} className="px-3 py-1 bg-gray-200 rounded">{t(lang, 'discard')}</button>
                <button onClick={() => acceptSuggestion(suggestion)} className="px-3 py-1 bg-indigo-600 text-white rounded">{t(lang, 'accept')}</button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </section>
  )
}
