import { Box, Button } from "@mui/material";
import React from "react";
import { FaPlus } from "@acadlix/helpers/icons";
import { useForm } from "react-hook-form";
import BootstrapDialog from "@acadlix/components/BootstrapDialog";
import AddEditSectionModal from "../modals/AddEditSectionModal";
import { PostCreateSection } from "@acadlix/requests/admin/AdminCourseRequest";
import { __ } from "@wordpress/i18n";

const AddSection = (props) => {
  const methods = useForm({
    defaultValues: {
      post_title: "",
      post_content: "",
      show: false,
    },
  });

  const handleAddSection = () => {
    methods?.setValue("show", true, { shouldDirty: true });
  };

  const handleClose = () => {
    methods?.setValue("show", false, { shouldDirty: true });
  };

  const createMutation = PostCreateSection();
  const onSubmit = (data) => {
    const newData = {
      ...data,
      courseId: props?.watch("courseId"),
      post_author: props?.watch("post_author"),
    };

    createMutation?.mutate(newData, {
      onSuccess: (data) => {
        props?.setValue(
          "sections",
          [
            ...props?.watch("sections"),
            {
              id: data?.data?.course_section?.ID,
              post_title: data?.data?.course_section?.post_title,
              post_content: data?.data?.course_section?.post_content,
              show: false,
              open: true,
              menu_order: data?.data?.course_section?.menu_order,
              contents: [],
            },
          ],
          { shouldDirty: true }
        );
        methods?.reset({
          post_title: "",
          post_content: "",
          show: false,
        });
      }
    })

  };

  return (
    <Box>
      <BootstrapDialog
        open={methods?.watch("show")}
        onClose={handleClose}
        aria-labelledby="section-dialog-title"
        aria-describedby="section-dialog-description"
      >
        <AddEditSectionModal
          {...methods}
          colorCode={props?.colorCode}
          handleClose={handleClose}
          onSubmit={onSubmit}
          isPending={createMutation?.isPending}
          create={true}
        />
      </BootstrapDialog>
      <Button variant="contained" color="primary" onClick={handleAddSection}>
        <FaPlus
          style={{
            paddingRight: 4,
          }}
        />
        {__("Add Section", "acadlix")}
      </Button>
    </Box>
  );
};

export default AddSection;
