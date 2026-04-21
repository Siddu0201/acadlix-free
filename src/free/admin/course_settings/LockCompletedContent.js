import { Checkbox, FormControlLabel, Grid } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'

const LockCompletedContent = (props) => {
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
        // checked={props?.watch("lock_completed_content")}
        // onChange={(e) => {
        // if(e.target.checked !== undefined){
        //   props?.methods?.setValue("lock_completed_content", e.target.checked, {
        //     shouldDirty: true,
        //   });
        // }
        // }}
        disabled
      />
    </Grid>
  )
}

export default LockCompletedContent