import { Box, Button } from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

const NtaSubmitButtonOptions = (props) => {
  const handleSubmit = () => {
    props?.setValue("finish", true, {shouldDirty: true});
  }

  return (
    <Box
      sx={{
        backgroundColor: props?.colorCode?.submit_background,
        display: "flex",
        justifyContent: "space-between",
        paddingX: 4,
        paddingY: 1,
        borderTop: `1px solid ${props?.colorCode?.submit_top_border}`,
        borderBottomRightRadius: 1,
        borderBottomLeftRadius: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          disabled={props?.first && props?.first_subject}
          onClick={props?.handleBack}
          sx={{
            marginY: `4px!important`,
            letterSpacing: "1.28px",
            borderRadius: 0,
            fontSize: 13,
            fontWeight: 700,
            paddingX: 3,
            paddingY: 3/2,
            boxShadow: "none",
            border: `1px solid ${props?.colorCode?.next_back_border}`,
            backgroundColor: props?.colorCode?.next_back_background,
            color: props?.colorCode?.next_back_color,
            ":hover, :focus": {
              border: `1px solid ${props?.colorCode?.next_back_hover_border}`,
              backgroundColor: props?.colorCode?.next_back_hover_background,
              color: props?.colorCode?.next_back_color,
              boxShadow: "none",
            },
          }}
        >
          {__('<< BACK', 'acadlix')}
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={props?.last && props?.last_subject}
          onClick={props?.handleNext}
          sx={{
            marginY: `4px!important`,
            letterSpacing: "1.28px",
            borderRadius: 0,
            fontSize: 13,
            fontWeight: 700,
            paddingX: 3,
            paddingY: 3/2,
            boxShadow: "none",
            border: `1px solid ${props?.colorCode?.next_back_border}`,
            backgroundColor: props?.colorCode?.next_back_background,
            color: props?.colorCode?.next_back_color,
            ":hover, :focus": {
              border: `1px solid ${props?.colorCode?.next_back_hover_border}`,
              backgroundColor: props?.colorCode?.next_back_hover_background,
              color: props?.colorCode?.next_back_color,
              boxShadow: "none",
            },
          }}
        >
          {__('NEXT >>', 'acadlix')}
        </Button>
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            marginY: `4px!important`,
            letterSpacing: "1.28px",
            borderRadius: 0,
            fontSize: 13,
            fontWeight: 700,
            paddingX: 3,
            paddingY: 3/2,
            boxShadow: "none",
            border: `1px solid ${props?.colorCode?.submit_button_border}`,
            backgroundColor: props?.colorCode?.submit_button_background,
            color: props?.colorCode?.submit_button_color,
            ":hover, :focus": {
              border: `1px solid ${props?.colorCode?.submit_button_hover_border}`,
              backgroundColor: props?.colorCode?.submit_button_hover_background,
              color: props?.colorCode?.submit_button_color,
              boxShadow: "none",
            },
          }}
        >
          {__('SUBMIT', 'acadlix')}
        </Button>
      </Box>
    </Box>
  );
};

export default NtaSubmitButtonOptions;
