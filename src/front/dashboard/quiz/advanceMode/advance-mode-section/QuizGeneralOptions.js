import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

const QuizGeneralOptions = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginY: 1,
        marginX: {
          xs: 1,
          md: 3,
        },
        borderBottom: '1px solid #ccc',
      }}
      className="acadlix_quiz_general_options"
    >
      <Box>
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "13px",
            }
          }}
        >
          {props?.isDesktop ? __('Question No.', 'acadlix') : __('Q.N.', 'acadlix')} 1
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: "center",
        }}>
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                md: "13px",
              }
            }}
          >
            {__('Marks | ', 'acadlix')}
          </Typography>
          <Typography
            sx={{
              backgroundColor: "green",
              color: "#fff",
              padding: {
                xs: "2px 5px",
                md: "2px 11px",
              },
              borderRadius: "25%",
              fontSize: {
                xs: "12px",
                md: "13px",
              },
              margin: "0.25rem !important",
            }}
          >
            +10
          </Typography>
          <Typography
            sx={{
              backgroundColor: "red",
              color: "#fff",
              padding: {
                xs: "2px 5px",
                md: "2px 11px",
              },
              borderRadius: "25%",
              fontSize: {
                xs: "12px",
                md: "13px",
              },
              margin: "0.25rem !important",
            }}
          >
            -0.25
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                md: "13px",
              }
            }}
          >
            Time | 01:30:45
          </Typography>
        </Box>
        <Box sx={{
          marginX: 1
        }}>
          <Button
            variant="contained"
            color="section"
            size={props?.isDesktop ? 'medium' : 'small'}
            sx={{
              fontSize: {
                xs: "12px",
                md: "13px",
              },
              padding: {
                xs: '1px 5px',
                md: '1px 10px',
              }
            }}
          >
            {__('Report', 'acadlix')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizGeneralOptions;
