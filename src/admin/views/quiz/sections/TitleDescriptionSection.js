import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { __ } from "@wordpress/i18n";
import Grid from "@mui/material/Grid2";
import AiDescription from "../../../../modules/ai/AiDescription";

const AiButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/quiz/description/AiButton") :
    import("@acadlix/free/admin/quiz/description/AiButton")
)

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
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={4}
            sx={{
              color: "black",
            }}
          >
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography variant="h6">{__("Quiz Title", "acadlix")}</Typography>
            </Grid>
            {/* Used to enter quiz title  */}
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                required
                name="post_title"
                size="small"
                label={__("Enter quiz title", "acadlix")}
                value={props?.watch("post_title") ?? ""}
                onChange={(e) => {
                  props?.setValue("post_title", e?.target?.value, { shouldDirty: true });
                }}
                error={props?.formState?.errors?.post_title}
                helperText={props?.formState?.errors?.post_title?.message}

              />
            </Grid>

            <Grid size={{ xs: 12, lg: 12 }} sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}>
              <Typography variant="h6">{__("Quiz Description", "acadlix")}</Typography>

              {/* handle Ai for generating description */}
              <React.Suspense fallback={null}>
                <AiButton
                  {...props}
                />
              </React.Suspense>
                {/* <AiDescription
                  title={props?.watch("post_title") ?? ""}
                  description={props?.watch("post_content") ?? ""}
                  type="quiz"
                  handleAddDescription={(value) => {
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
                /> */}
            </Grid>
            {/* Used to enter quiz decription, we replace textarea with tinymce editor  */}
            <Grid size={{ xs: 12, sm: 12 }}>
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
