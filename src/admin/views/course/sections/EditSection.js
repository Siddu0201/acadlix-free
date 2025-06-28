import { IconButton } from "@mui/material";
import React from "react";
import { FaEdit } from "@acadlix/helpers/icons";
import BootstrapDialog from "../modals/BootstrapDialog";
import AddEditSectionModal from "../modals/AddEditSectionModal";
import { useForm } from "react-hook-form";
import { UpdateSectionById } from "@acadlix/requests/admin/AdminCourseRequest";

const EditSection = (props) => {
  const methods = useForm({
    defaultValues: {
      id: null,
      post_title: "",
      post_content: "",
      show: false,
    },
  });

  const handleEditSection = () => {
    methods?.reset({
      id: props?.s?.id,
      post_title: props?.s?.post_title,
      post_content: props?.s?.post_content,
    });
    methods?.setValue("show", true, { shouldDirty: true });
  };

  const handleClose = () => {
    methods?.setValue("show", false, { shouldDirty: true });
  };

  const updateMutation = UpdateSectionById(methods?.watch("id"));
  const onSubmit = (data) => {
    updateMutation?.mutate(data, {
      onSuccess: (data) => {
        props?.setValue(
          "sections",
          props?.watch("sections")?.map((s, index) => {
            if (index === props?.id) {
              return {
                ...s,
                post_title: data?.data?.course_section?.post_title,
                post_content: data?.data?.course_section?.post_content,
              };
            }
            return s;
          })
        );
        handleClose();
      }
    })
  };

  return (
    <>
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
          isPending={updateMutation?.isPending}
          create={false}
        />
      </BootstrapDialog>
      <IconButton onClick={handleEditSection}>
        <FaEdit
          style={{
            fontSize: 14,
          }}
        />
      </IconButton>
    </>
  );
};

export default EditSection;
