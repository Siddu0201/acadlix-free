import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip'
import CustomSwitch from '@acadlix/components/CustomSwitch'
import { Box, FormControlLabel } from '@mui/material'
import React from 'react'
import { __ } from "@wordpress/i18n";

const AutoCheckButton = (props) => {
  return (
    <FormControlLabel
      control={
        <CustomSwitch
          // checked={props?.watch("meta.quiz_settings.auto_check") ?? false}
          // onChange={(e) => {
          //     props?.setValue(
          //         "meta.quiz_settings.auto_check",
          //         e?.target?.checked,
          //         {
          //             shouldDirty: true,
          //         }
          //     );
          // }}
          disabled
        // disabled={
        //     props?.watch("meta.mode") !== "check_and_continue"
        // }
        />
      }
      label={
        <Box display="flex" alignItems="center" gap={1}>
          {__("Auto Check", 'acadlix')}
          <CustomFeatureTooltip
            plan={acadlixOptions?.isActive ? "open" : "closed"}
            msg={__("Enable this option to automatically check answers as users progress through the quiz for single-choice and true-false.", "acadlix")}
            placement="right-start"
          />
        </Box>
      }
    />
  )
}

export default AutoCheckButton