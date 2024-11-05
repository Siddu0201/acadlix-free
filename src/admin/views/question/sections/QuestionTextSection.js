import { Alert, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import React from "react";

const QuestionTextSection = (props) => {
  const loadPage = () => {
      props?.loadEditor(`question_${props?.lang?.language_id}`, `language.${props?.index}.question`);
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
        props?.removeEditor(`question_${props?.lang?.language_id}`);
        window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      sx={{
        display:
          props?.lang?.selected
            ? "block"
            : "none",
      }}
    >
      <Card>
        <CardHeader
          title={(
            <Typography sx={{
              fontWeight: 500,
              color: "black",
              fontSize: '1.5rem',
            }}>
              Question<span style={{color: "red"}}>*</span> ({props?.lang?.language_name})
            </Typography>
            )}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <textarea
                {...props?.register(`language.${props?.index}.question`, {
                  required: {
                    value: props?.watch(`language.${props?.index}.default`),
                    message: "Question is required"
                  }
                })}
                id={`question_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`language.${props?.index}.question`)}
                onChange={(e) => {
                  let value = e?.target?.value;
                  if (window.tinymce) {
                    const editor = window.tinymce.get(`question_${props?.lang?.language_id}`);
                    if (editor && editor.getContent() !== value) {
                      editor.setContent(value || "");
                    }
                  }
                  props.setValue(`language.${props?.index}.question`, value, {
                    shouldDirty: true,
                  });
                }}
              />
              {Boolean(props.formState?.errors?.language?.[props?.index]?.question) && (
                <Alert severity="error" sx={{
                  marginTop: 2
                }}>
                  {props.formState.errors?.language?.[props?.index]?.question?.message}
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionTextSection;
