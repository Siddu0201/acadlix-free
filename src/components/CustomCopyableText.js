import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, Button } from '@mui/material';
import { MdFileCopy } from '@acadlix/helpers/icons';
import CustomTypography from "@acadlix/components/CustomTypography";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';

const CustomCopyableText = ({
    value = '',
    successMessage = __("Webhook URL copied to clipboard!", "acadlix"),
    errorMessage = __("Failed to copy text: ", "acadlix"),
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
                            toast.success(successMessage);
                        })
                        .catch(function (err) {
                            console.error(errorMessage, err);
                        });
                }}
            >
                {__('Copy', 'acadlix')}
            </Button>
        </Box>
    )
}


export default CustomCopyableText

CustomCopyableText.propTypes = {
    value: PropTypes.string.isRequired,
    successMessage: PropTypes.string,
    errorMessage: PropTypes.string,
};