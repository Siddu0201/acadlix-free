import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  TextField,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";

const QuestionParagraphSection = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardHeader
          title={__("Paragraph Options", "acadlix")}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={props?.watch("paragraph_enabled")}
                    onChange={(e) => {
                      props?.setValue("paragraph_enabled", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                  />
                }
                label={__("Enable Paragraph", "acadlix")}
              />
            </Grid>
            {props?.watch("paragraph_enabled") && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  value={
                    props?.watch("paragraph_id") !== null
                      ? props?.paragraphs.filter(
                        (option) =>
                          props?.watch("paragraph_id") === option?.ID
                      )?.[0]
                      : null
                  }
                  options={props?.paragraphs ? props?.paragraphs : []}
                  getOptionLabel={(option) => option?.post_title || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.ID === value?.ID
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                      }}
                      label={__("Select Paragraph", "acadlix")}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    props?.setValue("paragraph_id", newValue?.ID ?? null, {
                      shouldDirty: true,
                    });
                  }}
                />
                {Boolean(props?.formState?.errors?.paragraph_id) && (
                  <Typography component="p" color="error">
                    {props?.formState?.errors?.paragraph_id?.message}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionParagraphSection;
