import TemplateRenderer from '@acadlix/templates/TemplateRenderer'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import React from 'react'

const ViewCertificate = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const certificateDocument = (
    <TemplateRenderer
      type="certificates"
      subtype="course"
      template={props.watch('template')}
      {...props}
    />
  );

  return (
    <>
      {isMobile ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}>
          <PDFDownloadLink
            document={certificateDocument}
            fileName={`certificate-${props.watch('certificate_id') ?? ''}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Button variant="contained" >
                {loading ? 'Preparing PDF...' : 'Download Certificate'}
              </Button>
            )}
          </PDFDownloadLink>
        </Box>
      ) : (
        <PDFViewer width="100%" height="100%">
          {certificateDocument}
        </PDFViewer>
      )}
    </>
  )
}

export default ViewCertificate