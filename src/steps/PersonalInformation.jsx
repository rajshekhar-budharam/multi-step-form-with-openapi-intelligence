import React, { useState, useCallback } from 'react'
import { t } from '../i18n'

export function validate(values) {
  const errs = {}
  if (!values.name) errs.name = 'required'
  if (!values.nationalId) errs.nationalId = 'required'
  if (!values.dob) errs.dob = 'required'
  if (!values.email) errs.email = 'required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'invalidEmail'
  if (!values.phone) errs.phone = 'required'
  return errs
}

export default function PersonalInformation({ value, onChange, lang = 'en', errors = {}, showErrors = false }) {
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
    <section aria-labelledby="step1-title" className="border border-gray-300 rounded-lg p-6 bg-gray-50">
      <h2 id="step1-title" className="text-xl font-semibold mb-4">{t(lang, 'step1')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-xs">{t(lang, 'name')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.name} onChange={e => handle('name', e.target.value)} onBlur={() => handleTouchField('name')} />
          {showErrorFor('name') && errors.name && <div className="text-xs text-red-600">{t(lang, errors.name)}</div>}
        </label>

        <label className="block">
          <div className="text-xs">{t(lang, 'nationalId')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.nationalId} onChange={e => handle('nationalId', e.target.value)} onBlur={() => handleTouchField('nationalId')} />
          {showErrorFor('nationalId') && errors.nationalId && <div className="text-xs text-red-600">{t(lang, errors.nationalId)}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'dob')}</div>
          <input type="date" className="w-full px-2 py-1 border rounded" value={value.dob} onChange={e => handle('dob', e.target.value)} onBlur={() => handleTouchField('dob')} />
          {showErrorFor('dob') && errors.dob && <div className="text-xs text-red-600">{t(lang, errors.dob)}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'gender')}</div>
          <select className="w-full px-2 py-1 border rounded" value={value.gender} onChange={e => handle('gender', e.target.value)}>
            <option value="">{t(lang, 'select')}</option>
            <option value="male">{t(lang, 'male')}</option>
            <option value="female">{t(lang, 'female')}</option>
            <option value="other">{t(lang, 'other')}</option>
          </select>
        </label>

        <label className="col-span-1 md:col-span-2">
          <div className="text-xs">{t(lang, 'address')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.address} onChange={e => handle('address', e.target.value)} />
        </label>

        <label>
          <div className="text-xs">{t(lang, 'city')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.city} onChange={e => handle('city', e.target.value)} />
        </label>

        <label>
          <div className="text-xs">{t(lang, 'state')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.state} onChange={e => handle('state', e.target.value)} />
        </label>

        <label>
          <div className="text-xs">{t(lang, 'country')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.country} onChange={e => handle('country', e.target.value)} />
        </label>

        <label>
          <div className="text-xs">{t(lang, 'phone')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.phone} onChange={e => handle('phone', e.target.value)} onBlur={() => handleTouchField('phone')} />
          {showErrorFor('phone') && errors.phone && <div className="text-xs text-red-600">{t(lang, errors.phone)}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'email')}</div>
          <input type="email" className="w-full px-2 py-1 border rounded" value={value.email} onChange={e => handle('email', e.target.value)} onBlur={() => handleTouchField('email')} />
          {showErrorFor('email') && errors.email && <div className="text-xs text-red-600">{t(lang, errors.email)}</div>}
        </label>
      </div>
    </section>
  )
}
