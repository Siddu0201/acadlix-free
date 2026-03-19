import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { __ } from '@wordpress/i18n';

const ModernLandscape = (props) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
    },
    // This container holds the background image
    background: {
      position: 'absolute',
      minWidth: '100%',
      minHeight: '100%',
      display: 'block',
      height: '100%',
      width: '100%',
    },

  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* The background image must come FIRST */}
        <Image
          src={`${acadlixOptions?.certificate_url_path}modern-landscape-bg.png`}
          style={styles.background}
          fixed // Ensures it stays there if you have multiple pages
        />

        {/* The content container */}
        <View style={{
          padding: 4,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 100,
        }}>
          <Text style={{
            fontSize: 56,
            fontWeight: 'bold',
            letterSpacing: 10,
            textTransform: 'uppercase'
          }}>
            {__('Certificate', 'acadlix')}
          </Text>
          <Text style={{
            fontSize: 24,
            paddingTop: 2,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>
            {__('of Achievement', 'acadlix')}
          </Text>
          <Text style={{
            fontSize: 16,
            paddingTop: 20,
            paddingBottom: 10,
            textTransform: 'uppercase'
          }}>
            {__('This is to certify', 'acadlix')}
          </Text>
          <Text style={{
            fontSize: 28,
            fontStyle: 'italic',
            color: '#af4c0f',
          }}>
            {props?.watch('user_name') || ""}
          </Text>
          <Text style={{
            fontSize: 16,
            paddingTop: 10,
            paddingBottom: 10,
            textTransform: 'uppercase'
          }}>
            {__('successfully completed the', 'acadlix')}
          </Text>
          <Text style={{
            fontSize: 28,
            maxWidth: 600,
            fontStyle: 'italic',
            color: '#af4c0f',
            textAlign: 'center',
          }}>
            {props?.watch('course_name') || ""}
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
            bottom: 100,
            // paddingTop: 60,
            paddingLeft: 110,
            paddingRight: 100,
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              justifyContent: 'flex-end',
              maxWidth: 280,
              flex: 1,
            }}>
              {
                props?.watch('acadlix_certificate_show_instructor_name_on_certificate') && (
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    flexWrap: 'wrap'
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                      {__('Instructor:', 'acadlix')}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      flex: 1,
                      flexWrap: 'wrap'
                    }}>
                      {props?.watch('instructor') || ""}
                    </Text>
                  </View>
                )
              }
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
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                    {props?.watch('acadlix_certificate_authorised_name') || ""}
                  </Text>
                )
              }
              {
                props?.watch('acadlix_certificate_authorised_company') && (
                  <Text style={{
                    fontSize: 12,
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
  );
};

export default ModernLandscape;