import AiButton from '@acadlix/free/admin/lesson/AiButton';
import Grid from '@mui/material/Grid';
import React from "react";

const ContentSection = (props) => {
  const loadPage = () => {
    props?.loadEditor("lesson_content", "content");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("lesson_content");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <>
      <AiButton
        id="lesson_content"
        {...props} />
      <Grid size={{ xs: 12, sm: 12 }}>
        <textarea
          id="lesson_content"
          rows={12}
          style={{
            width: "100%",
          }}
          value={props?.watch("content") ?? ""}
          onChange={(e) => {
            let value = e?.target?.value;
            if (window.tinymce) {
              const editor = window.tinymce.get("lesson_content");
              if (editor && editor.getContent() !== value) {
                editor.setContent(value || "");
              }
            }
            props.setValue("content", value, {
              shouldDirty: true,
            });
          }}
        />
      </Grid>
    </>
  );
};

export default ContentSection;
