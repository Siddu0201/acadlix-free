import { Box, Typography } from "@mui/material";
import React from "react";
import { FaUser } from "react-icons/fa";

const NtaTopHome = (props) => {
  return (
    <Box
    id="acadlix_nta_top_home"
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: props?.colorCode?.top_home_background,
      }}
    >
      <Box sx={{
        display: "flex",
        alignItems: "center",
        paddingRight: 25,
        gap: 2
      }}>
        <Box sx={{
          backgroundColor: props?.colorCode?.top_home_icon_background,
          padding: 1
        }}>
          <FaUser style={{ color: props?.colorCode?.top_home_icon_color}} />
        </Box>
        <Typography variant="body2" sx={{
          color: props?.colorCode?.top_home_text_color
        }}>Home</Typography>
      </Box>
    </Box>
  );
};

export default NtaTopHome;
