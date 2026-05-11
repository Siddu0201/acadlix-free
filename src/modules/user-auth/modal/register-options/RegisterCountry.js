import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { Country } from 'country-state-city';
import React from 'react'

const RegisterCountry = (props) => {
  return (
    <Grid size={{ xs: 12, lg: 12 }}>
      <Typography component={"div"} variant='body2'>
        {props?.data?.label}
        {
          props?.data?.required && <span style={{ color: "red" }}> *</span>
        }
      </Typography>
      <Autocomplete
        {...props?.register(`data.${props?.index}.value`, {
          required: {
            value: props?.data?.required,
            message: `${props?.data?.name} is required`
          }
        })}
        fullWidth
        slotProps={{
          popper: {
            modifiers: [
              { name: 'flip', enabled: false },
            ],
          },
          popupIndicator: {
            className: "acadlix-icon-btn",
          },
          clearIndicator: {
            className: "acadlix-icon-btn",
          }
        }}
        id="acadlix-country"
        size="small"
        disabled={props?.disabled || false}
        options={Country.getAllCountries()}
        getOptionLabel={(option) => `${option.name}`}
        value={
          props?.watch(`data.${props?.index}.value`) !== null
            ? Country.getAllCountries()?.find(
              (country) =>
                country?.name === props?.watch(`data.${props?.index}.value`)
            ) ?? null
            : null
        }
        onChange={(_, newValue) => {
          props?.setValue(`data.${props?.index}.value`, newValue?.name, {
            shouldDirty: true,
          });
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;

          return (
            <Box
              component="li"
              key={key}
              {...optionProps}
              sx={{
                fontSize: "11px",
              }}
            >
              {option.name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={props?.data?.placeholder || "country"}
            inputProps={{
              ...params.inputProps,
              autoComplete: "acadlix-country",
            }}
            sx={{
              "& .MuiInputBase-input": {
                height: "auto",
              },
            }}
            error={Boolean(props?.formState?.errors?.data?.[props?.index]?.value)}
            helperText={props?.formState?.errors?.data?.[props?.index]?.value?.message}
          />
        )}
      />
    </Grid>
  )
}

export default RegisterCountry