import React from 'react'
import { Tooltip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaParagraph } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';

const PragraphOptionButton = (props) => {
    return (
        <Tooltip title={__("Paragraphs", "acadlix")} arrow>
            <IconButton
                disabled
                aria-label="paragraphs"
                size="small"
                color="grey"
                LinkComponent={Link}
                // to={`/${props?.params?.id}/paragraph`}
            >
                <FaParagraph />
            </IconButton>
        </Tooltip>
    )
}

export default PragraphOptionButton