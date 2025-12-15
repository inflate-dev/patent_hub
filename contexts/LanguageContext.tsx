'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Locale, getDictionary, Dictionary } from '@/lib/i18n/dictionaries'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dictionary: Dictionary
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'ja', 'zh']

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [locale, setLocale] = useState<Locale>('en')
  const [dictionary, setDictionary] = useState<Dictionary>(
    getDictionary('en')
  )
  const [mounted, setMounted] = useState(false)

  // Client マウント後に localStorage を反映
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale')

    if (
      savedLocale &&
      SUPPORTED_LOCALES.includes(savedLocale as Locale)
    ) {
      const validLocale = savedLocale as Locale
      setLocale(validLocale)
      setDictionary(getDictionary(validLocale))
    }

    setMounted(true)
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    setDictionary(getDictionary(newLocale))
    localStorage.setItem('locale', newLocale)
  }

  /**
   * 初期マウント前は children を描画しないことで
   * 「en → ja に切り替わるチラつき」を防ぐ
   */
  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale: changeLocale,
        dictionary,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider'
    )
  }
  return context
}
