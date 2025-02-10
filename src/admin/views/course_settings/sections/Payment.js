import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const Payment = (props) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {`Price (0 => Free)`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
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
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Activate Sale Price
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControlLabel
                label="Activate"
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
        <Grid item xs={12} sm={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Sale Price
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
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
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Tax
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControlLabel
                label="Activate"
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
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {`Tax (%)`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
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
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
