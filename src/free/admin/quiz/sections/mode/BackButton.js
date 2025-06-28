import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { RiQuestionFill } from '@acadlix/helpers/icons';

const BackButton = (props) => {
    return (
        <Box>
            <FormControlLabel
                control={
                    <CustomSwitch
                        // checked={props?.watch("meta.quiz_settings.enable_back_button") ?? false}
                        // disabled={props?.watch("meta.mode") !== "normal"}
                        disabled
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.enable_back_button",
                    //         e?.target?.checked,
                    //         { shouldDirty: true }
                    //     );
                    // }}
                    />
                }
                // label={__('Enable Back Button', 'acadlix')}
                label={
                    <Box display="flex" alignItems="center" gap={1}>
                        {__('Enable Back Button', 'acadlix')}
                        <Tooltip title={__('Allow users to go back to previous questions', 'acadlix')} placement="right">
                            <IconButton size="small">
                                <RiQuestionFill size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
            />
        </Box>
    )
}

export default BackButton