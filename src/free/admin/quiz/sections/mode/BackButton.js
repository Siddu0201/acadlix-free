import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { RiQuestionFill } from '@acadlix/helpers/icons';
import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip';

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
                        <CustomFeatureTooltip
                            plan={acadlixOptions?.isActive ? "open" : "closed"}
                            msg={__("Enables back button for navigating to previous questions.", "acadlix")}
                            placement="right-start"
                        />
                    </Box>
                }
            />
        </Box>
    )
}

export default BackButton