import React from 'react'
import { useParams } from 'react-router-dom'
import AssignmentContent from './AssignmentContent'
import Loader from '../../../components/Loader'
import { GetAssignmentById } from '../../../requests/admin/AdminAssignmentRequest'

const EditAssignment = () => {
  const { assignment_id } = useParams();

  const { isFetching, data } = GetAssignmentById(assignment_id);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <AssignmentContent
        assignment_id={assignment_id}
        create={false}
        assignment={data?.data?.assignment}
        isFetching={isFetching}
      />
    </>
  )
}

export default EditAssignment