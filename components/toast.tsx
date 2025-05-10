'use client'

import React from 'react'

import { toast as sonnerToast } from 'sonner'
import { Box } from '@/components/box'

export const toast = (title: string) => {
  return sonnerToast.custom(() => (
    <Box variant='primary' className='w-48 md:w-96 shadow-2xl'>
      {title}
    </Box>
  ))
}
