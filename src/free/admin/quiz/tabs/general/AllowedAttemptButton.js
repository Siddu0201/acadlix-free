import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";
import { Tooltip, IconButton } from "@mui/material";
import { RiQuestionFill } from "@acadlix/helpers/icons";

const AllowedAttemptButton = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <CustomTextField
                disabled
                label={__("Per User Allowed Attempt", "acadlix")}
                variant="outlined"
                size="small"
                type="number"
                // onChange={(e) => {
                //     props?.setValue("meta.quiz_settings.per_user_allowed_attempt", Number(e?.target?.value), {
                //         shouldDirty: true,
                //     });
                // }}
                // value={props?.watch("meta.quiz_settings.per_user_allowed_attempt") ?? 0}
                sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                        display: "none",
                    },
                    "& input[type=number]": {
                        MozAppearance: "textfield",
                    },
                }}
            />
            <Tooltip
                title={__("Sets allowed attempts (0 = unlimited); requires login at quiz start.", "acadlix")}
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

export default AllowedAttemptButton