import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";

const StartDate = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_course_settings_general_start_date" */
      "@acadlix/pro/admin/course_settings/StartDate") :
    import(
      /* webpackChunkName: "admin_course_settings_general_start_date" */
      "@acadlix/free/admin/course_settings/StartDate")
);

const EndDate = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_course_settings_general_end_date" */
      "@acadlix/pro/admin/course_settings/EndDate") :
    import(
      /* webpackChunkName: "admin_course_settings_general_end_date" */
      "@acadlix/free/admin/course_settings/EndDate")
);

const General = (props) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            variant="h4"
          >
            {__("Course Duration", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Duration Type", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel id="demo-simple-select-label">
                  {__("Select Type", "acadlix")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch("meta.duration.type")}
                  label={__("Select Type", "acadlix")}
                  onChange={(e) => {
                    props?.setValue("meta.duration.type", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="week">{__("Week(s)", "acadlix")}</MenuItem>
                  <MenuItem value="day">{__("Day(s)", "acadlix")}</MenuItem>
                  <MenuItem value="hour">{__("Hour(s)", "acadlix")}</MenuItem>
                  <MenuItem value="minute">{__("Minute(s)", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Duration", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("meta.duration.duration")}
                onChange={(e) => {
                  props?.setValue("meta.duration.duration", Number(e?.target?.value), {
                    shouldDirty: true,
                  });
                }}
                onKeyDown={props?.handleKeyDown}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            variant="h4"
          >
            {__("Registration Scheduling", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Registration Start Date", "acadlix")}
              </Typography>
            </Grid>
            <React.Suspense fallback={null}>
              <StartDate {...props} />
            </React.Suspense>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Registration End Date", "acadlix")}
              </Typography>
            </Grid>
            <React.Suspense fallback={null}>
              <EndDate {...props} />
            </React.Suspense>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Difficulty Level", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl
                fullWidth
                size="small"
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch("meta.difficulty_level")}
                  onChange={(e) => {
                    props?.setValue("meta.difficulty_level", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="all_levels">{__("All Levels", "acadlix")}</MenuItem>
                  <MenuItem value="beginner">{__("Beginner", "acadlix")}</MenuItem>
                  <MenuItem value="intermediate">{__("Intermediate", "acadlix")}</MenuItem>
                  <MenuItem value="advance">{__("Advance", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid size={{  xs: 12 ,  sm: 6  }}>
          <Grid container  spacing={2}>
            <Grid size={{  xs: 12 ,  sm: 12  }}>
              <Typography
                variant="h6"
              >
                {__("Q&A", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{  xs: 12 ,  sm: 12  }}>
              <FormControlLabel label={__("Activate", "acadlix")} control={<Checkbox />} />
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default General;
