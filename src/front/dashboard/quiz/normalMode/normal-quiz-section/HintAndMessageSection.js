import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";

const HintAndMessageSection = (props) => {
  const theme = useTheme();
  return (
    <Box sx={{
      display: props?.lang?.selected ? "" : "none",
    }}>
      <Box
        sx={{
          border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
          padding: 2,
          marginY: 2,
          borderRadius: 1,
          backgroundColor: "transparent",
          boxShadow: theme?.shadows[1],
          display:
            props?.question?.hint && props?.lang?.hint_msg?.length > 0
              ? ""
              : "none",
        }}
      >
        <Box>
          <Typography>
            <b>Hint</b>
          </Typography>
        </Box>
        <Box>
          <Typography component="div">{props?.lang?.hint_msg}</Typography>
        </Box>
      </Box>
      {props?.question?.check ? (
        props?.question?.result?.correct_count ? (
          <Box
            sx={{
              border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
              padding: 2,
              marginY: 2,
              borderRadius: 1,
              backgroundColor: "transparent",
              boxShadow: theme?.shadows[1],
              display: props?.lang?.correct_msg?.length > 0 ? "" : "none",
            }}
          >
            <Box>
              <Typography>
                <b>Explanation</b>
              </Typography>
            </Box>
            <Box>
              <Typography component="div">
                {props?.lang?.correct_msg}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
              padding: 2,
              marginY: 2,
              borderRadius: 1,
              backgroundColor: "transparent",
              boxShadow: theme?.shadows[1],
              display: props?.question?.different_incorrect_msg
                ? props?.lang?.incorrect_msg?.length > 0
                  ? ""
                  : "none"
                : props?.lang?.correct_msg?.length > 0
                ? ""
                : "none",
            }}
          >
            <Box>
              <Typography>
                <b>Explanation</b>
              </Typography>
            </Box>
            <Box>
              <Typography component="div">
                {props?.question?.different_incorrect_msg
                  ? props?.lang?.incorrect_msg
                  : props?.lang?.correct_msg}
              </Typography>
            </Box>
          </Box>
        )
      ) : (
        <></>
      )}
    </Box>
  );
};

export default HintAndMessageSection;
