import React from "react";
import { Box, Button } from "@mui/material";
import SubjectSummaryModel from "./model/SubjectSummaryModel";
import SubjectWiseSubmitButton from "./SubjectWiseSubmitButton";
import FinalSummaryModel from "./model/FinalSummaryModel";
import { __ } from "@wordpress/i18n";

const QuizSidebarSubmit = (props) => {
  const [submitModel, setSubmitModel] = React.useState(false);

  const handleSubmit = () => {
    props?.setValue(
      "subjects",
      props?.watch("subjects")?.map((s) => {
        if (s.selected) {
          s.selected = false;
        }
        return s;
      })
    );
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("view_question", false, { shouldDirty: true });
    props?.setValue("view_result", true, { shouldDirty: true });
    props?.saveResult();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 1100,
        width: props?.sidebarWidth,
        display: "flex",
        justifyContent: "center",
        paddingY: 1,
        margin: "1px",
        backgroundColor: props?.colorCode?.submit_background,
      }}
      id="acadlix_quiz_sidebar_submit"
    >
      {props?.watch("quiz_timing_type") === "subject_wise_time" &&
        props?.watch("subjects")?.length > 0 &&
        props?.watch("subjects")?.map((s, s_index, arr) => (
          <React.Fragment key={s_index}>
            <SubjectWiseSubmitButton {...props} s_index={s_index} subject={s} />
          </React.Fragment>
        ))}

      {props?.watch("quiz_timing_type") !== "subject_wise_time" && (
        <>
          <FinalSummaryModel
            {...props}
            open={submitModel}
            handleSubmit={handleSubmit}
            submitText="Submit Test"
            handleClose={() => setSubmitModel(false)}
          />
          <Button
            variant="contained"
            // disabled
            onClick={() => setSubmitModel(true)}
            sx={{
              margin: `4px!important`,
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 400,
              paddingX: "18px",
              boxShadow: "none",
              border: `1px solid ${props?.colorCode?.submit_button_border}`,
              backgroundColor: props?.colorCode?.submit_button_background,
              color: props?.colorCode?.submit_button_color,
              ":hover, :focus": {
                border: `1px solid ${props?.colorCode?.submit_button_hover_border}`,
                backgroundColor: props?.colorCode?.submit_button_background,
                color: props?.colorCode?.submit_button_color,
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                border: `1px solid ${props?.colorCode?.submit_button_disabled_background}`,
                backgroundColor:
                  props?.colorCode?.submit_button_disabled_background,
                color: props?.colorCode?.submit_button_color,
              },
            }}
          >
            {__("Submit", "acadlix")}
          </Button>
        </>
      )}
    </Box>
  );
};

export default QuizSidebarSubmit;
