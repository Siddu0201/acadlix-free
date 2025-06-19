import React from 'react'
import AiDescription from "@acadlix/modules/ai/AiDescription";

const AiButton = (props) => {
    return (
        <AiDescription
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
        />
    )
}

export default AiButton