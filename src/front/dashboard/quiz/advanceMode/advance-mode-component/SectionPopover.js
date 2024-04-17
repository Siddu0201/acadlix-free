import { Box, Popover, Typography } from '@mui/material'
import React from 'react'
import Answered from '../answer-type-buttons/Answered'
import NotAnswered from '../answer-type-buttons/NotAnswered'
import NotVisited from '../answer-type-buttons/NotVisited'
import Marked from '../answer-type-buttons/Marked'
import MarkedAndAnswered from '../answer-type-buttons/MarkedAndAnswered'

const SectionPopover = (props) => {
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
              GENERAL AWARENESS
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
                0
              </Answered>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  Answered
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
                1
              </NotAnswered>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  Not Answered
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <NotVisited {...props}>1</NotVisited>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  Not Visited
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Marked {...props}>1</Marked>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  Marked for Review
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <MarkedAndAnswered {...props}>1</MarkedAndAnswered>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  Answered & Marked for Review
                  <br />
                  (will also be evaluated)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Popover>
  )
}

export default SectionPopover
