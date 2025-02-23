'use client'

import { Box } from '@/components/box'
import React from 'react'
import { toast as sonnerToast } from 'sonner'

export const toast = (title: string) => {
  return sonnerToast.custom((id) => (
    <Box variant='primary' className='w-48 md:w-64 shadow-2xl'>
      {title}
    </Box>
  ))
}
