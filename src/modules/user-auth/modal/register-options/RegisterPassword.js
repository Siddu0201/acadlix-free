import PasswordTextField from '@acadlix/components/PasswordTextField';
import { Grid, Typography } from '@mui/material';
import React from 'react'
import { __, sprintf } from '@wordpress/i18n';

const RegisterPassword = (props) => {
  const validationRules = {
    required: {
      value: props?.data?.required,
      message: `${props?.data?.name} is required`
    },
    minLength: {
      value: 8,
      message: sprintf(__("%s must be at least 8 characters long", "acadlix"), props?.data?.name)
    }
  };

  if (props.data?.id === "confirm_password") {
    validationRules.validate = (value) => {
      const password = props?.watch("data")?.find(d => d.id === "password")?.value;
      return value === password || __("Your Passwords do not match", "acadlix");
    };
  }

  return (
    <Grid size={{ xs: 12, lg: 12 }}>
      <Typography component={"div"} variant='body2'>
        {props?.data?.label}
        {
          props?.data?.required && <span style={{ color: "red" }}> *</span>
        }
      </Typography>
      <PasswordTextField
        {...props?.register(`data.${props?.index}.value`, validationRules)}
        fullWidth
        size='small'
        autoComplete="off"
        autoCapitalize="off"
        type={props?.data?.type || "password"}
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

export default RegisterPassword