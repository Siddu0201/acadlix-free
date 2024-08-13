import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const ParagraphTitleSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Title"
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
                {...props?.register("title", {required: "Title is required."})}
                required
                fullWidth
                size="small"
                label="Paragraph Title"
                value={props?.watch("title")}
                onChange={(e) => {
                  props?.setValue("title", e.target.value, {
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
