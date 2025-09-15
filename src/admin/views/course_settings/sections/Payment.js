import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const Payment = (props) => {
  const payment_after = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course_settings.payment.after",
    [],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {__('Price (0 => Free)', 'acadlix')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("meta.price") ?? 0}
                onChange={(e) => {
                  props?.setValue("meta.price", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                onKeyDown={props?.handleKeyDown}
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
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {__("Activate Sale Price", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                checked={props?.watch("meta.enable_sale_price")}
                control={<Checkbox />}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue("meta.enable_sale_price", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }
                }}
                onKeyDown={props?.handleKeyDown}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {__("Sale Price", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("meta.sale_price") ?? 0}
                onChange={(e) => {
                  props?.setValue("meta.sale_price", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                onKeyDown={props?.handleKeyDown}
                disabled={!props?.watch("meta.enable_sale_price")}
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {__("Tax", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                checked={props?.watch("meta.tax")}
                control={<Checkbox />}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue("meta.tax", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }
                }}
                onKeyDown={props?.handleKeyDown}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {__("Tax (%)", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                disabled={!props?.watch("meta.tax")}
                value={props?.watch("meta.tax_percent") ?? 0}
                onChange={(e) => {
                  props?.setValue("meta.tax_percent", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                onKeyDown={props?.handleKeyDown}
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
        </Grid>

        {payment_after.map((field, i) => (
          <React.Fragment key={i}>
            <DynamicMUIRenderer
              item={field}
              index={i}
              formProps={{
                register: props?.register,
                setValue: props?.setValue,
                watch: props?.watch,
                control: props?.control,
              }}
            />
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default Payment;
