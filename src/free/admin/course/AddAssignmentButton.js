import { Button } from '@mui/material'
import React from 'react'
import { FaPlus } from '@acadlix/helpers/icons'
import { __ } from '@wordpress/i18n'

const AddAssignmentButton = (props) => {
  return (
    <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={props?.handleAddAssignment}
    >
        <FaPlus
            style={{
                paddingRight: 4,
            }}
        />
        {__("Add Assignment", "acadlix")}
    </Button>
  )
}

export default AddAssignmentButton