import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, FormControlLabel } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';

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
                label={__('Enable Back Button', 'acadlix')}
            />
        </Box>
    )
}

export default BackButton