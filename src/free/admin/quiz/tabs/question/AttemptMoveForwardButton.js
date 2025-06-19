import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";
import { RiQuestionFill } from "@acadlix/helpers/icons";
import { Tooltip, IconButton } from "@mui/material";

const AttemptMoveForwardButton = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControlLabel
                control={
                    <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.attempt_and_move_forward") ?? false}
                disabled={
                    ["question_below_each_other", "check_and_continue", "advance_mode"].includes(props?.watch("meta.mode"))
                }
                onChange={(e) => {
                    props?.setValue(
                        "meta.quiz_settings.attempt_and_move_forward",
                        e?.target?.checked,
                        { shouldDirty: true }
                    );
                }}
                label={__("Activate", "acadlix")}
            />
            <Tooltip
                title={__("This feature will only work for single choice questions in normal mode", "acadlix")}
                placement="right-start"
            >
                <IconButton
                    sx={{
                        fontSize: "1.25rem",
                    }}
                >
                    <RiQuestionFill />
                </IconButton>
            </Tooltip>
        </GridItem1>
    )
}

export default AttemptMoveForwardButton