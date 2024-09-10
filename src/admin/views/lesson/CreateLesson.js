import React from 'react'
import LessonContent from './LessonContent'

const CreateLesson = () => {

  return (
    <>
      <LessonContent
        lesson_id={null}
        create={true}
        lesson={null}
        isFetching={false}
      />
    </>
  )
}

export default CreateLesson
