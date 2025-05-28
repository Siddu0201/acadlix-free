import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import NtaTopHome from "../section/NtaTopHome";
import NtaLogo from "../section/NtaLogo";
import NtaGeneralInstructionLanguage from "./NtaGeneralInstructionLanguage";
import { __ } from "@wordpress/i18n";

import CustomLatex from "../../../../../../modules/latex/CustomLatex";

const NtaInstruction = (props) => {
  React.useEffect(() => {
    document.body.style.backgroundColor = props?.colorCode?.background;
  }, []);

  const handlelabelChange = (e) => {
    if(e?.target?.checked != undefined){
        props?.setValue("ready_to_begin", !props?.watch("ready_to_begin"), {shouldDirty: true});
    }
  }

  const handleProceed = (msg="") => {
    if(!props.watch("ready_to_begin")){
      alert(msg);
      return;
    }
    // handle Full screeen
    props?.handleFullScreen();
    props?.setValue("view_instruction1", false, { shouldDirty: true });
    props?.setValue("view_question", true, { shouldDirty: true });
    props?.setValue("last", Date.now(), { shouldDirty: true });
    props?.setValue("now", Date.now(), { shouldDirty: true });
    const subject_data = props
      ?.watch("questions")
      ?.reduce((acc, curr, index) => {
        const { subject_name, subject_id } = curr;
        const existingSubject = acc.find(
          (entry) => entry.subject_name === subject_name
        );
        if (!existingSubject) {
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
      }, []);
    props?.setValue("subjects", subject_data, { shouldDirty: true });

  };

  return (
    <Box>
      <NtaTopHome {...props} />
      <NtaLogo {...props} />
      <NtaGeneralInstructionLanguage {...props} />
      {
        props?.watch("language_data")?.length > 0 &&
        props?.watch("language_data")?.map((l, index) => (
          <Box
            key={index}
            sx={{
              display: l?.selected ? "" : "none",
              width: {
                lg: "1170px",
                md: "900px",
                sm: "750px",
                xs: "100%",
              },
              marginX: "auto",
              marginY: 4,
            }}
          >
            <CustomLatex>
              {l?.instruction1?.length > 0 ? l?.instruction1 : ""}
            </CustomLatex>
            <Box
              sx={{
                marginY: 4,
              }}
            >
              <FormControlLabel
                control={<Checkbox />}
                checked={props?.watch("ready_to_begin")}
                onChange={handlelabelChange}
                componentsProps={{
                  typography: {
                    variant: "body2",
                    sx: {
                      color: "black",
                    },
                  },
                }}
                label={l?.term_and_condition_text}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleProceed.bind(this, l?.term_and_condition_warning_text)}
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
                {__("PROCEED", "acadlix")}
              </Button>
            </Box>
          </Box>
        ))
      }
    </Box>
  );
};

export default NtaInstruction;
