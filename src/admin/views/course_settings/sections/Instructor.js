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
              if(newValue?.length > 0){
                props?.setValue("meta.user_ids", newValue?.map((v) => v?.ID) ?? []);
              }else{
                props?.setValue("meta.user_ids", []);
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Instructor;
