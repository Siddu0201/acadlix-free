import React from "react";
import { Box, Typography } from "@mui/material";
import Countdown from "react-countdown";
import { secondsToHms } from "../../../../../helpers/util";
import { __ } from "@wordpress/i18n";

const QuizTimer = (props) => {
  const setRef = (countdown) => {
    if(countdown){
      props.setCountDownApi(countdown.getApi());
    }
  }

  React.useEffect(() => {
    if(props?.watch("view_question")){
        props?.countdownApi?.start();
    }
  },[props?.watch('view_question'), props?.countdownApi]);

  return (
    <Box
      id="acadlix_quiz_timer"
      sx={{
        flex: 0,
        display: "flex",
        justifyContent: "space-between",
        padding: 1,
        backgroundColor: props?.colorCode?.timer_background,
      }}
    >
      <Box>
        <Typography variant="caption">{__("Sections", "acadlix")}</Typography>
      </Box>
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
            props?.setValue("subjects",
              props?.watch("subjects")?.map(s => {
                s.selected = false;
                return s
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
            props?.setValue("view_question", false, { shouldDirty: true });
            props?.setValue("view_result", true, { shouldDirty: true });
            props?.saveResult();
          }}
          renderer={(prop) => {
            return (
              <>
                <Typography
                  variant="subtitle2"
                >
                  {__("Time Left:", "acadlix")} {secondsToHms(Math.ceil(prop?.total / 1000))}
                </Typography>
              </>
            );
          }}
        ></Countdown>
      </Box>
    </Box>
  );
};

export default QuizTimer;
