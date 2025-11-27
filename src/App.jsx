import React, { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import MultiStepForm from './components/MultiStepForm'
import { t } from './i18n'

export default function App() {
  const [lang, setLang] = useState('en')

  return (
    <ErrorBoundary>
      <div className="ltl">
        <header className="bg-gray-50 border-b p-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <h1 className="text-lg font-bold">{t(lang, 'multiStepForm')}</h1>
            <div className="flex gap-2 items-center">
              <label className="text-xs">{t(lang, 'enLabel')}</label>
              <input type="radio" name="lang" checked={lang==='en'} onChange={()=>setLang('en')} />
              <label className="text-xs">{t(lang, 'arLabel')}</label>
              <input type="radio" name="lang" checked={lang==='ar'} onChange={()=>setLang('ar')} />
            </div>
          </div>
        </header>

        <main className="py-6">
          <MultiStepForm lang={lang} />
        </main>
      </div>
    </ErrorBoundary>
  )
}
