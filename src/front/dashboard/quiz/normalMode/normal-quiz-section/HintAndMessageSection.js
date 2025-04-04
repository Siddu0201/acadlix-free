import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

import CustomLatex from "../../../../../modules/latex/CustomLatex";

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
            <b>{__('Hint', 'acadlix')}</b>
          </Typography>
        </Box>
        <Box>
          <Typography component="div">
            <CustomLatex>
              {props?.lang?.hint_msg}
            </CustomLatex>
          </Typography>
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
                <b>{__('Explanation', 'acadlix')}</b>
              </Typography>
            </Box>
            <Box>
              <Typography component="div">
                <CustomLatex>
                  {props?.lang?.correct_msg}
                </CustomLatex>
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
                <b>{__('Explanation', 'acadlix')}</b>
              </Typography>
            </Box>
            <Box>
              <Typography component="div">
                <CustomLatex>
                  {props?.question?.different_incorrect_msg
                    ? props?.lang?.incorrect_msg
                    : props?.lang?.correct_msg}
                </CustomLatex>
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
