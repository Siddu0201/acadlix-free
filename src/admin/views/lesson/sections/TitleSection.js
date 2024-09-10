import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const TitleSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={4}
            sx={{
              color: "black",
            }}
          >
            <Grid item xs={12} lg={12}>
              <Typography variant="h6">Lesson Title</Typography>
            </Grid>
            {/* Used to enter quiz title  */}
            <Grid item xs={12} sm={12}>
              <CustomTextField
                {...props?.register("title", {required: "Title is required"})}
                fullWidth
                required
                name="title"
                size="small"
                label="Enter quiz title"
                value={props?.watch("title") ?? ""}
                onChange={(e) => {
                  props?.setValue("title", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
                error={props?.formState?.errors?.title}
                helperText={props?.formState?.errors?.title?.message}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TitleSection;
