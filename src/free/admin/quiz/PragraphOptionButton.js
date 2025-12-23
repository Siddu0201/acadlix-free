import React from 'react'
import { Tooltip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaParagraph } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';

const PragraphOptionButton = (props) => {
    return (
        <>
            {/* <IconButton
                disabled
                aria-label="paragraphs"
                size="small"
                color="grey"
                LinkComponent={Link}
            // to={`/${props?.params?.id}/paragraph`}
            >
                <FaParagraph />
            </IconButton> */}
            <CustomFeatureElement
                element="iconbutton"
                label="paragraphs"
                icon={<FaParagraph />}
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

export default PragraphOptionButton