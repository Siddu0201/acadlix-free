import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "../../../../../../helpers/icons";
import { __ } from "@wordpress/i18n";

const FinalSummaryModel = (props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const getData = (type = "", subject_id = 0) => {
    let answered = 0,
      not_answered = 0,
      not_visited = 0,
      marked_for_review = 0,
      answered_and_marked_for_review = 0;

    props
      ?.watch("questions")
      ?.filter((q) => q?.subject_id === subject_id)
      ?.forEach((question) => {
        if (question?.result?.solved_count && question?.review) {
          answered_and_marked_for_review++;
        } else if (!question?.result?.solved_count && question?.review) {
          marked_for_review++;
        } else if (question?.result?.solved_count && !question?.review) {
          answered++;
        } else if (question?.visit && !question?.result?.solved_count) {
          not_answered++;
        } else if (!question?.visit) {
          not_visited++;
        }
      });

    switch (type) {
      case "answered":
        return answered;
      case "not_answered":
        return not_answered;
      case "not_visited":
        return not_visited;
      case "marked_for_review":
        return marked_for_review;
      case "answered_and_marked_for_review":
        return answered_and_marked_for_review;
      default:
        return 0;
    }
  };

  return (
    <BootstrapDialog
      maxWidth={props?.isDesktop ? "lg" : "xs"}
      open={props?.open}
      onClose={props?.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {__("Summary", "acadlix")}
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
          <Typography>{__("Do you want to submit this test?", "acadlix")}</Typography>
          <Box>
            <TableContainer component={Paper}>
              <Table
                sx={{ width: "100%", margin: 0 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>{__("Name of the Section", "acadlix")}</TableCell>
                    <TableCell>{__("No. of Question", "acadlix")}</TableCell>
                    <TableCell>{__("Answered", "acadlix")}</TableCell>
                    <TableCell>{__("Not Answered", "acadlix")}</TableCell>
                    <TableCell>{__("Not Visited", "acadlix")}</TableCell>
                    <TableCell>{__("Marked for Review", "acadlix")}</TableCell>
                    <TableCell>{__("Answered and Marked for Review", "acadlix")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props?.watch("subjects")?.length > 0 &&
                    props?.watch("subjects")?.map((s, s_index) => (
                      <TableRow
                        key={s_index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {s?.subject_name?.toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {
                            props
                              ?.watch("questions")
                              ?.filter((q) => q?.subject_id === s?.subject_id)
                              ?.length
                          }
                        </TableCell>
                        <TableCell>
                          {getData("answered", s?.subject_id)}
                        </TableCell>
                        <TableCell>
                          {getData("not_answered", s?.subject_id)}
                        </TableCell>
                        <TableCell>
                          {getData("not_visited", s?.subject_id)}
                        </TableCell>
                        <TableCell>
                          {getData("marked_for_review", s?.subject_id)}
                        </TableCell>
                        <TableCell>
                          {getData(
                            "answered_and_marked_for_review",
                            s?.subject_id
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          {__('Cancel', 'acadlix')}
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => props?.handleSubmit(props?.s_index)}
        >
          {props?.submitText}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default FinalSummaryModel;
