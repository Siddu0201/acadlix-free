import React from "react";
import { Box, Typography } from "@mui/material";
import Answered from "../answer-type-buttons/Answered";
import NotAnswered from "../answer-type-buttons/NotAnswered";
import NotVisited from "../answer-type-buttons/NotVisited";
import Marked from "../answer-type-buttons/Marked";
import MarkedAndAnswered from "../answer-type-buttons/MarkedAndAnswered";

const QuizSidebarStatusTypes = (props) => {
  const getData = (type = '') => {
    let answered = 0, not_answered = 0, not_visited = 0, marked_for_review = 0, answered_and_marked_for_review = 0;

    props?.watch("questions")?.filter(q => q?.subject_id === props?.subject_id)?.forEach(question => {
      if (question?.result?.solved_count && question?.review) {
        answered_and_marked_for_review++;
      } else if (!question?.result?.solved_count && question?.review) {
        marked_for_review++;
      } else if (question?.result?.solved_count && !question?.review) {
        answered++;
      } else if (question?.visit && !question?.result?.solved_count) {
        not_answered++;
      } else if (!question?.visit) {
        not_visited++;
      }
    });
    
    switch(type){
      case 'answered':
        return answered;
      case 'not_answered':
        return not_answered;
      case 'not_visited':
        return not_visited;
      case 'marked_for_review':
        return marked_for_review;
      case 'answered_and_marked_for_review':
        return answered_and_marked_for_review;
      default:
        return 0;
    }
  }
  return (
    <Box
      sx={{
        background: props?.colorCode?.sidebar_status_background,
        padding: "0px 0px 12px 17px",
        display: props?.selected ? "" : "none"
      }}
      id={`acadlix_quiz_sidebar_status_types_${props?.s_index}`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            margin: "10px 0px 0px",
          }}
        >
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <Answered
              parentBackground={props?.colorCode?.sidebar_status_background}
              {...props}
            >
              {getData('answered')}
            </Answered>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              Answered
            </Typography>
          </Box>
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NotAnswered
              parentBackground={props?.colorCode?.sidebar_status_background}
              {...props}
            >
              {getData('not_answered')}
            </NotAnswered>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              Not Answered
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            margin: "10px 0px 0px",
          }}
        >
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NotVisited {...props}>{getData('not_visited')}</NotVisited>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "14px",
              }}
            >
              Not Visited
            </Typography>
          </Box>
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <Marked {...props}>{getData('marked_for_review')}</Marked>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "14px",
              }}
            >
              Marked for Review
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            margin: "10px 0px 0px",
          }}
        >
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <MarkedAndAnswered {...props}>{getData('answered_and_marked_for_review')}</MarkedAndAnswered>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "14px",
              }}
            >
              Answered and Marked for Review (will be considered for evaluation)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizSidebarStatusTypes;
