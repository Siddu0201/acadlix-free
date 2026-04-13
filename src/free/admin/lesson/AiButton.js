import React from 'react'
import Grid from '@mui/material/Grid';
import AiDescription from '@acadlix/modules/ai/AiDescription';
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';
import { __ } from "@wordpress/i18n";

const AiButton = (props) => {
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <AiDescription
        title={props?.watch("title") ?? ""}
        description=""
        type="lesson"
        handleAddDescription={(value) => {
          if (window.tinymce) {
            const editor = window.tinymce.get(props?.id);
            if (editor && editor.getContent() !== value) {
              editor.setContent(value || "");
              editor.save();
            }
          }
          props.setValue("content", value, {
            shouldDirty: true,
          });
        }}
      />
      {/* <CustomFeatureElement
                element="button"
                label={__("Generate with AI", "acadlix")}
                attributes={{
                    variant: 'contained',
                    size: 'small',
                    disabled: true,
                }}
                iconsx={{
                    color: '#fff',
                }}
            /> */}
    </Grid>
  )
}

export default AiButton