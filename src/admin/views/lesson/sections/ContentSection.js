import Grid from '@mui/material/Grid2';
import React from "react";

const AiButton = React.lazy(() =>
    process.env.REACT_APP_IS_PREMIUM === 'true' ?
        import("@acadlix/pro/admin/lesson/AiButton") :
        import("@acadlix/free/admin/lesson/AiButton")
);

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
      <React.Suspense fallback={null}>
        <AiButton
         id="lesson_content"
        {...props} />
      </React.Suspense>
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
