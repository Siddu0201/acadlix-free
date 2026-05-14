import { IoClose } from '@acadlix/helpers/icons';
import { Autocomplete, Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n';
import CustomTextField from '@acadlix/components/CustomTextField';
import { useForm } from 'react-hook-form';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { Country } from 'country-state-city';
import { formatPhoneCode } from '@acadlix/helpers/util';

const EditRegistrationOptions = (props) => {
  const methods = useForm({
    defaultValues: {
      id: props?.item?.id ?? "",
      name: props?.item?.name ?? "",
      label: props?.item?.label ?? "",
      placeholder: props?.item?.placeholder ?? "",
      type: props?.item?.type ?? "text",
      meta_key: props?.item?.meta_key ?? "",
      is_meta: props?.item?.is_meta ?? false,
      default: props?.item?.default ?? false,
      enabled: props?.item?.enabled ?? true,
      required: props?.item?.required ?? false,
      value: props?.item?.value ?? "",
      settings: props?.item?.settings ?? {},
      controls: props?.item?.controls ?? {}
    }
  });

  const onSubmit = (data) => {
    props?.setValue(
      "acadlix_registration_fields",
      props?.watch("acadlix_registration_fields")?.map((item, index) => {
        if (index === props?.index) {
          return {
            ...item,
            ...data,
          }
        }
        return item;
      }),
      {
        shouldDirty: true,
      }
    )
    props?.handleClose();
  }

  return (
    <>
      <DialogTitle
        id="menu-dialog-title"
        sx={{ m: 0, p: 2 }}
      >
        {props?.create ? __("Add Item", "acadlix") : __("Edit Item", "acadlix")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent
        sx={{
          padding: "1rem !important",
          // backgroundColor: props?.colorCode?.modal_background,
        }}
      >
        <Grid container spacing={4} sx={{
          alignItems: "center",
        }}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Typography variant="h6">
              {__("Name", "acadlix")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomTextField
              {...methods?.register("name", { required: __("Name is required", "acadlix") })}
              fullWidth
              required
              name="name"
              size="small"
              label={__("Name", "acadlix")}
              value={methods?.watch("name") ?? ""}
              onChange={(e) => {
                methods?.setValue("name", e?.target?.value, {
                  shouldDirty: true,
                });
                if (!methods?.watch("default")) {
                  methods?.setValue("id",
                    e?.target?.value
                      ?.trim()
                      .toLowerCase()
                      .replace(/\s+/g, '-'), {
                    shouldDirty: true,
                  });
                }
              }}
              disabled={!methods?.watch("controls")?.can_edit_name}
              error={Boolean(methods?.formState?.errors?.name)}
              helperText={methods?.formState?.errors?.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Typography variant="h6">
              {__("ID", "acadlix")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomTextField
              {...methods?.register("id", { required: __("ID is required", "acadlix") })}
              fullWidth
              required
              name="id"
              size="small"
              label={__("ID", "acadlix")}
              value={methods?.watch("id") ?? ""}
              disabled={methods?.watch("default")}
              onChange={(e) => {
                methods?.setValue("id", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(methods?.formState?.errors?.id)}
              helperText={methods?.formState?.errors?.id?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Typography variant="h6">
              {__("Label", "acadlix")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomTextField
              {...methods?.register("label", { required: __("Label is required", "acadlix") })}
              fullWidth
              required
              name="label"
              size="small"
              label={__("Label", "acadlix")}
              value={methods?.watch("label") ?? ""}
              disabled={!methods?.watch("controls")?.can_edit_label}
              onChange={(e) => {
                methods?.setValue("label", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(methods?.formState?.errors?.label)}
              helperText={methods?.formState?.errors?.label?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Typography variant="h6">
              {__("Placeholder", "acadlix")} <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <CustomTextField
              {...methods?.register("placeholder", { required: __("Placeholder is required", "acadlix") })}
              fullWidth
              required
              name="placeholder"
              size="small"
              label={__("Placeholder", "acadlix")}
              value={methods?.watch("placeholder") ?? ""}
              disabled={!methods?.watch("controls")?.can_edit_placeholder}
              onChange={(e) => {
                methods?.setValue("placeholder", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(methods?.formState?.errors?.placeholder)}
              helperText={methods?.formState?.errors?.placeholder?.message}
            />
          </Grid>
          {
            methods?.watch("is_meta") && (
              <>
                <Grid size={{ xs: 12, lg: 3 }}>
                  <Typography variant="h6">
                    {__("Meta key", "acadlix")} <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 9 }}>
                  <CustomTextField
                    {...methods?.register("meta_key", { required: __("Meta key is required", "acadlix") })}
                    fullWidth
                    required
                    name="meta_key"
                    size="small"
                    label={__("Meta key", "acadlix")}
                    value={methods?.watch("meta_key") ?? ""}
                    disabled={!methods?.watch("controls")?.can_edit_meta_key}
                    onChange={(e) => {
                      methods?.setValue("meta_key", e?.target?.value, {
                        shouldDirty: true,
                      });
                    }}
                    error={Boolean(methods?.formState?.errors?.meta_key)}
                    helperText={methods?.formState?.errors?.meta_key?.message}
                  />
                </Grid>
              </>
            )
          }
          <Grid size={{ xs: 12, lg: 3 }}>
            <Typography variant="h6">
              {__("Enable", "acadlix")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <FormControlLabel
              control={
                <CustomSwitch />
              }
              label={__("Enable", "acadlix")}
              checked={methods?.watch("enabled")}
              onChange={(e) => {
                if (e?.target?.checked !== undefined) {
                  methods?.setValue(
                    "enabled",
                    e?.target?.checked,
                    { shouldDirty: true }
                  )
                }
              }}
              disabled={!methods?.watch("controls")?.can_disable}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Typography variant="h6">
              {__("Required", "acadlix")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <FormControlLabel
              control={
                <CustomSwitch />
              }
              label={__("Required", "acadlix")}
              checked={methods?.watch("required")}
              onChange={(e) => {
                if (e?.target?.checked !== undefined) {
                  methods?.setValue(
                    "required",
                    e?.target?.checked,
                    { shouldDirty: true }
                  )
                }
              }}
              disabled={!methods?.watch("controls")?.can_require_toggle}
            />
          </Grid>
          <OptionSettings
            {...methods}
          />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={props?.handleClose}
        >
          {__("Cancel", "acadlix")}
        </Button>
        <Button
          variant="contained"
          onClick={methods?.handleSubmit(onSubmit)}
        >
          {__("Save Changes", "acadlix")}
        </Button>
      </DialogActions>
    </>
  )
}

const OptionSettings = (props) => {
  console.log(props?.watch());
  if (["first_name", "last_name"].includes(props?.watch("id")) && props?.watch("settings")?.width) {
    return (
      <>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Typography variant="h6">
            {__("Width", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="width-select-label">{__("Width", "acadlix")}</InputLabel>
            <Select
              labelId="width-select-label"
              id="width-select"
              label={__("Width", "acadlix")}
              value={props?.watch("settings")?.width}
              onChange={(e) => {
                props?.setValue("settings", {
                  ...props?.watch("settings"),
                  width: e?.target?.value,
                }, {
                  shouldDirty: true,
                })
              }}
            >
              <MenuItem value="50%">50%</MenuItem>
              <MenuItem value="100%">100%</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </>
    )
  }

  if (props?.watch("id") === "phone_number" && props?.watch("settings")) {
    return <>
      <Grid size={{ xs: 12, lg: 3 }}>
        <Typography variant="h6">
          {__("Enable Phone Code", "acadlix")}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, lg: 9 }}>
        <FormControlLabel
          control={
            <CustomSwitch />
          }
          label={__("Enable", "acadlix")}
          checked={props?.watch("settings")?.phonecode?.enabled}
          onChange={(e) => {
            if (e?.target?.checked !== undefined) {
              props?.setValue(
                "settings.phonecode.enabled",
                e?.target?.checked,
                { shouldDirty: true }
              )
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 3 }}>
        <Typography variant="h6">
          {__("Default Phone Code", "acadlix")}
          {!props?.watch("settings")?.phonecode?.enabled && (
            <span style={{ color: "red" }}> *</span>
          )}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, lg: 9 }}>
        <Autocomplete
          {
            ...props?.register("settings.phonecode.default", {
                required: {
                  value: !props?.watch("settings")?.phonecode?.enabled,
                  message: __("Default phone code is required if phone code is disabled", "acadlix")
                }
            })
          }
          fullWidth
          id="phonecode"
          autoComplete
          size='small'
          options={Country.getAllCountries()}
          getOptionLabel={(option) => `${formatPhoneCode(option?.phonecode)} (${option?.name})`}
          value={
            props?.watch("settings")?.phonecode?.default !== null
              ? Country.getAllCountries().find((country) => {
                const phonecode = props?.watch("settings")?.phonecode?.default;
                const isoCode = props?.watch("settings")?.isocode?.default;

                // ✅ Priority: match both isoCode + phonecode (unique)
                if (isoCode) {
                  return (
                    country.isoCode === isoCode &&
                    country.phonecode === phonecode
                  );
                }
                // ⚠️ Fallback: only phonecode (old data)
                return country.phonecode === phonecode;
              }) ?? null
              : null
          }
          onChange={(_, newValue) => {
            props.setValue(
              "settings.phonecode.default",
              newValue?.phonecode,
              {
                shouldDirty: true,
              }
            );
            props.setValue(
              "settings.phonecode.value",
              newValue?.phonecode,
              {
                shouldDirty: true,
              }
            );
            props.setValue(
              "settings.isocode.default",
              newValue?.isoCode,
              {
                shouldDirty: true,
              }
            );
            props.setValue(
              "settings.isocode.value",
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
                // fontSize: "11px",
              }}
            >
              {`${formatPhoneCode(option.phonecode)} (${option.name})`}
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
              label={__("Default Phone Code", "acadlix")}
              inputProps={{
                ...params.inputProps,
                autoComplete: "code",
              }}
              error={!!props?.formState?.errors?.settings?.phonecode?.default}
              helperText={props?.formState?.errors?.settings?.phonecode?.default?.message}
            />
          )}
        />
      </Grid>
    </>;
  }


  return null;
}

export default EditRegistrationOptions