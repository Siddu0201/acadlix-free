import React from 'react'
import { Tooltip, IconButton } from '@mui/material';
import { LuFileClock } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';
import { Link } from 'react-router-dom';

const SubjectOptionButton = (props) => {
    const handleSubjectTime = (id) => {
        props?.setValue("quiz_id", id, { shouldDirty: true });
        props?.setValue("subject_model", true, { shouldDirty: true });
    };
    return (
        // <Tooltip title={__("Subject Wise Actions", "acadlix")} arrow>
        //     <IconButton
        //         disabled
        //         aria-label="subject_time"
        //         size="small"
        //         color="grey"
        //         // onClick={handleSubjectTime.bind(this, props?.params?.id)}
        //     >
        //         <LuFileClock />     
        //     </IconButton>
        // </Tooltip>
        <>
            <CustomFeatureElement
                element="iconbutton"
                label="subject_time"
                icon={<LuFileClock />}
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

export default SubjectOptionButton