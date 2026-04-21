import React from 'react'
import { __ } from "@wordpress/i18n";
import { Tooltip, IconButton } from "@mui/material";
import { FaExpandArrowsAlt } from "@acadlix/helpers/icons";
import { Link } from 'react-router-dom';
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';

const ViewAnswerSheetButton = (props) => {
  return (
    <>
      <CustomFeatureElement
        element="iconbutton"
        label="View Answersheet"
        icon={<FaExpandArrowsAlt />}
        attributes={{
          size: 'small',
          disabled: true,
          color: 'grey',
          sx: {
            p: 0.5,
          },
          LinkComponent: Link
        }}
        iconsx={{
          color: '#fff',
        }}
      />
    </>
  )
}

export default ViewAnswerSheetButton