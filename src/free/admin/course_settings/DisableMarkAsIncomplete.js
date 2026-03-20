import { Checkbox, FormControlLabel, Grid } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'

const DisableMarkAsIncomplete = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <FormControlLabel
        label={__("Activate", "acadlix")}
        control={
          <Checkbox
            slotProps={{
              input: {
                sx: {
                  opacity: `0 !important`,
                }
              }
            }}
          />
        }
        // checked={props?.watch("disable_mark_as_incomplete")}
        // onChange={(e) => {
        //   props?.methods?.setValue("disable_mark_as_incomplete", e.target.checked, {
        //     shouldDirty: true,
        //   });
        // }}
        disabled
      />
    </Grid>
  )
}

export default DisableMarkAsIncomplete