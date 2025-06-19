import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";

const ForceUserButton = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControlLabel
                control={
                    <CustomSwitch />
                }
                checked={
                    props?.watch("meta.quiz_settings.force_user_to_answer_each_question") ?? false
                }
                onChange={(e) => {
                    props?.setValue(
                        "meta.quiz_settings.force_user_to_answer_each_question",
                        e?.target?.checked,
                        { shouldDirty: true }
                    );
                }}
                disabled={
                    props?.watch("meta.mode") === "advance_mode" &&
                    props?.watch("meta.advance_mode_type") !== "advance_panel"
                }
                label={__("Activate", "acadlix")}
            />
        </GridItem1>
    )
}

export default ForceUserButton