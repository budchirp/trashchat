'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { Laptop, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Box } from '@/components/box'
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
      <Box padding='small' className='flex gap-2 w-fit'>
        {(Object.keys(themes) as Theme[]).map((_theme) => {
          const [label, Icon] = themes[_theme]

          return (
            <Button
              className='flex gap-2'
              key={_theme}
              color={_theme === theme ? 'primary' : 'secondary'}
              onClick={() => setTheme(_theme)}
            >
              <Icon />

              {label(t)}
            </Button>
          )
        })}
      </Box>
    )
  )
}
