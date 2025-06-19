import React from 'react'
import Grid from '@mui/material/Grid2';
import AiDescription from '@acadlix/modules/ai/AiDescription';

const AiButton = (props) => {
    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <AiDescription
                title={props?.watch("title") ?? ""}
                description=""
                type="lesson"
                handleAddDescription={(value) => {
                    if (window.tinymce) {
                        const editor = window.tinymce.get("content");
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
        </Grid>
    )
}

export default AiButton