import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { RiQuestionFill } from '@acadlix/helpers/icons';

const CheckOptionButton = (props) => {
    return (
        <FormControlLabel
            control={
                <CustomSwitch
                    // checked={
                    //     props?.watch("meta.quiz_settings.enable_check_on_option_selected") ??
                    //     false
                    // }
                    // disabled={
                    //     props?.watch("meta.mode") !== "check_and_continue"
                    // }
                    disabled
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.enable_check_on_option_selected",
                    //         e?.target?.checked,
                    //         { shouldDirty: true }
                    //     );
                    // }}
                />
            }
            // label={__("Show Check Button When Option Selected", 'acadlix')}
            label={
                <Box display="flex" alignItems="center" gap={1}>
                    {__('Show Check Button When Option Selected', 'acadlix')}
                    <Tooltip title={__('"Enable this option to display a check button when a student selects an answer."', 'acadlix')} placement="right">
                        <IconButton size="small">
                            <RiQuestionFill size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            }
        />
    )
}

export default CheckOptionButton