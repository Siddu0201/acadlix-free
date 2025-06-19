import React from 'react'
import AiDescription from '@acadlix/modules/ai/AiDescription';

const AiCourseButton = (props) => {
    return (
        <AiDescription
            title={props?.title ?? ""}
            description=""
            type="course"
            handleAddDescription={(value) => {
                if (window.tinymce) {
                    const editor = window.tinymce.get('content'); // Get TinyMCE editor instance
                    if (editor) {
                        editor.setContent(value); // Set content inside TinyMCE
                        editor.save(); // Ensure the editor updates the underlying textarea
                    }
                } else {
                    // Fallback: Directly update the textarea if TinyMCE is not active
                    const contentArea = document.getElementById('content');
                    if (contentArea) {
                        contentArea.value = value;
                    }
                }
            }}
        />
    )
}

export default AiCourseButton