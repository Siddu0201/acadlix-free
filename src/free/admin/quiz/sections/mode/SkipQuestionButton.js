import React from 'react'
import { __ } from "@wordpress/i18n";
import { Box, FormControlLabel } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip';

const SkipQuestionButton = (props) => {
    return (
        <FormControlLabel
            control={
                <CustomSwitch
                    // checked={props?.watch("meta.quiz_settings.skip_question") ?? false}
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.skip_question",
                    //         e?.target?.checked,
                    //         {
                    //             shouldDirty: true,
                    //         }
                    //     );
                    // }}
                    disabled
                    // disabled={
                    //     props?.watch("meta.mode") !== "check_and_continue"
                    // }
                />
            }
            label={
                <Box display="flex" alignItems="center" gap={1}>
                    {__("Skip Question", 'acadlix')}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Enable this option to display a skip button, allowing users to move to the next question without answering or checking.", "acadlix")}
                        placement="right-start"
                    />
                </Box>
            }
        />
    )
}

export default SkipQuestionButton