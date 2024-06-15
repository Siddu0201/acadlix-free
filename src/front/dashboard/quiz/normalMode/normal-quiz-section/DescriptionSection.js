import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../normal-quiz-component/CustomButton";

const DescriptionSection = (props) => {
  const current_date = new Date();
  const ExpireDate = () => <Alert severity="error">Quiz has expired</Alert>;

  if (
    props?.watch("set_start_date") &&
    current_date < props?.watch("start_date")
  ) {
    return <NotStarted {...props} />;
  }

  if (props?.watch("set_end_date") && current_date > props?.watch("end_date")) {
    return <ExpireDate />;
  }

  return (
    <Box>
      {!props?.watch("hide_quiz_title") && (
        <Typography
          variant="h1"
          sx={{
            fontSize: "2rem",
            fontWeight: "550", // Adjust the font weight to match your original styling
            marginBottom: "1.5rem",
          }}
        >
          {props?.watch("title")}
        </Typography>
      )}

      <Typography variant="body1" sx={{ marginY: "9px" }}>
        {props?.watch("description")}
      </Typography>
      <CustomButton
        onClick={() => {
          if (props?.watch("mode") === "advance_mode") {
            const link = `${
              acadlixOptions?.advance_quiz_url
            }#/advance-quiz/${props?.watch("id")}`;
            window.open(
              link,
              "_blank",
              `scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes,width=${screen.width},height=${screen.height}`
            );
          } else {
            props?.setValue("start", true, { shouldDirty: true });
            props?.setValue("view_question", true, { shouldDirty: true });
            props?.setValue("last", Date.now(), { shouldDirty: true });
            props?.setValue("now", Date.now(), { shouldDirty: true });
          }
        }}
      >
        Start Quiz
      </CustomButton>
    </Box>
  );
};

const NotStarted = (props) => {
  return (
    <Alert severity="error">{
      `Quiz will start on ${props?.watch("start_date")} `
    }</Alert>
  )
}

export default DescriptionSection;
