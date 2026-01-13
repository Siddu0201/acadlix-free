import React, { useEffect } from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import Grid from '@mui/material/Grid';
import { __ } from "@wordpress/i18n";
import CustomTypography from "@acadlix/components/CustomTypography";
import CustomTextField from "@acadlix/components/CustomTextField";

const Assessment = (props) => {
  const loadPage = () => {
    props?.loadEditor(
      `reference_answer_${props?.index}`,
      `language.${props?.index}.answer_data.${props?.type}.referenceAnswer`
    );
  };

  useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`reference_answer_${props?.index}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);
  return (
    <Card>
      <CardHeader
        title={
          props?.watch("multi_language")
            ? __("Assessment", "acadlix") +
            ` (${props?.lang?.language_name})`
            : __("Assessment", "acadlix")
        }
        titleTypographyProps={{
          variant: "h6",
        }}
      ></CardHeader>
      <CardContent
        sx={{
          paddingTop: 1,
        }}
      >
        <Grid container spacing={4} alignItems={"center"}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <CustomTypography>
              {__("Character Limit", "acadlix")}
            </CustomTypography>
          </Grid>
          <Grid size={{ xs: 12, lg: 3 }}>
            <CustomTextField
              {...props?.register(
                `language.${props?.index}.answer_data.${props?.type}.characterLimit`,
              )}
              fullWidth
              size="small"
              label={__("Character Limit (0 => unlimited)", "acadlix")}
              type="number"
              inputProps={{
                step: 1,
                min: 0,
              }}
              value={props?.lang?.answer_data?.[props?.type]?.characterLimit}
              onChange={(e) => {
                props?.setValue(
                  `language.${props?.index}.answer_data.${props?.type}.characterLimit`,
                  e?.target?.value,
                  { shouldDirty: true }
                );
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  display: "none",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              error={Boolean(
                props.formState?.errors?.language?.[props?.index]
                  ?.answer_data?.[props?.type]?.characterLimit
              )}
              helperText={
                props.formState.errors?.language?.[props?.index]?.answer_data?.[
                  props?.type
                ]?.characterLimit?.message
              }
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            <CustomTypography>
              {__("Provide a reference answer for this assessment-type question. It may be used by an Evaluator as a guideline when reviewing student responses.", "acadlix")}
            </CustomTypography>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            <textarea
              {...props?.register(
                `language.${props?.index}.answer_data.${props?.type}.referenceAnswer`
              )}
              id={`reference_answer_${props?.index}`}
              style={{
                width: "100%",
              }}
              value={props?.lang?.answer_data?.[props?.type]?.referenceAnswer || ""}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get(`reference_answer_${props?.index}`);
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue(`language.${props?.index}.answer_data.${props?.type}.referenceAnswer`, value, {
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Assessment