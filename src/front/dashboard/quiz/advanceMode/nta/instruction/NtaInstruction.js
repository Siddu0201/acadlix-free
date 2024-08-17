import { Box, Button } from "@mui/material";
import React from "react";
import NtaTopHome from "../section/NtaTopHome";
import NtaLogo from "../section/NtaLogo";
import NtaGeneralInstructionLanguage from "./NtaGeneralInstructionLanguage";

const NtaInstruction = (props) => {
  React.useEffect(() => {
    document.body.style.backgroundColor = props?.colorCode?.background;
  }, []);

  const handleProceed = () => {
    props?.setValue("view_instruction1", false, {shouldDirty: true});
    props?.setValue("view_question", true, {shouldDirty: true});
    props?.setValue("last", Date.now(), { shouldDirty: true });
    props?.setValue("now", Date.now(), { shouldDirty: true });
    const subject_data = props?.watch("questions")?.reduce((acc, curr, index) => {
      const {subject_name, subject_id} = curr;
      const existingSubject = acc.find(entry => entry.subject_name === subject_name);
      if(!existingSubject){
        acc.push({
          subject_name: subject_name,
          subject_id: subject_id,
          selected: index === 0,
          model: false,
          submitModel: false,
          submitted: false,
        });
      }
      return acc;
    },[]);
    props?.setValue("subjects", subject_data, {shouldDirty: true});
  }

  return (
    <Box>
      <NtaTopHome {...props} />
      <NtaLogo {...props} />
      <NtaGeneralInstructionLanguage {...props} />
      <Box
        sx={{
          width: {
            lg: "1170px",
            md: "900px",
            sm: "750px",
            xs: "100%",
          },
          marginX: "auto",
          marginY: 2,
        }}
      >
        {props?.watch("instruction1")}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleProceed}
            sx={{
              fontWeight: "bold",
              letterSpacing: "1.28px",
              borderRadius: 0,
              paddingX: 8,
              border: `1px solid ${props?.colorCode?.instruction_button_border}`,
              backgroundColor: props?.colorCode?.instruction_button_background,
              color: props?.colorCode?.instruction_button_color,
              ":hover, :focus": {
                border: `1px solid ${props?.colorCode?.instruction_button_hover_border}`,
                backgroundColor:
                  props?.colorCode?.instruction_button_hover_background,
                color: props?.colorCode?.instruction_button_color,
                boxShadow: "none",
              },
            }}
          >
            PROCEED
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NtaInstruction;
