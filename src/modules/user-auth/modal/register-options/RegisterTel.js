import CustomTextField from '@acadlix/components/CustomTextField';
import { formatPhoneCode } from '@acadlix/helpers/util';
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { Country } from 'country-state-city';
import React from 'react'

const RegisterTel = (props) => {
  console.log(props?.data);

  return (
    <Grid size={{ xs: 12, lg: 12 }}>
      <Typography component={"div"} variant='body2'>
        {props?.data?.label}
        {
          props?.data?.required && <span style={{ color: "red" }}> *</span>
        }
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
          <Autocomplete
            {...props?.register(`data.${props?.index}.settings.phonecode.value`, {
              required: {
                value: props?.data?.required,
                message: `${props?.data?.name} is required`
              }
            })}
            fullWidth
            autoCapitalize="off"
            id={props?.data?.id + "_country_code"}
            size='small'
            // disableClearable
            disabled={props?.disabled || false}
            options={Country.getAllCountries()}
            getOptionLabel={(option) => `${formatPhoneCode(option.phonecode)} (${option.name})`}
            value={
              props?.data?.settings?.phonecode?.value !== null
                ? Country?.getAllCountries()?.find(
                  (country) => {
                    const isocode = props?.data?.settings?.isocode?.value;
                    if (isocode) {
                      return (
                        country.isoCode === isocode &&
                        country.phonecode === props?.data?.settings?.phonecode?.value
                      );
                    }
                    return (
                      country?.phonecode ===
                      props?.data?.settings?.phonecode?.value
                    );
                  }
                ) ?? null
                : null
            }
            onChange={(_, newValue) => {
              props?.setValue(`data.${props?.index}.settings.phonecode.value`, newValue?.phonecode || null, {
                shouldDirty: true,
              });
              props?.setValue(`data.${props?.index}.settings.isocode.value`, newValue?.isoCode || null, {
                shouldDirty: true,
              });
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {formatPhoneCode(option.phonecode)} ({option.name})
              </Box>
            )}
            slotProps={{
              popupIndicator: {
                className: "acadlix-icon-btn"
              },
              clearIndicator: {
                className: "acadlix-icon-btn"
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "code",
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "auto",
                  },
                }}
                error={Boolean(props.formState.errors.data?.[props?.index]?.settings?.phonecode?.value)}
                helperText={props.formState.errors.data?.[props?.index]?.settings?.phonecode?.value?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
          <CustomTextField
            {...props?.register(`data.${props?.index}.value`, {
              required: {
                value: props?.data?.required,
                message: `${props?.data?.name} is required`
              }
            })}
            fullWidth
            size='small'
            autoComplete="off"
            autoCapitalize="off"
            type={props?.data?.type || "tel"}
            name={props?.data?.id}
            disabled={props?.disabled || false}
            placeholder={props?.data?.placeholder || ""}
            onChange={(e) => {
              props?.setValue(`data.${props?.index}.value`,
                e.target.value,
                {
                  shouldDirty: true,
                }
              );
            }}
            error={Boolean(props?.formState?.errors?.data?.[props?.index]?.value)}
            helperText={props?.formState?.errors?.data?.[props?.index]?.value?.message}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RegisterTel