import React from 'react'
import { Button } from '@mui/material';
import { __ } from "@wordpress/i18n";

const BulkImportButton = (props) => {
    return (
        <Button
            disabled
            variant="contained"
            LinkComponent="a"
            href={`${acadlixOptions?.abqu_url}&quiz_id=${props?.quiz_id}`}
            color="primary"
        >
            {__("Import from .docx", "acadlix")}
        </Button>
    )
}

export default BulkImportButton