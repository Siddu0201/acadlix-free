import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToPostDate } from "../../../../helpers/util";

const General = (props) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Course Duration
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Week(s)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("weeks")}
                onChange={(e) => {
                  props?.setValue("weeks", Number(e?.target?.value), {
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
        <Grid item xs={12} sm={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Day(s)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("days")}
                onChange={(e) => {
                  props?.setValue("days", Number(e?.target?.value), {
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
        <Grid item xs={12} sm={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Hour(s)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("hours")}
                onChange={(e) => {
                  props?.setValue("hours", Number(e?.target?.value), {
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
        <Grid item xs={12} sm={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Minute(s)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                value={props?.watch("minutes")}
                onChange={(e) => {
                  props?.setValue("minutes", Number(e?.target?.value), {
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
        <Grid item xs={12} sm={12}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Registration Scheduling
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Registration Start Date
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
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
                    props?.watch("start_date")
                      ? dayjs(props?.watch("start_date"))
                      : null
                  }
                  onChange={(value) => {
                    props?.setValue("start_date", convertToPostDate(value), {
                      shouldDirty: true,
                    });
                  }}
                />
              </DemoContainer>
              {props?.formState?.errors?.start_date && (
                <Typography component="p" color="error">
                  {props?.formState?.errors?.start_date?.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Registration End Date
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
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
                    props?.watch("end_date")
                      ? dayjs(props?.watch("end_date"))
                      : null
                  }
                  onChange={(value) => {
                    props?.setValue("end_date", convertToPostDate(value), {
                      shouldDirty: true,
                    });
                  }}
                />
              </DemoContainer>
              {props?.formState?.errors?.end_date && (
                <Typography component="p" color="error">
                  {props?.formState?.errors?.end_date?.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Difficulty Level
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl
                fullWidth
                size="small"
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch("difficulty_level")}
                  onChange={(e) => {
                    props?.setValue("difficulty_level", e?.target?.value, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <MenuItem value="all_levels">All Levels</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advance">Advance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Q&A
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControlLabel label="Activate" control={<Checkbox />} />
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default General;
