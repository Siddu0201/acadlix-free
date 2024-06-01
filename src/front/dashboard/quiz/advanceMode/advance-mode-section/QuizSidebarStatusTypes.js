import React from "react";
import { Box, Typography } from "@mui/material";
import Answered from "../answer-type-buttons/Answered";
import NotAnswered from "../answer-type-buttons/NotAnswered";
import NotVisited from "../answer-type-buttons/NotVisited";
import Marked from "../answer-type-buttons/Marked";
import MarkedAndAnswered from "../answer-type-buttons/MarkedAndAnswered";

const QuizSidebarStatusTypes = (props) => {
  return (
    <Box
      sx={{
        background: props?.colorCode?.sidebar_status_background,
        padding: "0px 0px 12px 17px",
      }}
      id="acadlix_quiz_sidebar_status_types"
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
              150
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
              100
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
            <NotVisited {...props}>100</NotVisited>
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
            <Marked {...props}>200</Marked>
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
            <MarkedAndAnswered {...props}>100</MarkedAndAnswered>
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
