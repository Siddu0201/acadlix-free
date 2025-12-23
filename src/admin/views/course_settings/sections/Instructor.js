import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { __ } from "@wordpress/i18n";
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";

const Instructor = (props) => {

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                variant="h6"
              >
                {__("Select Instructor", "acadlix")}
                <CustomFeatureTooltip
                  plan={"open"}
                  msg={__("Assign one or multiple instructors to the course. By default, the course creator will be selected as the instructor.", "acadlix")}
                  placement="right-start"
                  redirectTo={`${acadlixOptions?.acadlix_docs_url}course-management/creating-a-new-course-in-acadlix/#instructor`}
                />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Autocomplete
                sx={{
                  width: "100%",
                }}
                size="small"
                multiple
                value={props?.watch("meta.user_ids")?.length > 0 ? props?.watch("users")?.filter(u => props?.watch("meta.user_ids")?.includes(u?.ID)) : []}
                options={props?.watch("users")?.length ? props?.watch("users") : []}
                getOptionLabel={(option) => `${option?.data?.display_name} (${option?.data?.user_login})` || ""}
                isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        variant="outlined"
                        label={`${option?.data?.display_name} (${option?.data?.user_login})`}
                        key={key}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "spoc_gender",
                    }}
                    label={__('Select Instructor', 'acadlix')}
                  />
                )}
                onChange={(_, newValue) => {
                  if (newValue?.length > 0) {
                    props?.setValue("meta.user_ids", newValue?.map((v) => v?.ID) ?? []);
                  } else {
                    props?.setValue("meta.user_ids", []);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Instructor;
