import CustomTextField from '@acadlix/components/CustomTextField'
import GridItem1 from '@acadlix/components/GridItem1'
import React from 'react'
import { __ } from "@wordpress/i18n";

const SubjectWiseText = (props) => {
  return (
    <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
      <CustomTextField
        fullWidth
        size="small"
        label={__("Subject Wise Text", "acadlix")}
        disabled
        value={props?.watch("meta.quiz_settings.subject_wise_text") ?? __("Subject Wise Result", "acadlix")}
        // onChange={(e) => {
        //     props?.setValue("meta.quiz_settings.subject_wise_text",
        //         Number(e?.target?.value), {
        //         shouldDirty: true,
        //     });
        // }}
        // disabled={
        //   props?.watch("meta.quiz_settings.hide_result") ||
        //   !props?.watch("meta.quiz_settings.show_subject_wise_analysis")
        // }
      />
    </GridItem1>
  )
}

export default SubjectWiseText