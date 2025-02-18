import { Box, Popover, Typography } from '@mui/material'
import React from 'react'
import Answered from '../answer-type-buttons/Answered'
import NotAnswered from '../answer-type-buttons/NotAnswered'
import NotVisited from '../answer-type-buttons/NotVisited'
import Marked from '../answer-type-buttons/Marked'
import MarkedAndAnswered from '../answer-type-buttons/MarkedAndAnswered'
import { __ } from "@wordpress/i18n";

const SectionPopover = (props) => {
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
    <Popover
        id={props?.aria}
        sx={{
          pointerEvents: "none",
          top: "6px",
        }}
        anchorEl={props?.anchorEl}
        open={props?.open}
        onClose={props?.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: `1px solid ${props?.colorCode?.popover_border}`,
            backgroundColor: props?.colorCode?.popover_background,
          },
        }}
      >
        <Box>
          <Box
            sx={{
              borderBottom: `1px solid ${props?.colorCode?.popover_border}`,
              paddingY: 2,
              paddingX: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
              }}
            >
              {props?.subject_name?.toUpperCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingY: 2,
              paddingX: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Answered
                parentBackground={props?.colorCode?.popover_background}
                {...props}
              >
                {getData("answered")}
              </Answered>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {__("Answered", "acadlix")}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <NotAnswered
                parentBackground={props?.colorCode?.popover_background}
                {...props}
              >
                {getData("not_answered")}
              </NotAnswered>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {__("Not Answered", "acadlix")}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <NotVisited {...props}>{getData("not_visited")}</NotVisited>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {__("Not Visited", "acadlix")}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Marked {...props}>{getData("marked_for_review")}</Marked>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {__("Marked for Review", "acadlix")}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <MarkedAndAnswered {...props}>{getData("answered_and_marked_for_review")}</MarkedAndAnswered>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {__("Answered & Marked for Review", "acadlix")}
                  <br />
                  {__("(will also be evaluated)", "acadlix")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Popover>
  )
}

export default SectionPopover
