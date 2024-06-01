import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";

const CategoryTemplateSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Used to select category */}
            <Grid item xs={12} sm={3}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("category_id") !== null
                    ? props?.categories.filter(
                        (option) => props?.watch("category_id") === option?.id
                      )?.[0]
                    : null
                }
                options={props?.categories ? props?.categories : []}
                getOptionLabel={(option) => option?.category_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "spoc_gender",
                    }}
                    label="Select Quiz Categories"
                  />
                )}
                onChange={(_, newValue) => {
                  props?.setValue("category_id", newValue?.id ??  null, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>

            {/* Used to load quiz data from template  */}
            <Grid item xs={12} sm={9}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Autocomplete
                  sx={{
                    minWidth: {
                      xs: "200px",
                      sm: "300px",
                    },
                    marginRight: 3,
                  }}
                  size="small"
                  options={[
                    { label: "tempelate1" },
                    { label: "tempelate2" },
                    { label: "tempelate3" },
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Template" />
                  )}
                />
                <Button variant="contained" color="success" size="small">
                  Load Template
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryTemplateSection;
