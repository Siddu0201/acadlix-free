import React from 'react'
import { __ } from "@wordpress/i18n";
import { FormControlLabel } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';

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
            label={__("Skip Question", 'acadlix')}
        />
    )
}

export default SkipQuestionButton