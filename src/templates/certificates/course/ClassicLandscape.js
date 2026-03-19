import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import React from 'react'
import { __ } from '@wordpress/i18n';

const ClassicLandscape = (props) => {
  return (
    <Document>
      <Page size="A4" orientation='landscape'>

        <View style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: "flex-start",
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: props?.watch("logo") ? 10 : 80,
        }}>
          {
            props?.watch('logo') &&
            <Image
              src={props?.watch('logo') || ""}
              style={{
                width: 140,
                height: 140,
                objectFit: 'contain',
                paddingBottom: 10,
              }}
            />
          }
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
            maxWidth: 800,
            fontWeight: 'bold',
            paddingTop: 5,
          }}>
            {props?.watch('course_name') || ""}
          </Text>
          {
            props?.watch('acadlix_certificate_show_instructor_name_on_certificate') && (
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
            )
          }
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 60,
            position: 'absolute',
            bottom: 100,
            // right: 10,
            paddingRight: 60,
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              maxWidth: 280,
            }}>
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
              }}>
                {props?.watch('user_name') || ""}
              </Text>
              {
                props?.watch('acadlix_certificate_show_course_completion_date_on_certificate') && (
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                      {__('Completion Date:', 'acadlix')}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                    }}>
                      {props?.watch('completion_date') || ""}
                    </Text>
                  </View>
                )
              }
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                maxWidth: 220,
              }}
            >
              {
                props?.watch('acadlix_certificate_signature')?.url && (
                  <Image
                    src={props?.watch('acadlix_certificate_signature')?.url || ""}
                    style={{
                      width: 100,
                      height: 50,
                      objectFit: 'contain',
                    }}
                  />
                )
              }
              {
                props?.watch('acadlix_certificate_authorised_name') && (
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                    {props?.watch('acadlix_certificate_authorised_name') || ""}
                  </Text>
                )
              }
              {
                props?.watch('acadlix_certificate_authorised_company') && (
                  <Text style={{
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                    {props?.watch('acadlix_certificate_authorised_company') || ""}
                  </Text>
                )
              }
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ClassicLandscape