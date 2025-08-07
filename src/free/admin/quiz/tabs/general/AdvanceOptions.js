import React from 'react'
import Grid from '@mui/material/Grid';
import FormControlLabel from "@mui/material/FormControlLabel";
import { __ } from "@wordpress/i18n";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import CustomTextField from "@acadlix/components/CustomTextField";
import { Alert } from '@mui/material';

const AdvanceOptions = (props) => {
    return (
        <Grid
            container
            spacing={3}
            alignItems="center"
        >
            {/* Used to set limited number of question in a quiz */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Show Only Specific Number of Questions", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    disabled
                    // checked={
                    //     props?.watch("meta.quiz_settings.show_only_specific_number_of_questions") ??
                    //     false
                    // }
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.show_only_specific_number_of_questions",
                    //         e?.target?.checked,
                    //         { shouldDirty: true }
                    //     );
                    // }}
                    label={__("Activate", "acadlix")}
                />
            </GridItem1>

            {/* Number of question to set in quiz */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Specific Number of Questions", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTextField
                    fullWidth
                    size="small"
                    type="number"
                    label={__("Specific Number of Questions", "acadlix")}
                    // value={props?.watch("meta.quiz_settings.specific_number_of_questions") ?? 0}
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.specific_number_of_questions",
                    //         Number(e?.target?.value),
                    //         { shouldDirty: true }
                    //     );
                    // }}
                    disabled
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

            {/* Used to set selectable question rule in a quiz */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Enable Selectable Questions Rule", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <Alert severity="info">
                    {__("Set questions from Subject-wise Actions on Quiz page.", "acadlix")}
                </Alert>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Enable Check Button", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    // checked={props?.watch("meta.quiz_settings.enable_check_button") ?? false}
                    disabled
                    // onChange={(e) => {
                    //     props?.setValue("meta.quiz_settings.enable_check_button", e?.target?.checked, {
                    //         shouldDirty: true,
                    //     });
                    // }}
                    label={__("Activate", "acadlix")}
                />
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Scientific Calculator", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    // checked={props?.watch("meta.quiz_settings.scientific_calculator") ?? false}
                    disabled
                    // onChange={(e) => {
                    //     props?.setValue("meta.quiz_settings.scientific_calculator", e?.target?.checked, {
                    //         shouldDirty: true,
                    //     });
                    // }}
                    label={__("Activate", "acadlix")}
                />
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Result Feedback By AI", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    // checked={props?.watch("meta.quiz_settings.result_feedback_by_ai") ?? false}
                    disabled
                    // onChange={(e) => {
                    //     props?.setValue("meta.quiz_settings.result_feedback_by_ai", e?.target?.checked, {
                    //         shouldDirty: true,
                    //     });
                    // }}
                    label={__("Activate", "acadlix")}
                />
            </GridItem1>

            {/* <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1> */}

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Result Feedback Additional Prompt", "acadlix")}</CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
                <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label={__("Prompt (Optional)", "acadlix")}
                    // value={props?.watch("meta.quiz_settings.result_feedback_additional_prompt")}
                    // onChange={(e) => {
                    //     props?.setValue("meta.quiz_settings.result_feedback_additional_prompt", e?.target?.value, {
                    //         shouldDirty: true,
                    //     });
                    // }}
                    disabled
                    slotProps={{
                        htmlInput: {
                            sx: {
                                border: `0 !important`,
                                boxShadow: `none !important`,
                                minHeight: `auto !important`,
                            },
                        }
                    }}
                />
            </GridItem1>
        </Grid>
    )
}

export default AdvanceOptions