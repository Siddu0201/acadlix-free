import React from 'react'
import { Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { __ } from '@wordpress/i18n';
import CustomTextField from '../../../../components/CustomTextField';

const TitleSection = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={4}
            sx={{
              color: "black",
            }}
          >
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography variant="h6">
                {__("Assignment Title", "acadlix")}
              </Typography>
            </Grid>
            {/* Used to enter quiz title  */}
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                {...props?.register("title", { required: "Title is required." })}
                fullWidth
                name="title"
                size="small"
                label={__("Assignment Title", "acadlix")}
                value={props?.watch("title")}
                onChange={(e) => {
                  props?.setValue("title", e?.target?.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                error={Boolean(props?.formState?.errors?.title)}
                helperText={props?.formState?.errors?.title?.message}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default TitleSection