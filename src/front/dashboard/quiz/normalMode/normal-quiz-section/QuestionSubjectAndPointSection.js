import { Box, Button, Tooltip, Typography } from "@mui/material";
import React from "react";
import { secondsToHms } from "@acadlix/helpers/util";
import { MdOutlineReviews, MdReviews, FaRegBookmark } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";

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
          alignItems: "center",
          marginY: "5px",
        }}
        className="acadlix-normal-quiz-question-subject-and-point-section"
      >
        {!props?.watch("hide_question_numbering") && (
          <Box
            sx={{
              marginY: "5px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold"
              }}
              className="acadlix-normal-quiz-question-number"
            >
              {__('Question', 'acadlix')} {props?.num} {__('of', 'acadlix')} {props?.watch("questions")?.length}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography
            className="acadlix-normal-quiz-question-point-time-section"
            component="span"
          >
            {props?.watch("show_marks") && (
              <Typography
                className="acadlix-normal-quiz-question-point"
                component="span"
                sx={{
                  fontWeight: "bold"
                }}
              >
                {props?.watch("view_answer")
                  ? props?.question?.result?.solved_count
                    ? props?.question?.result?.correct_count
                      ? `${props?.question?.points > 0 ? "+" : ""}${props?.question?.points} ${__('Point', 'acadlix')}${props?.question?.points > 1 ? 's' : ''}`
                      : `${props?.question?.negative_points > 0 ? "-" : ""}${props?.question?.negative_points} ${__('Point', 'acadlix')}${props?.question?.negative_points > 1 ? __('s', 'acadlix') : ''}`
                    : `0 ${__('Point', 'acadlix')}`
                  : `+${props?.question?.points}${props?.question?.negative_points > 0 ? `/-${props?.question?.negative_points}` : ""} ${__('Point', 'acadlix')}${props?.question?.points > 1 ? 's' : ''}`}
                {" "}
              </Typography>
            )}
            {props?.watch("view_answer") &&
              props?.watch("show_per_question_time") && (
                <>
                  {"| "}
                  <Typography
                    className="acadlix-normal-quiz-question-time"
                    component="span"
                    sx={{
                      fontWeight: "bold"
                    }}
                  >
                    {secondsToHms(props?.question?.result?.time)}
                  </Typography>
                </>
              )}
          </Typography>
        </Box>
        {
          !props?.watch("view_answer") && props?.watch("show_review_button") &&
          <Box
            sx={{
              display: props?.watch("finish") ? "none" : "",
            }}
            className="acadlix-normal-quiz-question-review-section"
          >
            {
              props?.question?.review ?
                <Tooltip title={__('Remove from review', 'acadlix')}>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleReview}
                    sx={{
                      fontSize: {
                        xs: 20,
                        md: 18
                      }
                    }}
                    className="acadlix-normal-quiz-question-remove-review-button"
                  >
                    <MdReviews />
                  </Button>
                </Tooltip>
                :
                <Tooltip title={__('Mark as review', 'acadlix')}>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleReview}
                    sx={{
                      fontSize: {
                        xs: 20,
                        md: 18
                      }
                    }}
                    className="acadlix-normal-quiz-question-review-button"
                  >
                    <MdOutlineReviews />
                  </Button>
                </Tooltip>
            }
            {/* <CustomButton
              onClick={handleReview}
              sx={{
                display: props?.watch("finish") ? "none" : "",
              }}
            >
              Review Question
            </CustomButton> */}
          </Box>
        }
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        className="acadlix-normal-quiz-question-subject-section"
      >
        {props?.watch("display_subject") && (
          <Box
            sx={{
              marginY: "2px",
            }}
          >
            <Typography
              className="acadlix-normal-quiz-question-subject-content"
              fontWeight="bold"
            >
              {__('Subject', 'acadlix')}: {" "}
              {props?.watch(`questions.${props?.index}.subject_name`)}
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
