import React from 'react'
import { __ } from "@wordpress/i18n";
import Grid from '@mui/material/Grid2';
import {
    Card,
    CardContent,
    Box,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';

const AdvanceModeOptions = (props) => {
    const setAdvanceModeDefaultSettings = () => {
        // default general setting
        // props?.setValue("meta.quiz_settings.hide_quiz_title", false, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.hide_restart_button", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.show_review_button", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.quiz_timing_type", "full_quiz_time", {
            shouldDirty: true,
        });
        props?.setValue("meta.quiz_settings.enable_login_register", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.login_register_type", "at_start_of_quiz", {
            shouldDirty: true,
        });
        // props?.setValue("meta.quiz_settings.prerequisite", false, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.enable_check_button", false, { shouldDirty: true });

        // default question setting
        // props?.setValue("meta.quiz_settings.skip_question", false, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.show_marks", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.display_subject", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.answer_bullet", false, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.question_overview", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.question_overview", true, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.hide_question_numbering", false, { shouldDirty: true });
        props?.setValue("meta.quiz_settings.sort_by_subject", true, {
            shouldDirty: true,
        });
        props?.setValue("meta.quiz_settings.attempt_and_move_forward", false, {
            shouldDirty: true,
        });
        props?.setValue("meta.quiz_settings.force_user_to_answer_each_question", false, {
            shouldDirty: true,
        });

        // default result setting
        // props?.setValue("meta.quiz_settings.save_statistic", true, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.hide_result", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.hide_negative_marks", true, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.hide_quiz_time", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_speed", true, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_percentile", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_accuracy", true, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_rank", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_average_score", true, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_subject_wise_analysis", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_marks_distribution", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_status_based_on_min_percent", false, {
        //   shouldDirty: true,
        // });
        // props?.setValue("meta.quiz_settings.result_comparision_with_top_five_student", false, {
        //   shouldDirty: true,
        // });
        // props?.setValue("meta.quiz_settings.hide_answer_sheet", false, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.show_per_question_time", true, { shouldDirty: true });
        // props?.setValue("meta.quiz_settings.leaderboard", false, { shouldDirty: true });
    };

    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card
                sx={{
                    height: "100%",
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            textAlign: "center",
                            marginY: 2,
                        }}
                    >
                        <Radio
                            // checked={props?.watch("meta.mode") === "advance_mode"}
                            disabled
                            name="mode"
                            sx={{
                                padding: 1,
                            }}
                            value="advance_mode"
                            // onClick={() => {
                            //     props?.setValue("meta.mode", "advance_mode", {
                            //         shouldDirty: true,
                            //     });

                            //     setAdvanceModeDefaultSettings();
                            // }}
                        />
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{
                                margin: "5px 0 5px 0",
                                cursor: "pointer",
                            }}
                        >
                            {__("Advance mode", "acadlix")}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                margin: "5px 0",
                            }}
                        >
                            ({__("Quiz Option will only set as per the exam", "acadlix")})
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <FormControl>
                            <RadioGroup
                                row
                                name="advance_mode"
                                // onChange={(e) => {
                                //     props?.setValue("meta.advance_mode_type", e.target.value, {
                                //         shouldDirty: true,
                                //     });

                                //     setAdvanceModeDefaultSettings();
                                // }}
                                sx={{
                                    display:
                                        props?.watch("meta.mode") === "advance_mode"
                                            ? ""
                                            : "none",
                                }}
                            >
                                <FormControlLabel
                                    value="advance_panel"
                                    control={<Radio />}
                                    label={__("Advance Panel", "acadlix")}
                                    // checked={
                                    //     props?.watch("meta.advance_mode_type") ===
                                    //     "advance_panel"
                                    // }
                                    disabled
                                />
                                <FormControlLabel
                                    value="ibps"
                                    control={<Radio />}
                                    label={__("IBPS", "acadlix")}
                                    // checked={props?.watch("meta.advance_mode_type") === "ibps"}
                                    disabled
                                />
                                <FormControlLabel
                                    value="ssc"
                                    control={<Radio />}
                                    label={__("SSC", "acadlix")}
                                    // checked={props?.watch("meta.advance_mode_type") === "ssc"}
                                    disabled
                                />
                                <FormControlLabel
                                    value="gate"
                                    control={<Radio />}
                                    label={__("GATE", "acadlix")}
                                    // checked={props?.watch("meta.advance_mode_type") === "gate"}
                                    disabled
                                />
                                <FormControlLabel
                                    value="sbi"
                                    control={<Radio />}
                                    label={__("SBI", "acadlix")}
                                    // checked={props?.watch("meta.advance_mode_type") === "sbi"}
                                    disabled
                                />
                                <FormControlLabel
                                    value="jee"
                                    control={<Radio />}
                                    label={__("JEE", "acadlix")}
                                    // checked={props?.watch("meta.advance_mode_type") === "jee"}
                                    disabled
                                />
                                <FormControlLabel
                                    value="railway"
                                    control={<Radio />}
                                    label={__("Railway", "acadlix")}
                                    // checked={
                                    //     props?.watch("meta.advance_mode_type") === "railway"
                                    // }
                                    disabled
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default AdvanceModeOptions