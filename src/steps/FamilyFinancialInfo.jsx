import React, { useState, useCallback } from 'react'
import { t } from '../i18n'

export function validate(values) {
  const errs = {}
  if (!values.employmentStatus) errs.employmentStatus = 'required'
  if (!values.monthlyIncome) errs.monthlyIncome = 'required'
  return errs
}

export default function FamilyFinancialInfo({ value, onChange, lang = 'en', errors = {}, showErrors = false }) {
  const [touched, setTouched] = useState({})

  const handle = useCallback((field, v) => {
    onChange({ [field]: v })
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [onChange])

  const showErrorFor = useCallback((field) => {
    return showErrors || touched[field]
  }, [showErrors, touched])

  const handleTouchField = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  return (
    <section aria-labelledby="step2-title" className="border border-gray-300 rounded-lg p-6 bg-gray-50">
      <h2 id="step2-title" className="text-xl font-semibold mb-4">{t(lang, 'step2')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <div className="text-xs">{t(lang, 'maritalStatus')}</div>
          <select className="w-full px-2 py-1 border rounded" value={value.maritalStatus} onChange={e => handle('maritalStatus', e.target.value)}>
            <option value="">{t(lang, 'select')}</option>
            <option value="single">{t(lang, 'single')}</option>
            <option value="married">{t(lang, 'married')}</option>
            <option value="divorced">{t(lang, 'divorced')}</option>
            <option value="widowed">{t(lang, 'widowed')}</option>
          </select>
        </label>

        <label>
          <div className="text-xs">{t(lang, 'dependents')}</div>
          <input type="number" min="0" className="w-full px-2 py-1 border rounded" value={value.dependents} onChange={e => handle('dependents', e.target.value)} />
        </label>

        <label>
          <div className="text-xs">{t(lang, 'employmentStatus')}</div>
          <select className="w-full px-2 py-1 border rounded" value={value.employmentStatus} onChange={e => handle('employmentStatus', e.target.value)} onBlur={() => handleTouchField('employmentStatus')}>
            <option value="">{t(lang, 'select')}</option>
            <option value="employed">{t(lang, 'employed')}</option>
            <option value="self-employed">{t(lang, 'selfEmployed')}</option>
            <option value="unemployed">{t(lang, 'unemployed')}</option>
            <option value="student">{t(lang, 'student')}</option>
          </select>
          {showErrorFor('employmentStatus') && errors.employmentStatus && <div className="text-xs text-red-600">{t(lang, errors.employmentStatus)}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'monthlyIncome')}</div>
          <input type="number" min="0" className="w-full px-2 py-1 border rounded" value={value.monthlyIncome} onChange={e => handle('monthlyIncome', e.target.value)} onBlur={() => handleTouchField('monthlyIncome')} />
          {showErrorFor('monthlyIncome') && errors.monthlyIncome && <div className="text-xs text-red-600">{t(lang, errors.monthlyIncome)}</div>}
        </label>

        <label className="col-span-1 md:col-span-2">
          <div className="text-xs">{t(lang, 'housingStatus')}</div>
          <select className="w-full px-2 py-1 border rounded" value={value.housingStatus} onChange={e => handle('housingStatus', e.target.value)}>
            <option value="">{t(lang, 'select')}</option>
            <option value="rent">{t(lang, 'rent')}</option>
            <option value="own">{t(lang, 'own')}</option>
            <option value="living-with-family">{t(lang, 'livingWithFamily')}</option>
          </select>
        </label>
      </div>
    </section>
  )
}
