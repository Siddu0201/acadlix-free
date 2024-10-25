import React from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function License(props) {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">License Settings</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Enter your email id
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={9}>
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
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Enter your license key
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={9}>
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
