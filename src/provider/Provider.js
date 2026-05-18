import React from 'react'
import CustomQueryClientProvider from './CustomQueryClientProvider'
import CustomThemeProvider from './CustomThemeProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

const Provider = (props) => {
  const cache = React.useMemo(() => createCache({
    key: 'acadlix-css',
    stylisPlugins: [
      (element) => {
        if (element.type === 'rule' && Array.isArray(element.props)) {
          element.props = element.props.map((prop) => {
            if (prop.startsWith('.acadlix-css')) {
              return `#${props.id} ${prop}`;
            }

            return prop;
          });
        }
      },
    ],
  }), [props.id]);

  return (
    <CustomQueryClientProvider>
      <CacheProvider value={cache}>
        <CustomThemeProvider id={props?.id}>
          {props?.children}
          {/* <ReactQueryDevtools position='bottom-right' /> */}
        </CustomThemeProvider>
      </CacheProvider>
    </CustomQueryClientProvider>
  )
}

export default Provider
