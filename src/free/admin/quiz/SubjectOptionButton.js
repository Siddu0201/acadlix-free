import React from 'react'
import { Tooltip, IconButton } from '@mui/material';
import { LuFileClock } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';

const SubjectOptionButton = (props) => {
    const handleSubjectTime = (id) => {
        props?.setValue("quiz_id", id, { shouldDirty: true });
        props?.setValue("subject_model", true, { shouldDirty: true });
    };
    return (
        <Tooltip title={__("Subject Wise Actions", "acadlix")} arrow>
            <IconButton
                disabled
                aria-label="subject_time"
                size="small"
                color="grey"
                onClick={handleSubjectTime.bind(this, props?.params?.id)}
            >
                <LuFileClock />     
            </IconButton>
        </Tooltip>
    )
}

export default SubjectOptionButton