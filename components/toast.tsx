'use client'

import React from 'react'

import { toast as sonnerToast } from 'sonner'
import { Box } from '@/components/box'

export const toast = (title: string) => {
  return sonnerToast.custom(() => (
    <Box variant='blurry' className='w-48 shadow-2xl md:w-96'>
      {title}
    </Box>
  ))
}
