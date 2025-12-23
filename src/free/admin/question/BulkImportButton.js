import React from 'react'
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { __ } from "@wordpress/i18n";
import { FaFileWord } from '@acadlix/helpers/icons';
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';

const BulkImportButton = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            {
                isMobile ? (
                    <Button
                        variant="contained"
                        disabled
                        color="primary"
                        sx={{
                            minWidth: '48px',
                            padding: '9px 6px',
                        }}
                    >
                        <FaFileWord style={{ fontSize: '1.25rem' }} />
                    </Button>
                ) : (
                    // <Button
                    //     disabled
                    //     variant="contained"
                    //     color="primary"
                    // >
                    //     {__("Import from .docx", "acadlix")}
                    // </Button>
                    <CustomFeatureElement
                        element="button"
                        label={__("Import from .docx", "acadlix")}
                        attributes={{
                            variant: 'contained',
                            disabled: true,
                        }}
                        iconsx={{
                            color: '#fff',
                        }}
                    />
                )
            }
        </>
    )
}

export default BulkImportButton