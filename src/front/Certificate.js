import Provider from '@acadlix/provider/Provider'
import React from 'react'
import CertificateInit from './certificate/CertificateInit'

const Certificate = (props) => {
  const params = new URLSearchParams(window.location.search)
  const certificate_id = params.get('certificate_id')
  return (
    <Provider id={props?.id}>
      <CertificateInit
        certificate_id={certificate_id}
      />
    </Provider>
  )
}

export default Certificate