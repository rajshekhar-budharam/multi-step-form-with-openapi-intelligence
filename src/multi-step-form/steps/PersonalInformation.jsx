import React, { useState, useCallback, memo } from 'react'
import { t } from '../../i18n'
import { validatePersonalInformation } from '../../utils/validation'
import { GENDER_OPTIONS } from '../../utils/constants'
import Select from '../../components/Select'

export function validate(values, lang = 'en') {
  return validatePersonalInformation(values, lang)
}

export const PersonalInformation = ({ value, onChange, lang = 'en', errors = {}, showErrors = false }) => {
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
          {showErrorFor('name') && errors.name && <div className="text-xs text-red-600">{errors.name}</div>}
        </label>

        <label className="block">
          <div className="text-xs">{t(lang, 'nationalId')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.nationalId} onChange={e => handle('nationalId', e.target.value)} onBlur={() => handleTouchField('nationalId')} />
          {showErrorFor('nationalId') && errors.nationalId && <div className="text-xs text-red-600">{errors.nationalId}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'dob')}</div>
          <input type="date" className="w-full px-2 py-1 border rounded" value={value.dob} onChange={e => handle('dob', e.target.value)} onBlur={() => handleTouchField('dob')} />
          {showErrorFor('dob') && errors.dob && <div className="text-xs text-red-600">{errors.dob}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'gender')}</div>
          <Select
            value={value.gender}
            onChange={(v) => handle('gender', v)}
            options={GENDER_OPTIONS}
            lang={lang}
          />
          {showErrorFor('gender') && errors.gender && <div className="text-xs text-red-600">{errors.gender}</div>}
        </label>

        <label className="col-span-1 md:col-span-2">
          <div className="text-xs">{t(lang, 'address')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.address} onChange={e => handle('address', e.target.value)} onBlur={() => handleTouchField('address')} />
          {showErrorFor('address') && errors.address && <div className="text-xs text-red-600">{errors.address}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'city')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.city} onChange={e => handle('city', e.target.value)} onBlur={() => handleTouchField('city')} />
          {showErrorFor('city') && errors.city && <div className="text-xs text-red-600">{errors.city}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'state')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.state} onChange={e => handle('state', e.target.value)} onBlur={() => handleTouchField('state')} />
          {showErrorFor('state') && errors.state && <div className="text-xs text-red-600">{errors.state}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'country')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.country} onChange={e => handle('country', e.target.value)} onBlur={() => handleTouchField('country')} />
          {showErrorFor('country') && errors.country && <div className="text-xs text-red-600">{errors.country}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'phone')}</div>
          <input className="w-full px-2 py-1 border rounded" value={value.phone} onChange={e => handle('phone', e.target.value)} onBlur={() => handleTouchField('phone')} />
          {showErrorFor('phone') && errors.phone && <div className="text-xs text-red-600">{errors.phone}</div>}
        </label>

        <label>
          <div className="text-xs">{t(lang, 'email')}</div>
          <input type="email" className="w-full px-2 py-1 border rounded" value={value.email} onChange={e => handle('email', e.target.value)} onBlur={() => handleTouchField('email')} />
          {showErrorFor('email') && errors.email && <div className="text-xs text-red-600">{errors.email}</div>}
        </label>
      </div>
    </section>
  )
}

