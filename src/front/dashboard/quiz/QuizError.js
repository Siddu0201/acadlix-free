import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import QuizWarning from "../../../images/quiz_warning.svg";

const QuizError = (props) => {
  return (
    <Box sx={{
        position: 'relative',
        height: '100%',
    }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: 'translate(-50%, -50%)',
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          component="img"
          src={QuizWarning}
          sx={{
            height: {
                md : "300px",
                xs: "100%",
            }
          }}
        />
        <Typography variant="h3">{props?.code ?? "404"}</Typography>
        <Typography variant="h6">{props?.message ?? "Page Not Found"}</Typography>
      </Box>
    </Box>
  );
};

export default QuizError;
