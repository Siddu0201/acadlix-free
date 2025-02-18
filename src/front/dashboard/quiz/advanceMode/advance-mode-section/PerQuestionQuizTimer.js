import { Box, Typography } from "@mui/material";
import React from "react";
import Countdown from "react-countdown";
import { secondsToHms } from "../../../../../helpers/util";
import { __ } from "@wordpress/i18n";

const PerQuestionQuizTimer = (props) => {
  const currentIndex = props?.watch("questions")?.findIndex(q => q?.question_id === props?.question?.question_id);
  const [timer, setTimer] = React.useState(
    Date.now() + props?.question?.time - props?.question?.result?.time * 1000
  );
  const [countdownApi, setCountdownApi] = React.useState(null);
  const setRef = (countdown) => {
    if (countdown) {
      setCountdownApi(countdown.getApi());
    }
  };
  React.useEffect(() => {
    if (props?.question?.selected) {
      countdownApi?.start();
      setTimer(
        Date.now() +
          props?.question?.time -
          props?.question?.result?.time * 1000
      );
    } else {
      countdownApi?.pause();
    }
  }, [props?.question?.selected, countdownApi]);

  return (
    <Box
      id={`acadlix_quiz_per_question_timer_${props?.question?.question_id}`}
      sx={{
        flex: 0,
        display: "flex",
        justifyContent: "space-between",
        padding: 1,
        backgroundColor: props?.colorCode?.timer_background,
      }}
    >
      <Box>
        <Typography variant="caption">
          {__("Sections", "acadlix")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: props?.watch("quiz_time") === 0 ? "none" : "block",
        }}
      >
        <Countdown
          date={timer}
          ref={setRef}
          controlled={false}
          autoStart={false}
          intervalDelay={50}
          precision={3}
          onComplete={() => {
            if (props?.last_subject) {
              if (props?.last) {
                props?.setValue(`subjects.${props?.s_index}.selected`, false, {
                  shouldDirty: true,
                });
              }
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
              );
              props?.setValue("view_question", false, { shouldDirty: true });
              props?.setValue("view_result", true, { shouldDirty: true });
              props?.saveResult();
            } else {
              if (props?.last) {
                props?.setValue(`subjects.${props?.s_index}.selected`, false, {
                  shouldDirty: true,
                });
                props?.setValue(
                  `subjects.${props?.s_index + 1}.selected`,
                  true,
                  { shouldDirty: true }
                );
              }
              props?.setValue(
                "questions",
                props.watch("questions")?.map((question, index) => {
                  if (question.selected) {
                    question.result.time =
                      question.result.time +
                      Math.round((Date.now() - props?.watch("last")) / 1000);
                    question.selected = false;
                  }
                  if (index === currentIndex + 1) {
                    question.selected = true;
                    question.visit = true;
                  }
                  return question;
                }),
                { shouldDirty: true }
              );
              props?.setValue("last", Date.now(), { shouldDirty: true });
            }
          }}
          renderer={(prop) => {
            return (
              <>
                <Typography variant="subtitle2">
                  {__("Time Left:", "acadlix")}{" "}
                  {secondsToHms(Math.ceil(prop?.total / 1000))}
                </Typography>
              </>
            );
          }}
        ></Countdown>
      </Box>
    </Box>
  );
};

export default PerQuestionQuizTimer;
