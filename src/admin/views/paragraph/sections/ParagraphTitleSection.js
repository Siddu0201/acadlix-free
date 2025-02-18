import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { __ } from "@wordpress/i18n";

const ParagraphTitleSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title={__("Title", "acadlix")}
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                {...props?.register("post_title", {
                  required: __("Title is required.", "acadlix"),
                })}
                fullWidth
                size="small"
                label={__("Paragraph Title", "acadlix")}
                value={props?.watch("post_title")}
                onChange={(e) => {
                  props?.setValue("post_title", e.target.value, {
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

export default ParagraphTitleSection;
