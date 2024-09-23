import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import CustomTextField from "../../../../components/CustomTextField";

const AddEditSectionModal = (props) => {
  return (
    <form onSubmit={props?.handleSubmit(props?.onSubmit)}>
      <DialogTitle id="section-dialog-title" sx={{ m: 0, p: 2 }}>
        {props?.create ? "Add" : "Edit"} Section
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent
        sx={{
          padding: "1rem !important",
          backgroundColor: props?.colorCode?.modal_background,
        }}
      >
        <Grid container gap={2}>
          <Grid item xs={12} lg={12}>
            <Typography variant="h6">
              Section Title <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              {...props?.register("title", { required: "Title is required" })}
              fullWidth
              required
              name="title"
              size="small"
              value={props?.watch("title") ?? ""}
              onChange={(e) => {
                props?.setValue("title", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
              error={Boolean(props?.formState?.errors?.title)}
              helperText={props?.formState?.errors?.title?.message}
              inputProps={{
                sx: {
                  border: `0 !important`,
                  boxShadow: `none !important`,
                  minHeight: `auto !important`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Typography variant="h6">Section Description</Typography>
          </Grid>
          <Grid item xs={12} lg={12}>
            <textarea
              rows={3}
              style={{
                width: "100%",
                padding: "8.5px 14px",
              }}
              value={props?.watch("description")}
              onChange={(e) => {
                props?.setValue("description", e?.target?.value, {
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 2,
        }}
      >
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={props?.isPending}>
          {props?.isPending ? "...loading" : "Save Change"}
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddEditSectionModal;
