import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { secondsToHms } from "../../../../../helpers/util";
import { FaRegBookmark } from "react-icons/fa6";
import CustomButton from "../normal-quiz-component/CustomButton";

const QuestionSubjectAndPointSection = (props) => {
  const handleReview = () => {
    props?.setValue(
      `questions.${props?.index}.review`,
      !props?.watch(`questions.${props?.index}.review`),
      { shouldDirty: true }
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginY: "5px",
        }}
      >
        {!props?.watch("hide_question_numbering") && (
          <Box
            sx={{
              marginY: "5px",
            }}
          >
            <Typography sx={{
              fontWeight: "bold"
            }}>
              Question {props?.num} of {props?.watch("questions")?.length}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography>
            {props?.watch("show_marks") && (
              <>
                <b>
                  {props?.watch("view_answer")
                    ? props?.question?.result?.solved_count
                      ? props?.question?.result?.correct_count
                        ? `+${props?.question?.points}`
                        : `-${props?.question?.negative_points}`
                      : 0
                    : props?.question?.points}{" "}
                  Points
                </b>{" "}
              </>
            )}
            {props?.watch("view_answer") &&
              props?.watch("show_per_question_time") && (
                <>
                  {"| "}
                  <b>{secondsToHms(props?.question?.result?.time)}</b>
                </>
              )}
          </Typography>
        </Box>
        {
          !props?.watch("view_answer") && props?.watch("show_review_button") && 
          <Box>
            <CustomButton
              onClick={handleReview}
              sx={{
                display: props?.watch("finish") ? "none" : "",
              }}
            >
              Review Question
            </CustomButton>
          </Box>
        }
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {props?.watch("display_subject") && (
          <Box
            sx={{
              marginY: "2px",
            }}
          >
            <Typography>
              <b>
                Subject:{" "}
                {props?.watch(`questions.${props?.index}.subject_name`)}
              </b>
            </Typography>
          </Box>
        )}
        {/* <Box>
          <Tooltip title="Bookmark">
            <IconButton>
              
              <FaRegBookmark />
            </IconButton>
          </Tooltip>
        </Box> */}
      </Box>
    </>
  );
};

export default QuestionSubjectAndPointSection;
