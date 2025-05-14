import React from 'react'
import AssignmentContent from './AssignmentContent'

const CreateAssignment = () => {
  return (
    <>
      <AssignmentContent
        assignment_id={null}
        create={true}
        assignment={null}
        isFetching={false}
      />
    </>
  )
}

export default CreateAssignment