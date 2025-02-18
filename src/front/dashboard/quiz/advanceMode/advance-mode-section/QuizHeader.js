import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

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
          {__('Acadlix', 'acadlix')}
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
          {__('Switch to full screen', 'acadlix')}
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
          {__('Pause', 'acadlix')}
        </Button>
      </Box>
    </Box>
  );
};

export default QuizHeader;
