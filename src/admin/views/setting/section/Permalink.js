import { Box, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";

const Permalink = (props) => {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Course Permalink", "acadlix")}</Typography>
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
            {__("Course base", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            fullWidth
            size="small"
            value={props?.watch("acadlix_course_base")}
            onChange={(e) => {
              props?.setValue("acadlix_course_base", e?.target?.value, {
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
            {__("Category base", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            fullWidth
            size="small"
            value={props?.watch("acadlix_course_category_base")}
            onChange={(e) => {
              props?.setValue("acadlix_course_category_base", e?.target?.value, {
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
            {__("Tag base", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CustomTextField
            fullWidth
            size="small"
            value={props?.watch("acadlix_course_tag_base")}
            onChange={(e) => {
              props?.setValue("acadlix_course_tag_base", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Permalink;
