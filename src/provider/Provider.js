import React from 'react'
import CustomQueryClientProvider from './CustomQueryClientProvider'
import CustomThemeProvider from './CustomThemeProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const Provider = ({children}) => {
  return (
    <CustomQueryClientProvider>
        <CustomThemeProvider>
            {children}
            {/* <ReactQueryDevtools position='bottom-right' /> */}
        </CustomThemeProvider>
    </CustomQueryClientProvider>
  )
}

export default Provider
