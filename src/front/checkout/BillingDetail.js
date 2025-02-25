import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomTextField from "../../components/CustomTextField";
import { Country } from "country-state-city";
import { __ } from "@wordpress/i18n";

const BillingDetail = (props) => {
  return (
    <Box>
      <Card>
        <CardHeader title={__('Billing Detail', 'acadlix')} />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('First Name', 'acadlix')}
              </Typography>
              <CustomTextField
                {...props?.register("billing_info.first_name", {
                  required: __("First name is required.", "acadlix"),
                })}
                required
                fullWidth
                size="small"
                type="text"
                placeholder={__('e.g. John', 'acadlix')}
                value={props?.watch("billing_info.first_name")}
                onChange={(e) => {
                  props?.setValue("billing_info.first_name", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
                error={Boolean(
                  props?.formState?.errors?.billing_info?.first_name
                )}
                helperText={
                  props?.formState?.errors?.billing_info?.first_name?.message
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Last Name', 'acadlix')}
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                type="text"
                placeholder={__('e.g. Doe', 'acadlix')}
                value={props?.watch("billing_info.last_name")}
                onChange={(e) => {
                  props?.setValue("billing_info.last_name", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Email', 'acadlix')}
              </Typography>
              <CustomTextField
                {...props?.register("billing_info.email", {
                  required: __("Email is required.", "acadlix"),
                })}
                required
                fullWidth
                size="small"
                type="email"
                placeholder={__("e.g. example@example.com", "acadlix")}
                value={props?.watch("billing_info.email")}
                onChange={(e) => {
                  props?.setValue("billing_info.email", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
                error={Boolean(props?.formState?.errors?.billing_info?.email)}
                helperText={
                  props?.formState?.errors?.billing_info?.email?.message
                }
              />
            </Grid>
            <Grid size={{ xs: 3, md: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Code', 'acadlix')}
              </Typography>
              <Autocomplete
                fullWidth
                id="phonecode"
                autoComplete
                size="small"
                options={Country.getAllCountries()}
                getOptionLabel={(option) =>
                  `${option.phonecode} (${option.isoCode})`
                }
                value={
                  props.watch("billing_info.phonecode") !== null
                    ? Country?.getAllCountries()?.find(
                      (country) =>
                        country?.phonecode ===
                        props?.watch("billing_info.phonecode")
                    ) ?? null
                    : null
                }
                onChange={(_, newValue) => {
                  props.setValue(
                    "billing_info.phonecode",
                    newValue?.phonecode,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
                disabled={!props?.watch("is_user_logged_in")}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      fontSize: "11px",
                    }}
                  >
                    {option.phonecode} ({option.isoCode})
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Code"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "code",
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "auto",
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 9, md: 9 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Phone Number', 'acadlix')}
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                type="tel" // Input type for telephone numbers
                value={props?.watch("billing_info.phone_number")}
                onChange={(e) => {
                  const inputValue = e?.target?.value;
                  if (/^[0-9\-\(\) ]+$/.test(inputValue) || inputValue === '') {
                    props?.setValue(
                      "billing_info.phone_number",
                      inputValue,
                      {
                        shouldDirty: true,
                      }
                    );
                  }
                }}
                disabled={!props?.watch("is_user_logged_in")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Address', 'acadlix')}
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder={__("e.g. 12345 Little baker St, Melbourne", "acadlix")}
                type="text"
                value={props?.watch("billing_info.address")}
                onChange={(e) => {
                  props?.setValue("billing_info.address", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__('Country', 'acadlix')}
              </Typography>
              <Autocomplete
                fullWidth
                id="country"
                autoComplete
                size="small"
                options={Country.getAllCountries()}
                getOptionLabel={(option) => `${option.name}`}
                value={
                  props.watch("billing_info.country") !== null
                    ? Country.getAllCountries()?.find(
                      (country) =>
                        country?.name === props.watch("billing_info.country")
                    ) ?? null
                    : null
                }
                onChange={(_, newValue) => {
                  props.setValue("billing_info.country", newValue?.name, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      fontSize: "11px",
                    }}
                  >
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="country"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "country",
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "auto",
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__("Town/City", "acadlix")}
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder={__("Town/City", "acadlix")}
                type="text"
                value={props?.watch("billing_info.city")}
                onChange={(e) => {
                  props?.setValue("billing_info.city", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                {__("Postal/Zip Code", "acadlix")}
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder={__("Postal/Zip Code", "acadlix")}
                type="text"
                value={props?.watch("billing_info.zip_code")}
                onChange={(e) => {
                  props?.setValue("billing_info.zip_code", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                disabled={!props?.watch("is_user_logged_in")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingDetail;
