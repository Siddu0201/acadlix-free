import React from "react";
import SubjectSummaryModel from "./model/SubjectSummaryModel";
import { Button } from "@mui/material";

const SubjectWiseSubmitButton = (props) => {
  const handleSubmitSection = (subject_index) => {
    props?.setValue(
      "subjects",
      props?.watch("subjects")?.map((s, s_index) => {
        if (subject_index === s_index) {
          s.submitted = true;
          s.model = false;
        }
        if (s_index === subject_index + 1) {
          s.selected = true;
        } else {
          s.selected = false;
        }
        return s;
      })
    );

    let i = 0;
    const subject_id = props
      ?.watch("subjects")
      ?.filter((s, s_index) => s_index === subject_index + 1)?.[0]?.subject_id;
    props?.setValue(
      "questions",
      props?.watch("questions")?.map((q) => {
        if (q.selected) {
          q.result.time =
            q.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (q?.subject_id === subject_id) {
          if (i === 0) {
            q.selected = true;
            q.visit = true;
            i++;
          } else {
            q.selected = false;
          }
        } else {
          q.selected = false;
        }
        return q;
      })
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };

  const handleSubmit = (subject_index = 0) => {
    props?.setValue(`subjects.${subject_index}.selected`, false, {
      shouldDirty: true,
    });
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
    <>
      {props?.subject?.selected && props?.watch("subjects")?.length - 1 !== props?.s_index && (
        <>
          <SubjectSummaryModel
            {...props}
            open={props?.subject?.model}
            handleSubmit={handleSubmitSection}
            submitText="Submit Section"
            handleClose={() =>
              props?.setValue(`subjects.${props?.s_index}.model`, false, {
                shouldDirty: true,
              })
            }
          />
          <Button
            variant="contained"
            // disabled
            onClick={() =>
              props?.setValue(`subjects.${props?.s_index}.model`, true, {
                shouldDirty: true,
              })
            }
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
            Submit Section
          </Button>
        </>
      )}
      {props?.subject?.selected && (
        <>
          <SubjectSummaryModel
            {...props}
            open={props?.subject?.submitModel}
            handleSubmit={handleSubmit}
            submitText="Submit Test"
            handleClose={() =>
              props?.setValue(`subjects.${props?.s_index}.submitModel`, false, {
                shouldDirty: true,
              })
            }
          />
          <Button
            variant="contained"
            // disabled
            onClick={() =>
              props?.setValue(`subjects.${props?.s_index}.submitModel`, true, {
                shouldDirty: true,
              })
            }
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
            Submit
          </Button>
        </>
      )}
    </>
  );
};

export default SubjectWiseSubmitButton;
