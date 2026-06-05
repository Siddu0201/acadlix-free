import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import PasswordTextField from '@acadlix/components/PasswordTextField';
import { PostUpdateUserPassword } from '@acadlix/requests/front/FrontDashboardRequest';
import toast from 'react-hot-toast';

const ChangePassword = (props) => {
  const methods = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    }
  });

  const updatePasswordMutation = PostUpdateUserPassword();
  const onSubmit = (data) => {
    updatePasswordMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res?.data?.message || __("Password updated successfully", "acadlix"));
        window.location.reload();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || __("An error occurred while updating password", "acadlix"));
      }
    });
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {__("Change Password", "acadlix")}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <PasswordTextField
                {...methods.register("old_password", {
                  required: __("Current password is required", "acadlix"),
                })}
                fullWidth
                size="small"
                name="old_password"
                label={__("Current Password *", "acadlix")}
                onChange={(e) => {
                  methods.setValue("old_password", e.target.value, { shouldDirty: true });
                }}
                error={!!methods.formState.errors.old_password}
                helperText={methods.formState.errors.old_password?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <PasswordTextField
                {...methods.register("new_password", {
                  required: __("New password is required", "acadlix"),
                  minLength: {
                    value: 8,
                    message: __("New password must be at least 8 characters long", "acadlix")
                  }
                })}
                fullWidth
                size="small"
                name="new_password"
                label={__("New Password *", "acadlix")}
                onChange={(e) => {
                  methods.setValue("new_password", e.target.value, { shouldDirty: true });
                }}
                error={!!methods.formState.errors.new_password}
                helperText={methods.formState.errors.new_password?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <PasswordTextField
                {...methods.register("confirm_new_password", {
                  required: __("Confirm new password is required", "acadlix"),
                  minLength: {
                    value: 8,
                    message: __("Confirm new password must be at least 8 characters long", "acadlix")
                  },
                  validate: (value) => {
                    if (value !== methods.watch("new_password")) {
                      return __("Passwords do not match", "acadlix");
                    }
                    return true;
                  }
                })}
                fullWidth
                size="small"
                name="confirm_new_password"
                label={__("Confirm New Password *", "acadlix")}
                onChange={(e) => {
                  methods.setValue("confirm_new_password", e.target.value, { shouldDirty: true });
                }}
                error={!!methods.formState.errors.confirm_new_password}
                helperText={methods.formState.errors.confirm_new_password?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }} sx={{ textAlign: "center", mt: 3 }}>
              <Button
                className="acadlix-btn"
                variant="contained"
                color="primary"
                type="submit"
                loading={updatePasswordMutation?.isPending}
                sx={{ width: { xs: "100%", sm: "50%", lg: "30%" } }} // Full width on mobile/tablet, smaller on large screens
              >
                {__("Update Password", "acadlix")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  )
}

export default ChangePassword