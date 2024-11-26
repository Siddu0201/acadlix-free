import { Box, Chip } from "@mui/material";
import React from "react";
import Countdown from "react-countdown";
import { secondsToHms } from "../../../../../../helpers/util";

const NtaTimer = (props) => {
  console.log(props);
  const setRef = (countdown) => {
    if (countdown) {
      props.setCountDownApi(countdown.getApi());
    }
  };

  React.useEffect(() => {
    if (props?.watch("view_question")) {
      props?.countdownApi?.start();
    }
  }, [props?.watch("view_question"), props?.countdownApi]);

  return (
    <Box
      id="acadlix_quiz_timer"
      sx={{
        display: props?.watch("quiz_timing_type") === "full_quiz_time" ? "flex" : "none",
      }}>
      <Box
        sx={{
          display: props?.watch("quiz_time") === 0 ? "none" : "block",
        }}
      >
        <Countdown
          date={props?.watch("now") + props?.watch("quiz_time")}
          ref={setRef}
          controlled={false}
          autoStart={false}
          intervalDelay={50}
          precision={3}
          onComplete={() => {
            props?.setValue(
              "subjects",
              props?.watch("subjects")?.map((s) => {
                s.selected = false;
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
                }
                question.selected = false;
                return question;
              }),
              { shouldDirty: true }
            );
            props?.setValue("finish", false, { shouldDirty: true });
            props?.setValue("view_question", false, { shouldDirty: true });
            props?.setValue("view_result", true, { shouldDirty: true });
            props?.saveResult();
          }}
          renderer={(prop) => {
            return (
              <Chip sx={{
                backgroundColor: props?.colorCode?.timer_chip_background,
                color: props?.colorCode?.timer_chip_color,
                '& .MuiChip-label': {
                  fontWeight: "bold",
                  fontSize: "14px"
                }
              }} label={secondsToHms(Math.ceil(prop?.total / 1000))}>
              </Chip>
            );
          }}
        ></Countdown>
      </Box>
    </Box>
  );
};

export default NtaTimer;
