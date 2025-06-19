import React from 'react'
import { __ } from "@wordpress/i18n";
import { FormControlLabel } from '@mui/material';
import CustomSwitch from '@acadlix/components/CustomSwitch';

const CheckOptionButton = (props) => {
    return (
        <FormControlLabel
            control={
                <CustomSwitch
                    checked={
                        props?.watch("meta.quiz_settings.enable_check_on_option_selected") ??
                        false
                    }
                    disabled={
                        props?.watch("meta.mode") !== "check_and_continue"
                    }
                    onChange={(e) => {
                        props?.setValue(
                            "meta.quiz_settings.enable_check_on_option_selected",
                            e?.target?.checked,
                            { shouldDirty: true }
                        );
                    }}
                />
            }
            label={__("Show Check Button When Option Selected", 'acadlix')}
        />
    )
}

export default CheckOptionButton