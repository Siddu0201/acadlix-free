import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";
import Countdown from "react-countdown";
import { secondsToHms } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const TimerSection = (props) => {
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
    <Box sx={{
      display: props?.watch('quiz_time') === 0 ? "none" : "block",
      marginY: 2,
    }}>
      <Countdown
        date={props?.watch('now') + props?.watch('quiz_time')}
        ref={setRef}
        controlled={false}
        autoStart={false}
        intervalDelay={50}
        precision={3}
        onComplete={() => {
          props?.setValue(
            "questions",
            props.watch("questions")?.map((question, index) => {
              if(question.selected){
                question.result.time = question.result.time + Math.round(((Date.now() - props?.watch("last"))/1000));
              }
              question.selected = false;
              return question;
            }),
            { shouldDirty: true }
          );
          props?.setValue('view_question', false, {shouldDirty: true});
          props?.setValue('view_result', true, {shouldDirty: true});
          props?.saveResult();
        }}
        renderer={(prop) => {
          return (
          <>
            <Typography
              sx={{
                margin: 1,
              }}
            >
              {__("Time Limit", "acadlix")}: {secondsToHms(Math.ceil(prop?.total / 1000))}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(prop?.total / props?.watch('quiz_time')) * 100}
              sx={{
                height: "8px",
                backgroundColor: "transparent",
                '& .MuiLinearProgress-bar': {
                  backgroundColor: props?.colorCode?.timer,
                }
              }}
            />
          </>
          )
        }
        }
      >

      </Countdown>
    </Box>
  );
};

export default TimerSection;
