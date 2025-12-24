import React from 'react'
import Grid from '@mui/material/Grid';
import FormControlLabel from "@mui/material/FormControlLabel";
import { __ } from "@wordpress/i18n";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import CustomTypography from "@acadlix/components/CustomTypography";
import CustomTextField from "@acadlix/components/CustomTextField";
import { Alert } from '@mui/material';
import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip';

const AdvanceOptions = (props) => {
    return (
        <Grid
            container
            spacing={3}
            alignItems="center"
        >
            {/* Used to set limited number of question in a quiz */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Show Only Specific Number of Questions", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Shows only a specific number of questions from the total available questions in the quiz.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
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
                <CustomTypography>{__("Specific Number of Questions", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Students will be allowed to attempt only this number of questions out of the total available. For example, if the quiz has 100 questions and you set this to 80, students can choose any 80 questions to answer.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
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
                <CustomTypography>{__("Enable Selectable Questions Rule", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Enable this option to apply a selectable questions rule to the quiz, allowing learners to attempt X number of questions out of Y total questions.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
                <Alert severity="info">
                    {__("Set questions from Subject-wise Actions on Quiz page.", "acadlix")}
                </Alert>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Enable Inline Answer Options Layout", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("When enabled, multiple answer options are shown in a row instead of one per line (For Single choice, Multi choice and True / False questions).", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    // checked={props?.watch("meta.quiz_settings.enable_inline_answer_options_layout") ?? false}
                    disabled
                    // onChange={(e) => {
                    //     props?.setValue("meta.quiz_settings.enable_inline_answer_options_layout", e?.target?.checked, {
                    //         shouldDirty: true,
                    //     });
                    // }}
                    label={__("Activate", "acadlix")}
                />
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Options per Row", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Controls how many answer options appear in each row before wrapping to the next line.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
            </GridItem1>

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTextField
                    fullWidth
                    size="small"
                    type="number"
                    label={__("Options per Row", "acadlix")}
                    // value={props?.watch("meta.quiz_settings.options_per_row") ?? 0}
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.options_per_row",
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

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Enable Check Button", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Enables check button to verify answers during quiz.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
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
                <CustomTypography>{__("Scientific Calculator", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("When enabled, an on-screen scientific calculator will be available to learners in advanced quiz modes, helping them perform complex calculations during the quiz.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
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
                <CustomTypography>{__("Result Feedback By AI", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__(`Enables AI-generated feedback for quiz attempts, providing students with deeper performance insights.Note: An OpenAI API key must be configured for this feature to work.`, "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
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

            <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }} sx={{
                display: {
                    xs: "none",
                    sm: "none",
                    lg: "block"
                }
            }}></GridItem1>

            {/* <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1> */}

            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Result Feedback Additional Prompt", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Use this option to modify the prompt used for generating result feedback, allowing you to tailor the feedback to your requirements.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
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