import { Box, Typography } from "@mui/material";
import React from "react";
import { secondsToHms } from "../../../../../helpers/util";

const QuestionSubjectAndPointSection = (props) => {
  return (
    <>
      <Box
        sx={{
          marginY: "5px",
        }}
      >
        <Typography>
          Question <b>{props?.num}</b> of{" "}
          <b>{props?.watch("questions")?.length}</b>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginY: "5px",
        }}
      >
        <Box>
          <Typography>{props?.num}. Question</Typography>
        </Box>
        <Box>
          <Typography>
            <b>{props?.question?.points} points</b>
            {
              props?.watch("view_answer") &&
              <>
               {" "} | <b>{secondsToHms(props?.question?.result?.time)}</b>
              </>
            }
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          marginY: "2px",
        }}
      >
        <Typography>
          <b>Category: {props?.watch("category")}</b>
        </Typography>
      </Box>
    </>
  );
};

export default QuestionSubjectAndPointSection;
