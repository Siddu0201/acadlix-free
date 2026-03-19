import React from 'react'
import { useForm } from 'react-hook-form'
import { __ } from '@wordpress/i18n';
import ViewCertificate from './sections/ViewCertificate';
import { getFormatDate } from '@acadlix/helpers/util';

const CertificateContent = (props) => {
  const methods = useForm({
    defaultValues: {
      certificate_id: props?.certificate_id || "",
      logo: props?.data?.logo ?? "",
      acadlix_certificate_authorised_name:
        props?.data?.acadlix_certificate_authorised_name ?? "",
      acadlix_certificate_authorised_company:
        props?.data?.acadlix_certificate_authorised_company ?? "",
      acadlix_certificate_show_instructor_name_on_certificate:
        Boolean(props?.data?.acadlix_certificate_show_instructor_name_on_certificate == "yes") ?? false,
      acadlix_certificate_show_course_completion_date_on_certificate:
        Boolean(props?.data?.acadlix_certificate_show_course_completion_date_on_certificate == "yes") ?? false,
      acadlix_certificate_signature:
        props?.data?.acadlix_certificate_signature ?? {},
      instructor: props?.data?.instructor ?? "",
      user_name: props?.data?.user_name ?? "",
      course_name: props?.data?.course_name ?? "",
      completion_date: getFormatDate(props?.data?.completion_date * 1000) ?? "",
      template: props?.data?.template ?? "classic-landscape",

      // logo: acadlixOptions?.logo_url ?? "",
      // acadlix_certificate_authorised_name:
      //   acadlixOptions?.settings?.acadlix_certificate_authorised_name ?? "",
      // acadlix_certificate_authorised_company:
      //   acadlixOptions?.settings?.acadlix_certificate_authorised_company ?? "",
      // acadlix_certificate_show_instructor_name_on_certificate:
      //   Boolean(acadlixOptions?.settings?.acadlix_certificate_show_instructor_name_on_certificate == "yes") ?? false,
      // acadlix_certificate_show_course_completion_date_on_certificate:
      //   Boolean(acadlixOptions?.settings?.acadlix_certificate_show_course_completion_date_on_certificate == "yes") ?? false,
      // acadlix_certificate_signature:
      //   acadlixOptions?.settings?.acadlix_certificate_signature ?? {},
      // instructor: "John Doe",
      // user_name: "John Wick",
      // course_name: "Introduction to React",
      // completion_date: getFormatDate(props?.data?.completion_date * 1000) ?? "",
      // template: "classic-landscape",
    }
  });

  if (process?.env?.REACT_APP_MODE === 'development') {
    console.log(methods.watch());
  }
  
  return (
    <ViewCertificate {...methods} />
  )
}

export default CertificateContent


