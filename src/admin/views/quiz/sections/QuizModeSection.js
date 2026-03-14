import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Radio,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";

const BackButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_back_button" */
      "@acadlix/pro/admin/quiz/sections/mode/BackButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_back_button" */
      "@acadlix/free/admin/quiz/sections/mode/BackButton"
    )
);
const CheckOptionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_check_option_button" */
      "@acadlix/pro/admin/quiz/sections/mode/CheckOptionButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_check_option_button" */
      "@acadlix/free/admin/quiz/sections/mode/CheckOptionButton"
    )
);
const SkipQuestionButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_skip_question_button" */
      "@acadlix/pro/admin/quiz/sections/mode/SkipQuestionButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_skip_question_button" */
      "@acadlix/free/admin/quiz/sections/mode/SkipQuestionButton"
    )
);
const AutoCheckButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_auto_check_button" */
      "@acadlix/pro/admin/quiz/sections/mode/AutoCheckButton"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_auto_check_button" */
      "@acadlix/free/admin/quiz/sections/mode/AutoCheckButton"
    )
);
const AdvanceModeOptions = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
      /* webpackChunkName: "admin_quiz_pro_advance_mode_options" */
      "@acadlix/pro/admin/quiz/sections/mode/AdvanceModeOptions"
    )
    : import(
      /* webpackChunkName: "admin_quiz_free_advance_mode_options" */
      "@acadlix/free/admin/quiz/sections/mode/AdvanceModeOptions"
    )
);

const QuizModeSection = (props) => {

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardHeader
          title={
            <Box sx={{
              display: "flex",
              alignItems: "center",
            }}>
              <Typography variant="h3">{__("Mode", "acadlix")}</Typography>
              <CustomFeatureTooltip
                plan="open"
                msg={__("Choose from various modes. Some features are mode-dependent.", "acadlix")}
                placement="right-start"
                redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/quiz-modes/`}
              />
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {/* Used to enable normal mode 
                - contain enable back button
                - contain enable check button
            */}
            <Grid size={{ xs: 12, sm: 4 }}>
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
                      checked={props?.watch("meta.mode") === "normal"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="normal"
                      onClick={() => {
                        props?.setValue("meta.mode", "normal", {
                          shouldDirty: true,
                        });
                        if (props?.watch("quiz_section") === "5") {
                          props?.setValue("quiz_section", "1", {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      {__("Normal", 'acadlix')}
                    </Typography>
                  </Box>
                  <React.Suspense fallback={null}>
                    <BackButton {...props} />
                  </React.Suspense>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable check and continue mode
                - contain enable on option selected
                - skip button
            */}
            <Grid size={{ xs: 12, sm: 4 }}>
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
                      checked={props?.watch("meta.mode") === "check_and_continue"}
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="check_and_continue"
                      onClick={() => {
                        props?.setValue("meta.mode", "check_and_continue", {
                          shouldDirty: true,
                        });
                        props?.setValue("meta.quiz_settings.attempt_and_move_forward", false, {
                          shouldDirty: true,
                        });
                        if (props?.watch("quiz_section") === "5") {
                          props?.setValue("quiz_section", "1", {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      {__("Check And Continue", 'acadlix')}
                    </Typography>
                  </Box>
                  <Box>
                    <React.Suspense fallback={null}>
                      <CheckOptionButton {...props} />
                    </React.Suspense>

                    <React.Suspense fallback={null}>
                      <SkipQuestionButton {...props} />
                    </React.Suspense>

                    <React.Suspense fallback={null}>
                      <AutoCheckButton {...props} />
                    </React.Suspense>

                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable question below each other mode
                - contain question per page textfield
            */}
            <Grid size={{ xs: 12, sm: 4 }}>
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
                      checked={
                        props?.watch("meta.mode") === "question_below_each_other"
                      }
                      name="mode"
                      sx={{
                        padding: 1,
                      }}
                      value="question_below_each_other"
                      onClick={() => {
                        props?.setValue("meta.mode", "question_below_each_other", {
                          shouldDirty: true,
                        });
                        props?.setValue("meta.quiz_settings.quiz_timing_type", "full_quiz_time", {
                          shouldDirty: true,
                        });
                        props?.setValue("meta.quiz_settings.attempt_and_move_forward", false, {
                          shouldDirty: true,
                        });
                        if (props?.watch("quiz_section") === "5") {
                          props?.setValue("quiz_section", "1", {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      {__("Question Below Each Other", 'acadlix')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        margin: "5px 0 10px 0",
                        cursor: "pointer",
                      }}
                    >
                      {__("Question per page", 'acadlix')}
                      <CustomFeatureTooltip
                        plan="open"
                        msg={__("Set the number of questions to display per page. Users can navigate between pages to answer all questions.", "acadlix")}
                        placement="right-start"
                        redirectTo={`${acadlixOptions?.acadlix_docs_url}quiz-management/quiz-modes/#question-below-each-other`}
                      />
                    </Typography>
                    <CustomTextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Question per page"
                      value={props?.watch("meta.quiz_settings.question_per_page") ?? 10}
                      disabled={
                        props?.watch("meta.mode") !== "question_below_each_other"
                      }
                      onChange={(e) => {
                        props?.setValue(
                          "meta.quiz_settings.question_per_page",
                          Number(e?.target?.value),
                          { shouldDirty: true }
                        );
                      }}
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Used to enable advance mode
                - Advance Panel
                - IBPS
                - SSC
                - GATE
                - SBI
                - JEE
                - Railway
            */}
            <React.Suspense fallback={null}>
              <AdvanceModeOptions {...props} />
            </React.Suspense>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuizModeSection;
