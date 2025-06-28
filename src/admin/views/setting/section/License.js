import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";

function License(props) {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("License Settings", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Enter your email id", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }}>
          <CustomTextField
            fullWidth
            size="small"
            value={props?.watch("acadlix_license_email_id")}
            onChange={(e) => {
              props?.setValue("acadlix_license_email_id", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Enter your license key", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }}>
          <CustomTextField
            fullWidth
            size="small"
            value={props?.watch("acadlix_license_key")}
            onChange={(e) => {
              props?.setValue("acadlix_license_key", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default License;
