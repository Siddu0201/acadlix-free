import { GetUserCertificateById } from '@acadlix/requests/front/FrontDashboardRequest';
import { Box } from '@mui/material';
import React from 'react'
import { __ } from '@wordpress/i18n';
import CertificateContent from './CertificateContent';

const CertificateInit = ({
  certificate_id = null,
}) => {

  const { data, isFetching, error } = GetUserCertificateById(certificate_id);

  if(isFetching) {
    return (
      <Box>{__('Loading...', 'acadlix')}</Box>
    )
  }

  if (!certificate_id || error) {
    return (
      <Box>{__('Certificate does not exist', 'acadlix')}</Box>
    )
  }

  return (
    <CertificateContent
      certificate_id={certificate_id}
      data={data?.data?.certificate?.meta_value ?? {}}
    />
  )
}

export default CertificateInit
