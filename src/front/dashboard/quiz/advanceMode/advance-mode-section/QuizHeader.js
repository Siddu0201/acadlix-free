import { Box, Button, Typography } from "@mui/material";
import React from "react";

const QuizHeader = (props) => {
  return (
    <Box
      sx={{
        display: {
          xs: 'none',
          md: 'flex',
        },
        justifyContent: "space-between",
      }}
      className="acadlix_quiz_header"
    >
      <Box>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#FF0000" }}>
          Acadlix
        </Typography>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          sx={{
            margin: `4px!important`,
            borderRadius: 0,
          }}
        >
          Switch to full screen
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          sx={{
            margin: `4px!important`,
            borderRadius: 0 ,
          }}
        >
          Pause
        </Button>
      </Box>
    </Box>
  );
};

export default QuizHeader;
