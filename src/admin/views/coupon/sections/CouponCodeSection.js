import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react'
import CustomTextField from '@acadlix/components/CustomTextField';
import { __ } from '@wordpress/i18n';
import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip';

const CouponCodeSection = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, sm: 4 }}
          >
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography variant="h4">
                {__("Coupon Code", "acadlix")}
                <span style={{ color: "red" }}>*</span>
                <CustomFeatureTooltip
                  plan={"open"}
                  msg={__("Enter the code for the coupon. This will be used by customers to apply the discount.", "acadlix")}
                />
              </Typography>
            </Grid>
            {/* Used to enter coupon code  */}
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                {...props?.register("code", { required: "Coupon code is required." })}
                fullWidth
                name="code"
                size="small"
                label={__("Enter coupon code", "acadlix") + " *"}
                value={props?.watch("code") ?? ""}
                onChange={(e) => {
                  props?.setValue("code", e?.target?.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                error={Boolean(props?.formState?.errors?.code)}
                helperText={props?.formState?.errors?.code?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                {...props?.register("post_content", {
                  required: "Coupon description is required.",
                })}
                fullWidth
                name="post_content"
                size="small"
                label={__("Enter coupon description", "acadlix")+ " *"}
                value={props?.watch("post_content") ?? ""}
                onChange={(e) => {
                  props?.setValue("post_content", e?.target?.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                error={Boolean(props?.formState?.errors?.post_content)}
                helperText={props?.formState?.errors?.post_content?.message}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CouponCodeSection