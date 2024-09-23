import { Box, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import BootstrapDialog from "../modals/BootstrapDialog";
import { FaPlus } from "react-icons/fa";
import AddQuizModel from "../modals/AddQuizModel";
import toast from "react-hot-toast";
import { PostAddQuiz } from "../../../../requests/admin/AdminCourseRequest";

const AddQuiz = (props) => {
  const methods = useForm({
    defaultValues: {
      course_id: null,
      quiz_ids: [],
      show: false,
    },
  });

  const handleAddQuiz = () => {
    methods?.reset({
      course_id: props?.watch("id"),
      quiz_ids: [],
      show: true,
    });
  };

  const handleClose = () => {
    methods?.setValue("show", false, { shouldDirty: true });
  };

  const addMutation = PostAddQuiz(props?.s?.id);
  const onSubmit = (data) => {
    if (data?.quiz_ids?.length > 0) {
      addMutation?.mutate(data, {
        onSuccess: (data) => {
          handleClose();
          props?.setValue(
            `sections.${props?.id}.contents`,
            data?.data?.section?.contents?.map((c) => {
              return {
                id: c?.id,
                sort: c?.sort,
                type:
                  c?.contentable_type === `Yuvayana\\Acadlix\\Models\\Quiz`
                    ? "quiz"
                    : "lesson",
                title: c?.contentable?.title,
                contentable_id: c?.contentable_id,
                course_section_id: c?.course_section_id,
              };
            })
          );
        },
      });
    } else {
      toast?.error("Please select atleast 1 quiz.");
    }
  };

  return (
    <Box>
      <BootstrapDialog
        open={methods?.watch("show")}
        onClose={handleClose}
        aria-labelledby="quiz-dialog-title"
        aria-describedby="quiz-dialog-description"
      >
        <AddQuizModel
          {...methods}
          colorCode={props?.colorCode}
          handleClose={handleClose}
          onSubmit={onSubmit}
          isPending={addMutation?.isPending}
          create={true}
        />
      </BootstrapDialog>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={handleAddQuiz}
      >
        <FaPlus
          style={{
            paddingRight: 4,
          }}
        />
        Add Quiz
      </Button>
    </Box>
  );
};

export default AddQuiz;
