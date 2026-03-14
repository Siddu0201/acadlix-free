import React from 'react'
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { __ } from '@wordpress/i18n';
import CustomTextField from '@acadlix/components/CustomTextField';
import CustomTypography from '@acadlix/components/CustomTypography';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers';
import { convertToPostDate } from '@acadlix/helpers/util';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import dayjs from 'dayjs';

const CouponOptionSection = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, sm: 4 }}
            alignItems="center"
          >
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography variant="h4">
                {__('Coupon Options', 'acadlix')}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Disable Coupon", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                control={<CustomSwitch />}
                checked={props?.watch("meta.disable_coupon") ?? false}
                onChange={(e) => {
                  props?.setValue("meta.disable_coupon", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
                label={__("Activate", "acadlix")}
              />
            </Grid>
            <Grid size={{ xs: 0, sm: 0, lg: 6 }} sx={{
              display: { xs: "none", sm: "none", lg: "block" },
            }}></Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Discount Type", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel id="demo-simple-discount-label">
                  {__("Discount Type", "acadlix")}
                </InputLabel>
                <Select
                  labelId="demo-simple-discount-label"
                  id="demo-simple-discount-select"
                  value={props?.watch("meta.discount_type") ?? "percentage"}
                  label={__("Discount Type", "acadlix")}
                  onChange={(e) => {
                    props?.setValue("meta.discount_type", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="percentage">{__("Percentage", "acadlix")}</MenuItem>
                  <MenuItem value="flat">{__("Flat", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Discount", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                label={__("Discount", "acadlix")}
                size="small"
                type="number"
                value={props?.watch("meta.discount") ?? 0}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
                onChange={(e) => {
                  props?.setValue("meta.discount", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Minimum Purchase Amount", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                label={__("Minimum Purchase Amount", "acadlix")}
                size="small"
                type="number"
                value={props?.watch("meta.minimum_purchase_amount") ?? 0}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
                onChange={(e) => {
                  props?.setValue("meta.minimum_purchase_amount", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Expiry date", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <DemoContainer components={["DateTimePicker"]} sx={{
                "& .MuiFormControl-root ": {
                  minWidth: "100% !important",
                },
              }}>
                <DateTimePicker
                  label={__("Enter Expiry Date", "acadlix")}
                  format="DD/MM/YYYY hh:mm:a"
                  timeSteps={{
                    minutes: 1,
                  }}
                  sx={{
                    "& .MuiFormControl-root ": {
                      maxHeight: "42px",
                    },
                    ".MuiInputBase-input": {
                      padding: "9px 14px !important",
                    },
                    ".MuiFormLabel-root": {
                      top: "-7px !important",
                    },
                    ".MuiInputLabel-shrink": {
                      top: "0px !important",
                    },
                  }}
                  value={
                    props?.watch("meta.expiry_date")
                      ? dayjs(props?.watch("meta.expiry_date"))
                      : null
                  }
                  onChange={(value) => {
                    props?.setValue("meta.expiry_date", convertToPostDate(value), {
                      shouldDirty: true,
                    });
                  }}
                />
              </DemoContainer>
              {props?.formState?.errors?.meta?.expiry_date && (
                <Typography component="p" color="error">
                  {props?.formState?.errors?.meta?.expiry_date?.message}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Usage limit per coupon", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                label={__("Usage Limit per Coupon (0 => ∞)", "acadlix")}
                size="small"
                type="number"
                value={props?.watch("meta.usage_limit_per_coupon") ?? 0}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
                onChange={(e) => {
                  props?.setValue("meta.usage_limit_per_coupon", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Usage limit per user", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                label={__("Usage Limit per User (0 => ∞)", "acadlix")}
                size="small"
                type="number"
                value={props?.watch("meta.usage_limit_per_user") ?? 0}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
                onChange={(e) => {
                  props?.setValue("meta.usage_limit_per_user", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CouponOptionSection