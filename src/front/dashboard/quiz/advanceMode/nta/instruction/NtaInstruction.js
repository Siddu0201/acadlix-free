import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import NtaTopHome from "../section/NtaTopHome";
import NtaLogo from "../section/NtaLogo";
import NtaGeneralInstructionLanguage from "./NtaGeneralInstructionLanguage";

const NtaInstruction = (props) => {
  React.useEffect(() => {
    document.body.style.backgroundColor = props?.colorCode?.background;
  }, []);

  const handlelabelChange = (e) => {
    if(e?.target?.checked != undefined){
        props?.setValue("ready_to_begin", !props?.watch("ready_to_begin"), {shouldDirty: true});
    }
  }

  const handleProceed = () => {
    if(!props.watch("ready_to_begin")){
      alert('Please accept term and condition before proceeding.');
      return;
    }
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
      <Box
        sx={{
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
        {props?.watch("instruction1")}
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
            label="I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations."
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
