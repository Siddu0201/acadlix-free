import React from 'react'
import { Button } from '@mui/material';
import { __ } from "@wordpress/i18n";

const BulkImportButton = (props) => {
    return (
        <Button
            disabled
            variant="contained"
            color="primary"
        >
            {__("Import from .docx", "acadlix")}
        </Button>
    )
}

export default BulkImportButton