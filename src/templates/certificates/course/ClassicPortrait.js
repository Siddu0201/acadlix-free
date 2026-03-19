import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { __ } from '@wordpress/i18n';

const ClassicPortrait = (props) => {
  return (
    <Document title={`${props?.watch("certificate_id") || ""}`}>
      <Page size="A4" orientation='portrait'>

        <View style={{
          padding: 4,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: "flex-start",
          paddingLeft: 20,
          paddingTop: 160,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: "gray"
          }}>
            {__('Certificate of Completion', 'acadlix')}
          </Text>
          <Text style={{
            fontSize: 56,
            maxWidth: 600,
            fontWeight: 'bold',
            paddingTop: 5,
          }}>
            {props?.watch('course_name') || ""}
          </Text>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            flexWrap: 'wrap',
            paddingTop: 20,
          }}>
            <Text style={{
              fontSize: 12,
            }}>
              {__('Instructor:', 'acadlix')}
            </Text>
            <Text style={{
              fontSize: 12,
              fontWeight: 'bold',
            }}>
              {props?.watch('instructor') || ""}
            </Text>
          </View>
        </View>
      </Page>
    </Document >
  )
}

export default ClassicPortrait