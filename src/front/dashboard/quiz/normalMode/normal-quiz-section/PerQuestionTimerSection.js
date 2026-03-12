import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";
import Countdown from "react-countdown";
import { secondsToHms } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const PerQuestionTimerSection = (props) => {
  const [timer, setTimer] = React.useState(
    Date.now() + props?.question?.time - props?.question?.result?.time * 1000
  );
  const [hide, setHide] = React.useState(true);
  let countdownApi = null;
  const setRef = (countdown) => {
    if (countdown) {
      countdownApi = countdown.getApi();
    }
  };
  React.useEffect(() => {
    if (props?.question?.selected) {
      setHide(false);
      countdownApi.start();
      setTimer(
        Date.now() +
          props?.question?.time -
          props?.question?.result?.time * 1000
      );
    } else {
      countdownApi.pause();
      setHide(true);
    }
  }, [props?.question?.selected]);


  return (
    <Box
      sx={{
        display: hide ? "none" : "block",
        marginY: 2,
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
          if (props?.last) {
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
          } else {
            props?.setValue(
              "questions",
              props.watch("questions")?.map((question, index) => {
                if (question.selected) {
                  question.result.time =
                    question.result.time +
                    Math.round((Date.now() - props?.watch("last")) / 1000);
                  question.selected = false;
                }
                if (index === props?.index + 1) {
                  question.selected = true;
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
              <Typography
                component="div"
                style={{
                  margin: 1,
                }}
                className="acadlix-normal-quiz-per-question-timer-label"
              >
                {__("Time Limit", "acadlix")}: {secondsToHms(Math.ceil(prop?.total / 1000))}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(prop?.total / props?.question?.time) * 100}
                className="acadlix-normal-quiz-per-question-timer-linear-progress"
                sx={{
                  height: "8px",
                  backgroundColor: "transparent",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: props?.colorCode?.timer,
                  },
                }}
              />
            </>
          );
        }}
      ></Countdown>
    </Box>
  );
};

export default PerQuestionTimerSection;
