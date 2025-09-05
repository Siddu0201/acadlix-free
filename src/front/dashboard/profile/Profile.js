import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Backdrop,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
  GetUserProfile,
  PostUpdateUserPhoto,
  PostUpdateUserProfile,
} from "@acadlix/requests/front/FrontDashboardRequest";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import toast from "react-hot-toast";
import { GrUserManager, SlLocationPin } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomTextField from "@acadlix/components/CustomTextField";
import { nameToInitials } from "@acadlix/helpers/util";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const methods = useForm({
    defaultValues: {
      user_id: 0,
      first_name: "",
      last_name: "",
      email: "",
      phonecode: null,
      phone_number: "",
      address: "",
      user_url: "",
      country: null,
      city: "",
      zip_code: "",
      photo: "",
      description: "",
      display_name: "",
      user_login: "",
    },
  });
  const { open } = useOutletContext();
  const { isFetching, data } = GetUserProfile(acadlixOptions?.user?.ID);

  const getUserMetaValue = (user_metas = [], field = "") => {
    return user_metas?.find((m) => m?.meta_key == field)?.meta_value;
  };

  const handleReset = (user = {}) => {
    methods?.reset({
      user_id: user?.ID,
      first_name: getUserMetaValue(user?.user_metas, "first_name") ?? "",
      last_name: getUserMetaValue(user?.user_metas, "last_name") ?? "",
      email: user?.user_email ?? "",
      phonecode:
        getUserMetaValue(user?.user_metas, "_acadlix_profile_phonecode") ??
        null,
      phone_number:
        getUserMetaValue(user?.user_metas, "_acadlix_profile_phone_number") ??
        "",
      address:
        getUserMetaValue(user?.user_metas, "_acadlix_profile_address") ?? "",
      user_url: user?.user_url ?? "",
      country:
        getUserMetaValue(user?.user_metas, "_acadlix_profile_country") ?? null,
      city: getUserMetaValue(user?.user_metas, "_acadlix_profile_city") ?? "",
      zip_code:
        getUserMetaValue(user?.user_metas, "_acadlix_profile_zip_code") ?? "",
      photo: getUserMetaValue(user?.user_metas, "_acadlix_profile_photo") ?? "",
      description: getUserMetaValue(user?.user_metas, "description") ?? "",
      display_name: user?.display_name ?? "",
      user_login: user?.user_login ?? "",
    });
  };

  React.useLayoutEffect(() => {
    if (data?.data?.user) {
      let user = data?.data?.user;
      handleReset(user);
    }
  }, [data?.data]);

  const inputRef = React.useRef(null);
  const handleUploadPhoto = () => {
    inputRef.current.click();
  };

  const updatePhotoMutation = PostUpdateUserPhoto();
  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", methods?.watch("user_id"));
      updatePhotoMutation?.mutate(formData, {
        onSuccess: (data) => {
          if (data?.data?.success && data?.data?.url) {
            methods?.setValue("photo", data?.data?.url, { shouldDirty: true });
          }
        },
      });
    }
  };

  const updateProfileMutation = PostUpdateUserProfile();
  const onSubmit = (data) => {
    updateProfileMutation?.mutate(data, {
      onSuccess: (data) => {
        toast.success(__('Profile updated successfully.', 'acadlix'));
        window?.location?.reload();
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        margin: { xs: "auto", md: "0" },
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={methods?.handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{
            xs: 12,
            md: open ? 4 : 3
          }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12, md: 12 }}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                      md: "column",
                      lg: "column",
                    },
                  }}
                >
                  <Box
                    sx={{
                      paddingX: 4,
                      paddingY: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {
                      methods?.watch("photo") !== ""
                        ? (
                          <Avatar
                            src={
                              methods?.watch("photo") !== ""
                                ? methods?.watch("photo")
                                : "https://via.placeholder.com/150"
                            }
                            alt="Profile"
                            sx={{
                              height: {
                                xs: "150px",
                                sm: "150px",
                                md: "151px",
                                lg: "165px",
                              },
                              width: {
                                xs: "150px",
                                sm: "150px",
                                md: "151px",
                                lg: "165px",
                              },
                              margin: { lg: "20px auto", xs: "10px" },
                            }}
                          />
                        )
                        :
                        (
                          <Avatar
                            sx={{
                              height: {
                                xs: "150px",
                                sm: "150px",
                                md: "151px",
                                lg: "165px",
                              },
                              width: {
                                xs: "150px",
                                sm: "150px",
                                md: "151px",
                                lg: "165px",
                              },
                              margin: { lg: "20px auto", xs: "10px" },
                            }}>
                            {nameToInitials(methods?.watch("display_name"))}
                          </Avatar>
                        )
                    }
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginY: {
                          sm: 2,
                          md: 2,
                          lg: 0,
                        },
                      }}
                    >
                      <>
                        <input
                          type="file"
                          ref={inputRef}
                          style={{ display: "none" }}
                          onChange={handleMediaChange}
                          accept=".jpg,.jpeg,.png"
                        />
                        <Button variant="contained" onClick={handleUploadPhoto}>
                          {updatePhotoMutation?.isPending ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            __("Upload Profile Photo", "acadlix")
                          )}
                        </Button>
                      </>
                    </Box>
                  </Box>
                  <CardContent
                    sx={{
                      textAlign: "left",
                      paddingY: 2,
                    }}
                  >
                    <Typography variant="h4" component="div">
                      {methods?.watch("display_name")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <GrUserManager
                          style={{
                            marginRight: 6,
                          }}
                        />
                        {methods?.watch("user_login")}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <SlLocationPin
                          style={{
                            marginRight: 6,
                          }}
                        />
                        {methods?.watch("city")}{methods?.watch("city") ? ", " : ""}{methods?.watch("country")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Card>
                  <CardContent sx={{ mb: 4 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                      {__("Bio", "acadlix")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {methods?.watch("description")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ 
            xs: 12, 
            md: open ? 8 : 9 
          }}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="div" gutterBottom>
                  {__("Personal", "acadlix")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      {...methods?.register("first_name", {
                        required: "First name is required.",
                      })}
                      required
                      fullWidth
                      label={__('First name', 'acadlix')}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("first_name")}
                      onChange={(e) => {
                        methods?.setValue("first_name", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                      error={Boolean(
                        methods?.formState?.errors?.billing_info?.first_name
                      )}
                      helperText={
                        methods?.formState?.errors?.billing_info?.first_name
                          ?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Last name", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("last_name")}
                      onChange={(e) => {
                        methods?.setValue("last_name", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Email Address", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("email")}
                      onChange={(e) => {
                        methods?.setValue("email", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={{ xs: 4, sm: open ? 4 : 3 }}>
                    <Autocomplete
                      fullWidth
                      slotProps={{
                        popper: {
                          modifiers: [
                            { name: 'flip', enabled: false },
                          ],
                        },
                      }}
                      id="phonecode"
                      autoComplete
                      size="small"
                      options={Country.getAllCountries()}
                      getOptionLabel={(option) =>
                        `${option.phonecode} (${option.isoCode})`
                      }
                      value={
                        methods.watch("phonecode") !== null
                          ? Country?.getAllCountries()?.find(
                            (country) =>
                              country?.phonecode ===
                              methods?.watch("phonecode")
                          ) ?? null
                          : null
                      }
                      onChange={(_, newValue) => {
                        methods.setValue("phonecode", newValue?.phonecode, {
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
                          label={__("Code", "acadlix")}
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
                  <Grid size={{ xs: 8, sm: open ? 8 : 9 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Phone / Mobile", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("phone_number")}
                      onChange={(e) => {
                        methods?.setValue("phone_number", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Website", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("user_url")}
                      onChange={(e) => {
                        methods?.setValue("user_url", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Address", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("address")}
                      onChange={(e) => {
                        methods?.setValue("address", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Autocomplete
                      fullWidth
                      slotProps={{
                        popper: {
                          modifiers: [
                            { name: 'flip', enabled: false },
                          ],
                        },
                      }}
                      id="acadlix-country"
                      autoComplete
                      size="small"
                      options={Country.getAllCountries()}
                      getOptionLabel={(option) => `${option.name}`}
                      value={
                        methods.watch("country") !== null
                          ? Country.getAllCountries()?.find(
                            (country) =>
                              country?.name === methods.watch("country")
                          ) ?? null
                          : null
                      }
                      onChange={(_, newValue) => {
                        methods.setValue("country", newValue?.name, {
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
                            autoComplete: "acadlix-country",
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
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Town/City", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("city")}
                      onChange={(e) => {
                        methods?.setValue("city", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <CustomTextField
                      fullWidth
                      label={__("Postal/Zip Code", "acadlix")}
                      variant="outlined"
                      size="small"
                      value={methods?.watch("zip_code")}
                      onChange={(e) => {
                        methods?.setValue("zip_code", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      fullWidth
                      multiline
                      rows={4}
                      label={__("Bio", "acadlix")}
                      value={methods?.watch("description")}
                      onChange={(e) => {
                        methods?.setValue("description", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                      sx={{
                        height: "auto",
                        "& .MuiInputBase-root": {
                          padding: 0, // Set padding for the input to 0
                        },
                        "& .MuiInputBase-inputMultiline": {
                          padding: "10px", // Set custom padding for the textarea
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ width: { xs: "100%", sm: "50%", lg: "30%" } }} // Full width on mobile/tablet, smaller on large screens
                    >
                      {updateProfileMutation?.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        __("Update Profile", "acadlix")
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Profile;
