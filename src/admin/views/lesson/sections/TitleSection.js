import { Card, CardContent, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";

const TitleSection = ({ customInputProps = {}, ...props }) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, sm: 4 }}
          >
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography variant="h4">{__("Lesson Title", "acadlix")}</Typography>
            </Grid>
            {/* Used to enter quiz title  */}
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                {...props?.register("title", { required: "Title is required." })}
                fullWidth
                name="title"
                size="small"
                label={__("Enter lesson title", "acadlix") + " *"}
                value={props?.watch("title") ?? ""}
                onChange={(e) => {
                  props?.setValue("title", e?.target?.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                error={Boolean(props?.formState?.errors?.title)}
                helperText={props?.formState?.errors?.title?.message}
                {...customInputProps}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TitleSection;
