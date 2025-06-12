import React from 'react'
import AiDescription from '../../../modules/ai/AiDescription'

const CourseAi = () => {
    const [title, setTitle] = React.useState('');
    React.useEffect(() => {
        const titleElement = document.getElementById('title');

        if (!titleElement) return;

        const updateTitle = () => setTitle(titleElement.value);

        // Set initial title value
        setTitle(titleElement.value);

        // Add event listener to update title on input change
        titleElement.addEventListener('input', updateTitle);

        // Cleanup event listener on unmount
        return () => {
            titleElement.removeEventListener('input', updateTitle);
        };
    }, []);

    return (
        <>
        {
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
            <AiDescription
                title={title}
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
        }
        </>
    )
}

export default CourseAi
