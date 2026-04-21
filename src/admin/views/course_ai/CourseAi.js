import AiCourseButton from '@acadlix/free/admin/course_ai/AiCourseButton';
import React from 'react'

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
      <AiCourseButton title={title} />
    </>
  )
}

export default CourseAi
