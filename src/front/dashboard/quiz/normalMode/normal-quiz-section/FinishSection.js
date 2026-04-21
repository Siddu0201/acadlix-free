import { Alert, Box } from '@mui/material'
import React from 'react'
import CustomButton from '@acadlix/components/CustomButton';
import { __ } from '@wordpress/i18n';

const FinishSection = (props) => {
  const handleGoToFirstQuestion = () =>{
    props?.setValue("finish", false, { shouldDirty: true });
    let perPage = props?.watch("question_per_page");
    let question_number = 1;
    let page = Math.ceil(question_number / perPage);
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        switch (props?.watch("mode")) {
          case "normal":
          case "check_and_continue":
            if (index === 0) {
              question.selected = true;
            } else {
              question.selected = false;
            }
            break;
          case "question_below_each_other":
            if (perPage > 0) {
              if (index >= (page - 1) * perPage && index < page * perPage) {
                question.selected = true;
              } else {
                question.selected = false;
              }
            }
            break;
          default:
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("pagination_page", 1, { shouldDirty: true });
    props?.setValue("last", Date.now(), { shouldDirty: true });
  }

  const solved_count = props?.watch('questions').filter(d => d?.result?.solved_count)?.length;
  const total = props?.watch("questions").length;

  return (
    <Box sx={{
        display: props?.watch('finish') ? '' : "none",
        marginY: 2,
    }}>
      {
        props?.watch("force_user_to_answer_each_question") && solved_count !== total &&
        <Alert severity='error' sx={{ marginY: 2}}>
          {__("You can finish this quiz when you answer all questions", "acadlix")}
        </Alert>
      }
      <Box sx={{
        display: 'flex',
        gap: 2
      }}>
        <CustomButton
          onClick={handleGoToFirstQuestion}
          className="acadlix-normal-quiz-button-go-to-first-question"
        >
          {__("Go to First Question", "acadlix")}
        </CustomButton>
        <CustomButton
          disabled={props?.watch("force_user_to_answer_each_question") && solved_count !== total}
          onClick={props?.handleFinishQuiz}
          className="acadlix-normal-quiz-button-finish-quiz"
        >
          {__("Finish Quiz", "acadlix")}
        </CustomButton>
      </Box>
    </Box>
  )
}

export default FinishSection
