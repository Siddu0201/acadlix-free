import React from 'react'
import { __ } from "@wordpress/i18n";
import { Tooltip, IconButton } from "@mui/material";
import { FaExpandArrowsAlt } from "@acadlix/helpers/icons";
import { Link } from 'react-router-dom';

const ViewAnswerSheetButton = (props) => {
    return (
        <Tooltip title={__("View Answersheet", "acadlix")}>
            <IconButton
                disabled
                aria-label="expand"
                size="small"
                color="warning"
                LinkComponent={Link}
                // to={`/${props?.quiz_id}/result/${props?.id}`}
            >
                <FaExpandArrowsAlt fontSize="inherit" />
            </IconButton>
        </Tooltip>
    )
}

export default ViewAnswerSheetButton