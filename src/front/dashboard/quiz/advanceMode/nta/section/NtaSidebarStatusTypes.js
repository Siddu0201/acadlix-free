import { Box, Typography } from "@mui/material";
import React from "react";
import NtaAnswered from "../type-button/NtaAnswered";
import NtaNotAnswered from "../type-button/NtaNotAnswered";
import NtaNotVisited from "../type-button/NtaNotVisited";
import NtaMarked from "../type-button/NtaMarked";
import NtaMarkedAndAnswered from "../type-button/NtaMarkedAndAnswered";
import { __ } from "@wordpress/i18n";

const NtaSidebarStatusTypes = (props) => {
  const getData = (type = "") => {
    let answered = 0,
      not_answered = 0,
      not_visited = 0,
      marked_for_review = 0,
      answered_and_marked_for_review = 0;

    props
      ?.watch("questions")
      ?.filter((q) => q?.subject_id === props?.subject_id)
      ?.forEach((question) => {
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

    switch (type) {
      case "answered":
        return answered;
      case "not_answered":
        return not_answered;
      case "not_visited":
        return not_visited;
      case "marked_for_review":
        return marked_for_review;
      case "answered_and_marked_for_review":
        return answered_and_marked_for_review;
      default:
        return 0;
    }
  };

  return (
    <Box
      sx={{
        background: props?.colorCode?.sidebar_status_background,
        paddingY: 6,
        paddingX: 8,
        marginTop: 2,
        border: "dotted",
        display: props?.selected ? "" : "none",
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
            gap: 3,
            marginY: 3/2,
            alignItems: "center"
          }}
        >
          {/* Not visited  */}
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NtaNotVisited {...props}>{getData("not_visited")}</NtaNotVisited>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "14px",
              }}
            >
              {__("Not Visited", "acadlix")}
            </Typography>
          </Box>

          {/* Not Answered  */}
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NtaNotAnswered
              parentBackground={props?.colorCode?.sidebar_status_background}
              {...props}
            >
              {getData("not_answered")}
            </NtaNotAnswered>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
              }}
            >
              {__("Not Answered", "acadlix")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            marginY: 3/2,
            alignItems: "center"
          }}
        >
          {/* Answered  */}
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NtaAnswered
              parentBackground={props?.colorCode?.sidebar_status_background}
              {...props}
            >
              {getData("answered")}
            </NtaAnswered>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
              }}
            >
              {__("Answered", "acadlix")}
            </Typography>
          </Box>
          {/* Marked for review  */}
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NtaMarked {...props}>{getData("marked_for_review")}</NtaMarked>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "14px",
              }}
            >
              {__("Marked for Review", "acadlix")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            marginY: 3/2,
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              margin: "0px 6px 0px 0px",
            }}
          >
            <NtaMarkedAndAnswered {...props}>
              {getData("answered_and_marked_for_review")}
            </NtaMarkedAndAnswered>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "14px",
              }}
            >
              {__("Answered and Marked for Review (will be considered for evaluation)", "acadlix")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NtaSidebarStatusTypes;
