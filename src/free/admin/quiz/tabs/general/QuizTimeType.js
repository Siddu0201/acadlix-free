import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import { FormControl,
    RadioGroup,
    FormControlLabel,
    Radio } from "@mui/material";
import { __ } from "@wordpress/i18n";

const QuizTimeType = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <RadioGroup
                    name="time"
                    row
                    aria-label="acadlix-genral-quiz-time-type"
                    onChange={(e) => {
                        props?.setValue("meta.quiz_settings.quiz_timing_type", e?.target?.value, {
                            shouldDirty: true,
                        });
                    }}
                >
                    <FormControlLabel
                        value="full_quiz_time"
                        control={<Radio />}
                        label={__("Full Quiz", "acadlix")}
                        checked={props?.watch("meta.quiz_settings.quiz_timing_type") === "full_quiz_time"}
                        componentsProps={{
                            typography: {
                                variant: "body2",
                            }
                        }}
                    />
                    <FormControlLabel
                        value="per_question_time"
                        control={<Radio />}
                        label={__("Per Question", "acadlix")}
                        checked={
                            props?.watch("meta.quiz_settings.quiz_timing_type") === "per_question_time"
                        }
                        disabled={
                            (props?.watch("meta.mode") === "advance_mode" &&
                                props?.watch("meta.advance_mode_type") !== "advance_panel") ||
                            props?.watch("meta.mode") === "question_below_each_other"
                        }
                        componentsProps={{
                            typography: {
                                variant: "body2",
                            }
                        }}
                    />
                </RadioGroup>
            </FormControl>
        </GridItem1>
    )
}

export default QuizTimeType