import { Box, Typography } from "@mui/material";
import React from "react";
import { secondsToHms } from "../../../../../helpers/util";

const QuestionSubjectAndPointSection = (props) => {
  return (
    <>
      {
        props?.watch("question_overview") &&
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
      }
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginY: "5px",
        }}
      >
        <Box>
          {
            !props?.watch("hide_question_numbering") &&
            <Typography>Question {props?.num}:</Typography>
          }
        </Box>
        <Box>
          <Typography>
            {
              props?.watch("show_marks") &&
              <b>{props?.question?.points} points</b>
            }
            {
              props?.watch("view_answer") && props?.watch("show_per_question_time") &&
              <>
               {" "} | <b>{secondsToHms(props?.question?.result?.time)}</b>
              </>
            }
          </Typography>
        </Box>
      </Box>
      {
        props?.watch("display_subject") &&
        <Box
          sx={{
            marginY: "2px",
          }}
        >
          <Typography>
            <b>Subject: {props?.watch(`questions.${props?.index}.subject_name`)}</b>
          </Typography>
        </Box>
      }
    </>
  );
};

export default QuestionSubjectAndPointSection;
