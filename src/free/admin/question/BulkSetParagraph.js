import React from 'react'
import { __ } from "@wordpress/i18n";
import { MenuItem } from '@mui/material';

const BulkSetParagraph = () => {
    return (
        <MenuItem value="set_paragraph" disabled>
            {__("Set Paragraph", "acadlix")}
        </MenuItem>
    )
}

export default BulkSetParagraph