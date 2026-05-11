import CustomTextField from '@acadlix/components/CustomTextField';
import { Grid, Typography } from '@mui/material'
import React from 'react'

const RegisterText = (props) => {
  let lg = 12;
  if (props?.data?.settings?.width == "50%") {
    lg = 6;
  }
  return (
    <Grid size={{ xs: 12, lg: lg }}>
      <Typography component={"div"} variant='body2'>
        {props?.data?.label}
        {
          props?.data?.required && <span style={{ color: "red" }}> *</span>
        }
      </Typography>
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
        type={props?.data?.type || "text"}
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
  )
}

export default RegisterText