import { Box, Button, Dialog, styled } from "@mui/material";
import React from "react";
import { FaPlus } from "../../../../helpers/icons";
import { useForm } from "react-hook-form";
import BootstrapDialog from "../modals/BootstrapDialog";
import AddEditSectionModal from "../modals/AddEditSectionModal";
import { PostCreateSection } from "../../../../requests/admin/AdminCourseRequest";

const AddSection = (props) => {
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
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
      id: props?.watch("id"),
      logged_in_user_id: props?.watch("logged_in_user_id"),
    };

    createMutation?.mutate(newData, {
      onSuccess: (data) => {
        props?.setValue(
          "sections",
          [
            ...props?.watch("sections"),
            {
              id: data?.data?.section?.id,
              title: data?.data?.section?.title,
              description: data?.data?.section?.description,
              show: false,
              open: true,
              sort: data?.data?.section?.sort,
              contents: [],
            },
          ],
          { shouldDirty: true }
        );
        methods?.reset({
          title: "",
          description: "",
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
        Add Section
      </Button>
    </Box>
  );
};

export default AddSection;
