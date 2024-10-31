import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Autocomplete,
  Backdrop,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  GetUserProfile,
  PostUpdateUserProfile,
} from "../../../requests/front/FrontDashboardRequest";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import { MediaUpload } from "@wordpress/media-utils";
import toast from "react-hot-toast";
import { GrUserManager } from "react-icons/gr";
import { SlLocationPin } from "react-icons/sl";

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

  const handleMediaChange = (media) => {
    methods?.setValue(`photo`, media?.url, { shouldDirty: true });
  };

  const updateProfileMutation = PostUpdateUserProfile();
  const onSubmit = (data) => {
    console.log(data);
    updateProfileMutation?.mutate(data, {
      onSuccess: (data) => {
        toast.success("Profile updated successfully.");
        handleReset(data?.data?.user);
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        ml: 5,
        width: { xs: "99%", sm: "100%", md: "100%" },
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
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
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
                boxShadow: (theme) => theme.shadows[1],
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
                {/* <CardMedia
                  component="img"
                  image={
                    methods?.watch("photo") !== ""
                      ? methods?.watch("photo")
                      : "https://via.placeholder.com/150"
                  }
                /> */}
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
                  <MediaUpload
                    onSelect={handleMediaChange}
                    render={({ open }) => (
                      <Button variant="contained" onClick={open}>
                        Upload Profile Photo
                      </Button>
                    )}
                  />
                </Box>
              </Box>
              <CardContent
                sx={{
                  textAlign: "left",
                  paddingY: 2,
                }}
              >
                <Typography variant="h5" component="div">
                  {methods?.watch("display_name")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <GrUserManager
                    style={{
                      marginRight: 6,
                    }}
                  />
                  {methods?.watch("user_login")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: "15px" }}
                >
                  <SlLocationPin
                    style={{
                      marginRight: 6,
                    }}
                  />
                  {methods?.watch("city")}, {methods?.watch("country")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 2.5, boxShadow: (theme) => theme.shadows[1] }}>
              <CardContent sx={{ mb: 4 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  Bio
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {methods?.watch("description")}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 5, boxShadow: (theme) => theme.shadows[1] }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Personal
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...methods?.register("first_name", {
                        required: "First name is required.",
                      })}
                      required
                      fullWidth
                      label="First name"
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last name"
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
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
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
                  <Grid item xs={3} sm={3}>
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
                          label="Code"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "code",
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={9} sm={9}>
                    <TextField
                      fullWidth
                      label="Phone / Mobile"
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
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Address"
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
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Website"
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
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      fullWidth
                      id="country"
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
                            autoComplete: "country",
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Town/City"
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Postal/Zip Code"
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
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Bio"
                      value={methods?.watch("description")}
                      onChange={(e) => {
                        methods?.setValue("description", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ width: { xs: "100%", sm: "50%", lg: "30%" } }} // Full width on mobile/tablet, smaller on large screens
                    >
                      {updateProfileMutation?.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Update Profile"
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
