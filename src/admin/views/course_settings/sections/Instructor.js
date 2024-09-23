import { Autocomplete, Box, Chip, Grid, TextField } from "@mui/material";
import React from "react";

const Instructor = (props) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            sx={{
              width: "100%",
            }}
            size="small"
            multiple
            value={props?.watch("user_ids") ?? null}
            options={props?.watch("users")?.length ? props?.watch("users") : []}
            getOptionLabel={(option) => `${option?.data?.display_name} (${option?.data?.user_login})` || ""}
            isOptionEqualToValue={(option, value) => option?.ID === value}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                const user = props?.watch("users")?.find(u => u?.ID === option);
                return (
                  <Chip
                    variant="outlined"
                    label={`${user?.data?.display_name} (${user?.data?.user_login})`}
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
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
                label="Select Instructor"
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue("user_ids", newValue?.map((v) => v?.ID) ?? null);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Instructor;
