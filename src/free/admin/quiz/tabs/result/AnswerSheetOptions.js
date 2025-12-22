import React from 'react'
import Grid from '@mui/material/Grid';
import GridItem1 from '@acadlix/components/GridItem1';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import CustomTypography from '@acadlix/components/CustomTypography';
import { __ } from "@wordpress/i18n";
import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip';

const AnswerSheetOptions = (props) => {
    return (
        <Grid
            container
            spacing={3}
            alignItems="center"
        >
            {/* 
              Answer sheet option to hide answer sheet and options availbales are: 
              - Show Per Question Time
                */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Hide Answer Sheet", "acadlix")}
                    <CustomFeatureTooltip
                        plan={"open"}
                        msg={__("This will hide the answer sheet button on frontend.", "acadlix")}
                        placement="right-start"
                        redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/result-options/#hide-answer-sheet`}
                    />
                </CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    checked={props?.watch("meta.quiz_settings.hide_answer_sheet") ?? false}
                    onChange={(e) => {
                        props?.setValue("meta.quiz_settings.hide_answer_sheet", e?.target?.checked, {
                            shouldDirty: true,
                        });
                    }}
                    label={__("Activate", "acadlix")}
                    disabled={
                        props?.watch("meta.mode") === "advance_mode" &&
                        props?.watch("meta.advance_mode_type") !== "advance_panel"
                    }
                />
            </GridItem1>

            {/* Used to show per question time in answer sheet  */}
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <CustomTypography>{__("Show Per Question Time", "acadlix")}
                    <CustomFeatureTooltip
                        plan={acadlixOptions?.isActive ? "open" : "closed"}
                        msg={__("Enabling this will display the time consumed per question.", "acadlix")}
                        placement="right-start"
                    />
                </CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <FormControlLabel
                    control={
                        <CustomSwitch />
                    }
                    // checked={props?.watch("meta.quiz_settings.show_per_question_time") ?? false}
                    disabled
                    // onChange={(e) => {
                    //     props?.setValue(
                    //         "meta.quiz_settings.show_per_question_time",
                    //         e?.target?.checked,
                    //         { shouldDirty: true }
                    //     );
                    // }}
                    label={__("Activate", "acadlix")}
                // disabled={
                //     props?.watch("meta.quiz_settings.hide_answer_sheet")
                //     // ||
                //     // (props?.watch("meta.mode") === "advance_mode" &&
                //     //   props?.watch("meta.advance_mode_type") !== "advance_panel")
                // }
                />
            </GridItem1>
            {/* End Answer sheet option  */}
        </Grid>
    )
}

export default AnswerSheetOptions