import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const ParagraphContentSection = (props) => {
  const loadPage = () => {
    props?.loadEditor(
      `content_${props?.lang?.language_id}`,
      `meta.language_data.${props?.index}.content`
    );
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`content_${props?.lang?.language_id}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);
  return (
    <Grid
      item
      xs={12}
      sm={12}
      sx={{
        display: props?.lang?.selected ? "block" : "none",
      }}
    >
      <Card>
        <CardHeader
          title={
            <Typography
              sx={{
                fontWeight: 500,
                color: "black",
                fontSize: "1.5rem",
              }}
            >
              Content
              <span
                style={{
                  color: "red",
                  display: props?.lang?.default ? "" : "none",
                }}
              >
                *
              </span>{" "}
              ({props?.quiz?.languages?.find((l) => l?.term_id === props?.lang?.language_id)?.name})
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <textarea
                {...props?.register(`meta.language_data.${props?.index}.content`, {
                  required: {
                    value: props?.watch(`meta.language_data.${props?.index}.default`),
                    message: "Content is required",
                  },
                })}
                id={`content_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`meta.language_data.${props?.index}.content`)}
                onChange={(e) => {
                  let value = e?.target?.value;
                  if (window.tinymce) {
                    const editor = window.tinymce.get(`content_${props?.lang?.language_id}`);
                    if (editor && editor.getContent() !== value) {
                      editor.setContent(value || "");
                    }
                  }
                  props.setValue(`meta.language_data.${props?.index}.content`, value, {
                    shouldDirty: true,
                  });
                }}
              />
              {Boolean(
                props.formState?.errors?.meta?.language_data?.[props?.index]?.content
              ) && (
                <Alert
                  severity="error"
                  sx={{
                    marginTop: 2,
                  }}
                >
                  {
                    props.formState.errors?.meta?.language_data?.[props?.index]?.content
                      ?.message
                  }
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ParagraphContentSection;
