import React from 'react'

const AiCourseButton = React.lazy(() =>
    process.env.REACT_APP_IS_PREMIUM === 'true' ?
        import(
            /* webpackChunkName: "admin_course_ai_pro_ai_course_button" */
            "@acadlix/pro/admin/course_ai/AiCourseButton") :
        import(
            /* webpackChunkName: "admin_course_ai_free_ai_course_button" */
            "@acadlix/free/admin/course_ai/AiCourseButton")
);

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
            <React.Suspense fallback={null}>
                <AiCourseButton title={title} />
            </React.Suspense>
        </>
    )
}

export default CourseAi
