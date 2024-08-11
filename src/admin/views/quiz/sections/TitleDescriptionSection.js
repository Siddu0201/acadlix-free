import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const TitleDescriptionSection = (props) => {
  const loadPage = () => {
    props?.loadEditor("description", "description");
  };
  
  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);
    
    return () => {
      props?.removeEditor("description");
      window.removeEventListener("load", loadPage);
    };
  }, []);
  
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
              <Typography variant="h6">Quiz Title</Typography>
            </Grid>
            {/* Used to enter quiz title  */}
            <Grid item xs={12} sm={12}>
              <CustomTextField
                // {...props?.register("title", {required: "Title is required"})}
                fullWidth
                required
                name="title"
                size="small"
                label="Enter quiz title"
                value={props?.watch("title") ?? ""}
                onChange={(e) => {
                  props?.setValue("title", e?.target?.value, {shouldDirty: true});
                }}
                error={props?.formState?.errors?.title}
                helperText={props?.formState?.errors?.title?.message}

              />
            </Grid>
            
            <Grid item xs={12} lg={12}>
              <Typography variant="h6">Quiz Description</Typography>
            </Grid>
            {/* Used to enter quiz decription, we replace textarea with tinymce editor  */}
            <Grid item xs={12} sm={12}>
              <textarea
                id="description"
                style={{
                  width: "100%",
                }}
                value={props?.watch("description") ?? ""}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TitleDescriptionSection;
