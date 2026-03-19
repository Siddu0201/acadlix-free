import TemplateRenderer from '@acadlix/templates/TemplateRenderer'
import { PDFViewer } from '@react-pdf/renderer'
import React from 'react'

const ViewCertificate = (props) => {
  return (
    <PDFViewer width="100%" height="600">
      <TemplateRenderer
        type="certificates"
        subtype="course"
        template={props.watch('template')}
        {...props}
      />
    </PDFViewer>
  )
}

export default ViewCertificate