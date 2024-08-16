import { Box } from "@mui/material";
import React from "react";
import AcadlixLogo from "../../../../../../images/acadlix_logo.png";

const NtaLogo = (props) => {
  return (
    <Box
      id="acadlix_nta_logo"
      sx={{
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: props?.colorCode?.logo_background
      }}
    >
      <Box
        component="img"
        src={AcadlixLogo}
        sx={{
          height: "40px",
        }}
      />
    </Box>
  );
};

export default NtaLogo;
