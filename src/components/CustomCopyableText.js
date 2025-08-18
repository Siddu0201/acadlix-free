import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, Button } from '@mui/material';
import { MdFileCopy } from '@acadlix/helpers/icons';
import CustomTypography from "@acadlix/components/CustomTypography";
import toast from "react-hot-toast";

const CustomCopyableText = ({
    value = ''
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
            }}
        >
            <CustomTypography
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1, // allows text to take remaining space
                    color: (theme) => theme.palette.primary.main,
                }}
            >
                {value}
            </CustomTypography>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<MdFileCopy />}
                onClick={() => {
                    navigator?.clipboard
                        ?.writeText(value)
                        .then(function () {
                            toast.success(__("Webhook URL copied to clipboard!", "acadlix"));
                        })
                        .catch(function (err) {
                            console.error(__("Failed to copy text: ", "acadlix"), err);
                        });
                }}
            >
                {__('Copy', 'acadlix')}
            </Button>
        </Box>
    )
}

export default CustomCopyableText