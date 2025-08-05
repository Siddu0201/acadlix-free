import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";

const QuestionMessageSection = (props) => {
  const loadPage = () => {
    props?.loadEditor(`correct_msg_${props?.lang?.language_id}`, `language.${props?.index}.correct_msg`);
    props?.loadEditor(`incorrect_msg_${props?.lang?.language_id}`, `language.${props?.index}.incorrect_msg`);
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`correct_msg_${props?.lang?.language_id}`);
      props?.removeEditor(`incorrect_msg_${props?.lang?.language_id}`);
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
              ? __("Explanation", "acadlix") + ` (${props?.lang?.language_name})`
              : __("Explanation", "acadlix")
          }
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 12 }}>
              <FormControlLabel
                control={<CustomSwitch
                  checked={props?.watch("different_incorrect_msg")}
                  onChange={(e) => {
                    props?.setValue("different_incorrect_msg", e.target.checked, { shouldDirty: true });
                  }}
                />}
                label={__("Different Explanation for correct and incorrect answer?", "acadlix")}
              />
            </Grid>
            {
              props?.watch("different_incorrect_msg") &&
              <Grid size={{ xs: 12, lg: 12 }}>
                <Typography variant="subtitle2">{__("Explanation for correct answer", "acadlix")}</Typography>
              </Grid>
            }
            <Grid size={{ xs: 12, lg: 12 }}>
              <textarea
                id={`correct_msg_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`language.${props?.index}.correct_msg`)}
                onChange={(e) => {
                  let value = e?.target?.value;
                  if (window.tinymce) {
                    const editor = window.tinymce.get(`correct_msg_${props?.lang?.language_id}`);
                    if (editor && editor.getContent() !== value) {
                      editor.setContent(value || "");
                    }
                  }
                  props.setValue(`language.${props?.index}.correct_msg`, value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }} sx={{
              display: props?.watch('different_incorrect_msg') ? "" : "none",
            }}>
              <Typography variant="subtitle2">
                {__("Explanation for incorrect answer", "acadlix")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }} sx={{
              display: props?.watch('different_incorrect_msg') ? "" : "none",
            }}>
              <textarea
                id={`incorrect_msg_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`language.${props?.index}.incorrect_msg`)}
                onChange={(e) => {
                  let value = e?.target?.value;
                  if (window.tinymce) {
                    const editor = window.tinymce.get(`incorrect_msg_${props?.lang?.language_id}`);
                    if (editor && editor.getContent() !== value) {
                      editor.setContent(value || "");
                    }
                  }
                  props.setValue(`language.${props?.index}.incorrect_msg`, value, {
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

export default QuestionMessageSection;
