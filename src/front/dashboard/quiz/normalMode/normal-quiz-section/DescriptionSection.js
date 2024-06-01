import { Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const DescriptionSection = (props) => {
  return (
    <Box>
      <Typography
        variant="h1"
        sx={{
          fontSize: "2rem",
          fontWeight: "550", // Adjust the font weight to match your original styling
          marginBottom: "1.5rem",
        }}
      >
        {props?.watch('title')}
      </Typography>

      <Typography variant="body1" sx={{ marginY: "9px" }}>
        {props?.watch('description')}
      </Typography>
      <CustomButton onClick={() => {
        if(props?.watch('mode') === 'advance_mode'){
          const link = `${acadlixOptions?.advance_quiz_url}#/advance-quiz/${props?.watch('id')}`
          window.open(link, "_blank",`scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes,width=${screen.width},height=${screen.height}`);
        }else{
          props?.setValue('start', true, {shouldDirty: true});
          props?.setValue('view_question', true, {shouldDirty: true});
          props?.setValue('last', Date.now(), {shouldDirty: true});
          props?.setValue('now', Date.now(), {shouldDirty: true});
        }
      }}>Start Quiz</CustomButton>
    </Box>
  );
};

export default DescriptionSection;
