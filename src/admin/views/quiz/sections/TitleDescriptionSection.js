import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { __ } from "@wordpress/i18n";

const TitleDescriptionSection = (props) => {
  const loadPage = () => {
    props?.loadEditor("post_content", "post_content");
  };
  
  React.useEffect(() => {
      loadPage();
      window.addEventListener("load", loadPage);
    
    return () => {
      props?.removeEditor("post_content");
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
              <Typography variant="h6">{__("Quiz Title", "acadlix")}</Typography>
            </Grid>
            {/* Used to enter quiz title  */}
            <Grid item xs={12} sm={12}>
              <CustomTextField
                {...props?.register("title", {required: __("Title is required", "acadlix")})}
                fullWidth
                required
                name="post_title"
                size="small"
                label={__("Enter quiz title", "acadlix")}
                value={props?.watch("post_title") ?? ""}
                onChange={(e) => {
                  props?.setValue("post_title", e?.target?.value, {shouldDirty: true});
                }}
                error={props?.formState?.errors?.post_title}
                helperText={props?.formState?.errors?.post_title?.message}

              />
            </Grid>
            
            <Grid item xs={12} lg={12}>
              <Typography variant="h6">{__("Quiz Description", "acadlix")}</Typography>
            </Grid>
            {/* Used to enter quiz decription, we replace textarea with tinymce editor  */}
            <Grid item xs={12} sm={12}>
              <textarea
                id="post_content"
                style={{
                  width: "100%",
                }}
                value={props?.watch("post_content") ?? ""}
                onChange={(e) => {
                  let value = e?.target?.value;
                  if (window.tinymce) {
                    const editor = window.tinymce.get("post_content");
                    if (editor && editor.getContent() !== value) {
                      editor.setContent(value || "");
                    }
                  }
                  props.setValue("post_content", value, {
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

export default TitleDescriptionSection;
