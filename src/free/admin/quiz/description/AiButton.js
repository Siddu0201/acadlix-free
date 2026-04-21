import React from 'react'
import AiDescription from "@acadlix/modules/ai/AiDescription";
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';
import { __ } from "@wordpress/i18n";

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
        // <CustomFeatureElement
        //     element="button"
        //     label={__("Generate with AI", "acadlix")}
        //     attributes={{
        //         variant: 'contained',
        //         size: 'small',
        //         disabled: true,
        //     }}
        //     iconsx={{
        //         color: '#fff',
        //     }}
        // />
    )
}

export default AiButton