import { Box } from "@mui/material";
import React from "react";
import NtaQuestion from "./NtaQuestion";
import NtaButtonOptions from "./NtaButtonOptions";
import NtaSubmitButtonOptions from "./NtaSubmitButtonOptions";

const NtaQuestionPanel = (props) => {
  const currentIndex = props
    ?.watch("questions")
    ?.findIndex((q) => q?.question_id === props?.question?.question_id);

  const handleBack = () => {
    if (props?.first) {
      props?.setValue(
        "subjects",
        props?.watch("subjects")?.map((s, s_index) => {
          if (s_index === props?.s_index - 1) {
            s.selected = true;
          } else {
            s.selected = false;
          }
          return s;
        })
      );
    }
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (index === currentIndex - 1) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      })
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };

  const handleNext = () => {
    if (props?.last) {
      if (props?.last_subject) {
      } else {
        props?.setValue(
          "subjects",
          props?.watch("subjects")?.map((s, s_index) => {
            if (s_index === props?.s_index + 1) {
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
          ?.filter((s, i) => i === props?.s_index + 1)?.[0]?.subject_id;
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
      }
    } else {
      props?.setValue(
        "questions",
        props.watch("questions")?.map((question, index) => {
          if (question.selected) {
            question.result.time =
              question.result.time +
              Math.round((Date.now() - props?.watch("last")) / 1000);
          }
          if (index === currentIndex + 1) {
            question.selected = true;
            question.visit = true;
          } else {
            question.selected = false;
          }
          return question;
        })
      );
      props?.setValue("last", Date.now(), { shouldDirty: true });
    }
  };

  const [remainingTop, setRemainingTop] = React.useState(0);
  const [buttonHeight, setButtonHeight] = React.useState(0);

  const idList = [
    "acadlix_nta_top_home",
    "acadlix_nta_logo",
    "acadlix_nta_user",
    "acadlix_nta_subsection",
  ];

  React.useLayoutEffect(() => {
    let top = 0;
    idList.forEach((a, i) => {
      top += document.getElementById(a)?.clientHeight ?? 0;
    });
    if (acadlixOptions?.is_admin_bar_showing) {
      top += props?.isDesktop ? 32 : 46;
    }
    setRemainingTop(top);
    let height = 0;
    height +=
      document.getElementById(`acadlix_nta_buttons_${props?.index}`)
        ?.clientHeight ?? 0;
    setButtonHeight(height);
  });

  return (
    <Box
      sx={{
        display: props?.question?.selected ? "flex" : " none",
        flexDirection: "column",
        position: "relative",
        height: `calc(100% - ${remainingTop}px)`,
      }}
    >
      <Box
        sx={{
          paddingX: 2,
          marginX: 2,
          paddingTop: 2,
          height: `calc(100% - ${buttonHeight}px)`,
          overflowY: "auto",
        }}
      >
        <NtaQuestion {...props} />
      </Box>
      <Box
        id={`acadlix_nta_buttons_${props?.index}`}
        sx={{
          position: "absolute",
          bottom: 0,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Box
          sx={{
            paddingX: 4,
          }}
        >
          <NtaButtonOptions
            {...props}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </Box>
        <NtaSubmitButtonOptions
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      </Box>
    </Box>
  );
};

export default NtaQuestionPanel;
