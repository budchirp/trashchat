'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { ChevronDown, Laptop, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Dropdown } from '@/components/dropdown'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import type { Theme } from '@/types/theme'

export const themes: {
  [key in Theme]: [(t: (value: string) => string) => string, LucideIcon]
} = {
  dark: [(t) => t('dark'), Moon],
  light: [(t) => t('light'), Sun],
  system: [(t) => t('system'), Laptop]
}

export const AppearanceClientPage: React.FC = (): React.ReactNode => {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect((): void => {
    setMounted(true)
  }, [])

  const t = useTranslations('settings.appearance.themes')

  return (
    mounted && (
      <div className='grid gap-2'>
        <h2>{t('theme')}</h2>

        <Dropdown
          button={
            <Button color='secondary' className='flex gap-2'>
              <span>{t(theme || 'system')}</span>

              <ChevronDown />
            </Button>
          }
          options={Object.keys(themes).map((_theme) => ({
            value: _theme,
            title: t(_theme),
            icon: themes[_theme as keyof typeof themes][1]
          }))}
          selected={theme}
          onChange={(option) => setTheme(option as Theme)}
        />
      </div>
    )
  )
}
