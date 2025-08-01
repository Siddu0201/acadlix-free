import { Card, CardContent, CardHeader, FormControlLabel } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";

const QuestionHintSection = (props) => {
  const loadPage = () => {
    props?.loadEditor(`hint_msg_${props?.lang?.language_id}`, `language.${props?.index}.hint_msg`);
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`hint_msg_${props?.lang?.language_id}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Grid size={{ xs: 12, sm: 12, lg: 12 }}
      sx={{
        display:
          props?.lang?.selected
            ? "block"
            : "none",
      }}
    >
      <Card>
        <CardHeader
          title={
            props?.watch("multi_language")
              ? __("Hint", "acadlix") + ` (${props?.lang?.language_name})`
              : __("Hint", "acadlix")
          }
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 12 }}>
              <FormControlLabel
                control={<CustomSwitch
                  checked={props?.watch("hint_enabled")}
                  onChange={(e) => {
                    props?.setValue("hint_enabled", e?.target?.checked, { shouldDirty: true });
                  }}
                />}
                label={__("Enable Hint", "acadlix")}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }} sx={{
              display: props?.watch("hint_enabled") ? "" : "none",
            }}>
              <textarea
                id={`hint_msg_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`language.${props?.index}.hint_msg`)}
                onChange={(e) => {
                  let value = e?.target?.value;
                  if (window.tinymce) {
                    const editor = window.tinymce.get(`hint_msg_${props?.lang?.language_id}`);
                    if (editor && editor.getContent() !== value) {
                      editor.setContent(value || "");
                    }
                  }
                  props.setValue(`language.${props?.index}.hint_msg`, value, {
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

export default QuestionHintSection;
