import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled, Typography } from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";

const SubjectSummaryModel = (props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  return (
    <BootstrapDialog
      open={props?.open}
      onClose={props?.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        Sectional Summary
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
      <DialogContent>
        <Box>
            <Typography>Do you want to submit this section?</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
        >
          Submit Section
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default SubjectSummaryModel;
