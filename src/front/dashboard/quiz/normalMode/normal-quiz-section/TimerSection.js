import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";

const TimerSection = (props) => {
  const [progress, setProgress] = React.useState(props?.time);
  let interval;

  const startTimer = () => {
    interval = setInterval(() => {
      setProgress((pro) => {
        if (pro > 0) {
          if (pro < 20) {
            stopTimer();
          }
          return pro - 16;
        }
        return pro;
      });
    }, 16);
  };

  const stopTimer = () => {
    clearInterval(interval);
  };

  React.useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [props?.time]);


  return (
    <Box>
      <Typography
        style={{
          margin: 1,
        }}
      >
        Time Limit: {Math.ceil(progress / 1000)}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(progress / props?.time) * 100}
        sx={{
          height: "8px",
          backgroundColor: "transparent",
          '& .MuiLinearProgress-bar': {
            backgroundColor: props?.colorCode?.timer,
          }
        }}
      />
    </Box>
  );
};

export default TimerSection;
