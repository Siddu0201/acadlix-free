import React from 'react'
import { Button, useMediaQuery } from "@mui/material";
import { IoMdRefresh } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { useTheme } from "@mui/material";

const CustomRefresh = ({
    refetch = () => { },
    disabled = false,
    sx = {}
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <>
            {isMobile ? (
                <Button
                    className='acadlix-icon-btn'
                    disabled={disabled}
                    onClick={refetch}
                    variant="contained"
                    size="large"
                    sx={{
                        minWidth: '48px',
                        padding: '9px 6px',
                        ...sx,
                    }}
                >
                    <IoMdRefresh style={{ fontSize: '1.25rem' }} />
                </Button>
            ) : (
                <Button
                    className='acadlix-btn'
                    disabled={disabled}
                    onClick={refetch}
                    variant="contained"
                    startIcon={<IoMdRefresh />}
                    sx={{
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content',
                        ...sx,
                    }}
                >
                    {__("Refresh", "acadlix")}
                </Button>
            )}
        </>
    )
}

export default CustomRefresh