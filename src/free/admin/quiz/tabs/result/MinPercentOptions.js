import React from 'react'
import GridItem1 from '@acadlix/components/GridItem1';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import CustomTextField from '@acadlix/components/CustomTextField';
import CustomTypography from '@acadlix/components/CustomTypography';
import { __ } from "@wordpress/i18n";

const MinPercentOptions = (props) => {
    return (
        <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Show Status Based On Min % (Pass/Fail)", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    checked={
                        props?.watch("meta.quiz_settings.show_status_based_on_min_percent") ?? false
                    }
                    onChange={(e) => {
                        props?.setValue(
                            "meta.quiz_settings.show_status_based_on_min_percent",
                            e?.target?.checked,
                            { shouldDirty: true }
                        );
                    }}
                    label={__("Activate", "acadlix")}
                    disabled={
                        props?.watch("meta.quiz_settings.hide_result")
                        // ||
                        // (props?.watch("meta.mode") === "advance_mode" &&
                        //   props?.watch("meta.advance_mode_type") !== "advance_panel")
                    }
                />
            </GridItem1>

            {/* Minimum marks to pass - default 0  */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Minimum % to pass", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTextField
                    fullWidth
                    size="small"
                    label={__("Minimum % to pass", "acadlix")}
                    type="number"
                    value={props?.watch("meta.quiz_settings.minimum_percent_to_pass") ?? 0}
                    onChange={(e) => {
                        props?.setValue("meta.quiz_settings.minimum_percent_to_pass",
                            Number(e?.target?.value), {
                            shouldDirty: true,
                        });
                    }}
                    disabled={
                        props?.watch("meta.quiz_settings.hide_result") ||
                        !props?.watch("meta.quiz_settings.show_status_based_on_min_percent")
                    }
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
            </GridItem1>
        </>
    )
}

export default MinPercentOptions