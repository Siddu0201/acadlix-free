import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToPostDate } from "../../../../helpers/util";
import { __ } from "@wordpress/i18n";

const General = (props) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {__("Course Duration", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
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
                sx={{
                  fontWeight: 600,
                }}
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
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        {
          acadlixOptions?.isPro && acadlixOptions?.isActive &&
          <>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {__("Registration Scheduling", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {__("Registration Start Date", "acadlix")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      format="DD/MM/YYYY hh:mm:a"
                      timeSteps={{
                        minutes: 1,
                      }}
                      sx={{
                        ".MuiFormControl-root ": {
                          maxHeight: "42px",
                        },
                        ".MuiInputBase-input": {
                          padding: "6px 14px !important",
                          border: `0 !important`,
                          boxShadow: `none !important`,
                        },
                        ".MuiInputBase-input:focus": {
                          padding: "6px 14px !important",
                          border: `0 !important`,
                          boxShadow: `none !important`,
                        },
                        ".MuiFormLabel-root": {
                          top: "-7px !important",
                        },
                        ".MuiInputLabel-shrink": {
                          top: "0px !important",
                        },
                      }}
                      value={
                        props?.watch("meta.start_date")
                          ? dayjs(props?.watch("meta.start_date"))
                          : null
                      }
                      onChange={(value) => {
                        props?.setValue("meta.start_date", convertToPostDate(value), {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </DemoContainer>
                  {props?.formState?.errors?.meta?.start_date && (
                    <Typography component="p" color="error">
                      {props?.formState?.errors?.meta?.start_date?.message}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {__("Registration End Date", "acadlix")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      format="DD/MM/YYYY hh:mm:a"
                      timeSteps={{
                        minutes: 1,
                      }}
                      sx={{
                        ".MuiFormControl-root ": {
                          maxHeight: "42px",
                        },
                        ".MuiInputBase-input": {
                          padding: "6px 14px !important",
                          border: `0 !important`,
                          boxShadow: `none !important`,
                        },
                        ".MuiInputBase-input:focus": {
                          padding: "6px 14px !important",
                          border: `0 !important`,
                          boxShadow: `none !important`,
                        },
                        ".MuiFormLabel-root": {
                          top: "-7px !important",
                        },
                        ".MuiInputLabel-shrink": {
                          top: "0px !important",
                        },
                      }}
                      value={
                        props?.watch("meta.end_date")
                          ? dayjs(props?.watch("meta.end_date"))
                          : null
                      }
                      onChange={(value) => {
                        props?.setValue("meta.end_date", convertToPostDate(value), {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </DemoContainer>
                  {props?.formState?.errors?.meta?.end_date && (
                    <Typography component="p" color="error">
                      {props?.formState?.errors?.meta?.end_date?.message}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </>
        }

        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
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
                sx={{
                  fontWeight: 600,
                }}
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
