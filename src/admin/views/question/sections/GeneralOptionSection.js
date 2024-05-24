import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const GeneralOptionSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="General Options"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={5}>
              <CustomTextField
                {...props?.register("title", {
                  required: "Question title is required",
                })}
                required
                fullWidth
                size="small"
                label="Question Title"
                value={props?.watch("title")}
                onChange={(e) => {
                  props?.setValue("title", e.target.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="+ Point"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={props?.watch("points")}
                onChange={(e) => {
                  props?.setValue("points", e.target.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="- Point"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={props?.watch("negative_points")}
                onChange={(e) => {
                  props?.setValue("negative_points", e.target.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Autocomplete
                fullWidth
                size="small"
                value={
                  props?.watch("subject_id") !== null
                    ? props?.subjects.filter(
                        (option) => props?.watch("subject_id") === option?.id
                      )?.[0]
                    : null
                }
                options={props?.subjects ? props?.subjects : []}
                getOptionLabel={(option) => option?.subject_name || ""}
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
                    label="Select Subject"
                  />
                )}
                onChange={(_, newValue) => {
                  props?.setValue("subject_id", newValue?.id ?? null, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GeneralOptionSection;
