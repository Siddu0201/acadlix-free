import { Grid, Card, CardContent, Box, Typography, Divider, Autocomplete, TextField } from '@mui/material'
import React from 'react'
import CustomTypography from '@acadlix/components/CustomTypography'
import GridItem1 from '@acadlix/components/GridItem1'
import { __ } from '@wordpress/i18n'
import CustomTextField from '@acadlix/components/CustomTextField'
import { Country } from 'country-state-city'
import { formatPhoneCode } from '@acadlix/helpers/util'

const OrderBillingInfo = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Box sx={{ marginY: 2 }}>
            <Box sx={{ color: "black" }}>
              <Typography variant="h4">
                {__("Billing Info", "acadlix")}
              </Typography>
              <Divider />
            </Box>
          </Box>
          <Grid
            container
            spacing={{ xs: 2, sm: 4 }}
            alignItems="center"
          >
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__("First Name", "acadlix")} <span style={{ color: "red" }}>*</span></CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 4 }}>
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
                error={Boolean(
                  props?.formState?.errors?.billing_info?.first_name
                )}
                helperText={
                  props?.formState?.errors?.billing_info?.first_name?.message
                }
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__("Last Name", "acadlix")} </CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 4 }}>
              <CustomTextField
                {...props?.register("billing_info.last_name")}
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
                error={Boolean(
                  props?.formState?.errors?.billing_info?.last_name
                )}
                helperText={
                  props?.formState?.errors?.billing_info?.last_name?.message
                }
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__("Email", "acadlix")} <span style={{ color: "red" }}>*</span></CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 10 }}>
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
                error={Boolean(props?.formState?.errors?.billing_info?.email)}
                helperText={
                  props?.formState?.errors?.billing_info?.email?.message
                }
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__("Code", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <Autocomplete
                fullWidth
                id="phonecode"
                autoComplete
                size="small"
                options={Country.getAllCountries()}
                getOptionLabel={(option) =>
                  `${formatPhoneCode(option.phonecode)} (${option.name})`
                }
                value={
                  props.watch("billing_info.phonecode") !== null
                    ? Country?.getAllCountries()?.find(
                      (country) => {
                        const isocode = props.watch("billing_info.isocode");
                        if (isocode) {
                          return (
                            country.isoCode === isocode &&
                            country.phonecode === props?.watch("billing_info.phonecode")
                          );
                        }
                        return (
                          country?.phonecode ===
                          props?.watch("billing_info.phonecode")
                        );
                      }
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
                  props.setValue(
                    "billing_info.isocode",
                    newValue?.isoCode,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      fontSize: "11px",
                    }}
                  >
                    {formatPhoneCode(option.phonecode)} ({option.name})
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
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__("Phone Number", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 5 }}>
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
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__("Address", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 10 }}>
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
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__('Country', 'acadlix')}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
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
                  props.setValue("billing_info.country_code", newValue?.isoCode, {
                    shouldDirty: true,
                  });
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
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "auto",
                      },
                    }}
                  />
                )}
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__('Town/City', 'acadlix')}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTextField
                fullWidth
                size="small"
                placeholder={__("e.g. Town/City", "acadlix")}
                type="text"
                value={props?.watch("billing_info.city")}
                onChange={(e) => {
                  props?.setValue("billing_info.city", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTypography>{__('Postal/Zip Code', 'acadlix')}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 2 }}>
              <CustomTextField
                fullWidth
                size="small"
                placeholder={__("e.g. Postal/Zip Code", "acadlix")}
                type="text"
                value={props?.watch("billing_info.zip_code")}
                onChange={(e) => {
                  props?.setValue("billing_info.zip_code", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </GridItem1>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default OrderBillingInfo