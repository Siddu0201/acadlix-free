import Grid from '@mui/material/Grid2';
import React from "react";

const ContentSection = (props) => {
  const loadPage = () => {
    props?.loadEditor("content", "content");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("content");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <textarea
        id="content"
        rows={12}
        style={{
          width: "100%",
        }}
        value={props?.watch("content") ?? ""}
        onChange={(e) => {
          let value = e?.target?.value;
          if (window.tinymce) {
            const editor = window.tinymce.get("content");
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
  );
};

export default ContentSection;
