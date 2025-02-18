import {
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import NtaTexture from "../../../../../../images/nta-texture.jpg";
import NtaInstructionLanguage from "./NtaInstructionLanguage";
import { __ } from "@wordpress/i18n";

const NtaGeneralInstructionLanguage = (props) => {
  return (
    <Box
      id="acadlix_nta_general_instruction_language"
      sx={{
        background: `url(${NtaTexture}) center center`,
        width: "100%",
        display: {
          md: "block",
          xs: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: {
            lg: "1170px",
            md: "900px",
            sm: "750px",
            xs: "100%",
          },
          marginX: "auto",
          paddingX: 6,
          paddingY: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1.28px",
              color: props?.colorCode?.instruction_general_instruction,
            }}
          >
            {__("GENERAL INSTRUCTION", "acadlix")}
          </Typography>
        </Box>
        {!props?.watch("finish") && (
          <Box>
            <Typography>{__("Choose Your Default Language", "acadlix")}</Typography>
            <NtaInstructionLanguage {...props} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NtaGeneralInstructionLanguage;
