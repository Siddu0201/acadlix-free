import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";

const RandomLastOptionButton = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControlLabel
                control={
                    <CustomSwitch />
                }
                checked={
                    props?.watch("meta.quiz_settings.do_not_randomize_last_option") ?? false
                }
                onChange={(e) => {
                    props?.setValue(
                        "meta.quiz_settings.do_not_randomize_last_option",
                        e?.target?.checked,
                        { shouldDirty: true }
                    );
                }}
                disabled={!props?.watch("meta.quiz_settings.random_option")}
                label={__("Activate", "acadlix")}
            />
        </GridItem1>
    )
}

export default RandomLastOptionButton