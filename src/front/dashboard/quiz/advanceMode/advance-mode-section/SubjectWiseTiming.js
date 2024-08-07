import { Box, Typography } from "@mui/material";
import React from "react";
import Countdown from "react-countdown";
import { secondsToHms } from "../../../../../helpers/util";

const SubjectWiseTiming = (props) => {
  const [timer, setTimer] = React.useState(
    Date.now() +
      props?.time * 1000 -
      props
        ?.watch("questions")
        ?.filter((q) => q?.subject_id === props?.subject?.subject_id)
        ?.reduce((total, q) => total + q?.result?.time, 0) *
        1000
  );
  const [countdownApi, setCountdownApi] = React.useState(null);
  const setRef = (countdown) => {
    if (countdown) {
      setCountdownApi(countdown.getApi());
    }
  };

  React.useEffect(() => {
    if (props?.subject?.selected) {
      countdownApi?.start();
      setTimer(
        Date.now() +
          props?.time * 1000 -
          props
            ?.watch("questions")
            ?.filter((q) => q?.subject_id === props?.subject?.subject_id)
            ?.reduce((total, q) => total + q?.result?.time, 0) *
            1000
      );
    } else {
      countdownApi?.pause();
    }
  }, [props?.subject?.selected, countdownApi]);

  return (
    <Box
    id={`acadlix_quiz_subject_wise_timer_${props?.subject?.subject_id}`}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: 1,
        backgroundColor: props?.colorCode?.timer_background,
      }}
    >
      <Box>
        <Typography variant="caption">Sections</Typography>
      </Box>
      <Box
        sx={{
          display: props?.time === 0 ? "none" : "block",
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
              props?.setValue(`subjects.${props?.s_index}.selected`, false, {
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
            } else {
              props?.setValue(`subjects.${props?.s_index}.selected`, false, {
                shouldDirty: true,
              });
              props?.setValue(`subjects.${props?.s_index + 1}.selected`, true, {
                shouldDirty: true,
              });
              let i = 0;
              let subject_id = props?.watch(`subjects.${props?.s_index + 1}.subject_id`);
              props?.setValue(
                "questions",
                props.watch("questions")?.map((question, index) => {
                  if (question.selected) {
                    question.result.time =
                      question.result.time +
                      Math.round((Date.now() - props?.watch("last")) / 1000);
                  }
                  if (question?.subject_id === subject_id) {
                    if(i === 0){
                        question.selected = true;
                        question.visit = true;
                        i++
                    }else{
                        question.selected = false;
                    }
                }else{
                      question.selected = false;
                  }
                  return question;
                })
              );
            }
            props?.setValue("last", Date.now(), { shouldDirty: true });
          }}
          renderer={(prop) => {
            // console.log(prop);
            return (
              <>
                <Typography variant="subtitle2">
                  Time Left: {secondsToHms(Math.ceil(prop?.total / 1000))}
                </Typography>
              </>
            );
          }}
        ></Countdown>
      </Box>
    </Box>
  );
};

export default SubjectWiseTiming;
