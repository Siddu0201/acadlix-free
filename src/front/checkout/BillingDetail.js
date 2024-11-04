import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../components/CustomTextField";
import { Country } from "country-state-city";

const BillingDetail = (props) => {
  return (
    <Box>
      <Card>
        <CardHeader title="Billing Detail" />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                First Name
              </Typography>
              <CustomTextField
                {...props?.register("billing_info.first_name", {
                  required: "First name is required.",
                })}
                required
                fullWidth
                size="small"
                type="text"
                placeholder="e.g. Alex"
                value={props?.watch("billing_info.first_name")}
                onChange={(e) => {
                  props?.setValue("billing_info.first_name", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                error={Boolean(props?.formState?.errors?.billing_info?.first_name)}
                helperText={props?.formState?.errors?.billing_info?.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Last Name
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                type="text"
                placeholder="e.g. Smith"
                value={props?.watch("billing_info.last_name")}
                onChange={(e) => {
                  props?.setValue("billing_info.last_name", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Email
              </Typography>
              <CustomTextField
                {...props?.register("billing_info.email", {
                  required: "Email is required.",
                })}
                required
                fullWidth
                size="small"
                type="email"
                placeholder="e.g. alexsmith@gmail.com"
                value={props?.watch("billing_info.email")}
                onChange={(e) => {
                  props?.setValue("billing_info.email", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                error={Boolean(props?.formState?.errors?.billing_info?.email)}
                helperText={props?.formState?.errors?.billing_info?.email?.message}
              />
            </Grid>
            <Grid item xs={3} md={3}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Code
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
                          country?.phonecode === props?.watch("billing_info.phonecode")
                      ) ?? null
                    : null
                }
                onChange={(_, newValue) => {
                  props.setValue("billing_info.phonecode", newValue?.phonecode, {
                    shouldDirty: true,
                  });
                }}
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={9} md={9}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Phone Number
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                type="tel"
                value={props?.watch("billing_info.phone_number")}
                onChange={(e) => {
                  props?.setValue("billing_info.phone_number", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Address
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder="e.g. 12345 Little baker St, Melbourne"
                type="text"
                value={props?.watch("billing_info.address")}
                onChange={(e) => {
                  props?.setValue("billing_info.address", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Website
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder="e.g. www.acadlix.com"
                type="text"
                value={props?.watch("billing_info.user_url")}
                onChange={(e) => {
                  props?.setValue("billing_info.user_url", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Country
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
                        (country) => country?.name === props.watch("billing_info.country")
                      ) ?? null
                    : null
                }
                onChange={(_, newValue) => {
                  props.setValue("billing_info.country", newValue?.name, {
                    shouldDirty: true,
                  });
                }}
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Town/City
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder="Town/City"
                type="text"
                value={props?.watch("billing_info.city")}
                onChange={(e) => {
                  props?.setValue("billing_info.city", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  paddingY: 1,
                }}
              >
                Postal/Zip Code
              </Typography>
              <CustomTextField
                fullWidth
                size="small"
                placeholder="Postal/Zip Code"
                type="text"
                value={props?.watch("billing_info.zip_code")}
                onChange={(e) => {
                  props?.setValue("billing_info.zip_code", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingDetail;
