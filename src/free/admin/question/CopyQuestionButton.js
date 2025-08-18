import { TbCopyCheckFilled } from '@acadlix/helpers/icons';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import { __ } from "@wordpress/i18n";

const CopyQuestionButton = () => {
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
                        <TbCopyCheckFilled style={{ fontSize: '1.25rem' }} />
                    </Button>
                ) : (
                    <Button
                        disabled
                        variant="contained"
                        color="primary"
                    >
                        {__("Copy Question", "acadlix")}
                    </Button>
                )
            }
        </>
    )
}

export default CopyQuestionButton