import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
                value={props?.watch("price") ?? 0}
                onChange={(e) => {
                  props?.setValue("price", Number(e?.target?.value), {
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
                checked={props?.watch("enable_sale_price")}
                control={<Checkbox />}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue("enable_sale_price", e?.target?.checked, {
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
                value={props?.watch("sale_price") ?? 0}
                onChange={(e) => {
                  props?.setValue("sale_price", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                onKeyDown={props?.handleKeyDown}
                disabled={!props?.watch("enable_sale_price")}
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
                {`Validity (0 => Unlimited)`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("validity") ?? 0}
                onChange={(e) => {
                  props?.setValue("validity", Number(e?.target?.value), {
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
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Validity type
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch("validity_type")}
                  onChange={(e) => {
                    props?.setValue("validity_type", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="day">Day(s)</MenuItem>
                  <MenuItem value="month">Month(s)</MenuItem>
                  <MenuItem value="year">Year(s)</MenuItem>
                </Select>
              </FormControl>
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
                checked={props?.watch("tax")}
                control={<Checkbox />}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue("tax", e?.target?.checked, {
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
                value={props?.watch("tax_percent") ?? 0}
                onChange={(e) => {
                  props?.setValue("tax_percent", Number(e?.target?.value), {
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
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Allow Repurchase
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControlLabel
                label="Activate"
                checked={props?.watch("allow_repurchase")}
                control={<Checkbox />}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue("allow_repurchase", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }
                }}
                onKeyDown={props?.handleKeyDown}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
