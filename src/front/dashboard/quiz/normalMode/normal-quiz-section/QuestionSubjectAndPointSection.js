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
              {__('Question', 'acadlix')} {props?.num} of {props?.watch("questions")?.length}
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
                        ? `${props?.question?.points > 0 ? "+" : ""}${props?.question?.points} ${__('Point', 'acadlix')}${props?.question?.points > 1 ? 's' : ''}`
                        : `${props?.question?.negative_points > 0 ? "-" : ""}${props?.question?.negative_points} ${__('Point', 'acadlix')}${props?.question?.negative_points > 1 ? __('s', 'acadlix') : ''}`
                      : `0 ${__('Point', 'acadlix')}`
                    : `+${props?.question?.points}${props?.question?.negative_points > 0 ? `/-${props?.question?.negative_points}` : ""} ${__('Point', 'acadlix')}${props?.question?.points > 1 ? 's' : ''}`}
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
          <Box sx={{
            display: props?.watch("finish") ? "none" : "",
          }}>
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
                    }}>
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
