import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { __ } from "@wordpress/i18n";

const NtaFinish = (props) => {
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

  const handleYes = () => {
    props?.setValue(
      "subjects",
      props?.watch("subjects")?.map((s) => {
        if (s.selected) {
          s.selected = false;
        }
        return s;
      })
    );
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (question.selected) {
          question.result.time =
            question.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("finish", false, { shouldDirty: true });
    props?.setValue("view_question", false, { shouldDirty: true });
    props?.setValue("view_result", true, { shouldDirty: true });
    props?.saveResult();
  };

  const handleNo = () => {
    props?.setValue("finish", false, { shouldDirty: true });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingY: 4,
      }}
    >
      <Box
        sx={{
          paddingY: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          {__("Exam Summary", "acadlix")}
        </Typography>
      </Box>
      <Box>
        <TableContainer>
          <Table sx={{ width: "100%", margin: 0 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{__("Name of the Section", "acadlix")}</TableCell>
                <TableCell>{__("No. of Question", "acadlix")}</TableCell>
                <TableCell>{__("Answered", "acadlix")}</TableCell>
                <TableCell>{__("Not Answered", "acadlix")}</TableCell>
                <TableCell>{__("Marked for Review", "acadlix")}</TableCell>
                <TableCell>{__("Answered and Marked for Review", "acadlix")}</TableCell>
                <TableCell>{__("Not Visited", "acadlix")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props?.watch("subjects")?.length > 0 &&
                props?.watch("subjects")?.map((s, s_index) => (
                  <TableRow
                    key={s_index}
                  >
                    <TableCell component="td" scope="row">
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
                    <TableCell>{getData("answered", s?.subject_id)}</TableCell>
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
                      {getData("answered_and_marked_for_review", s?.subject_id)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingY: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          {__("Are you sure you want to submit for final marking?", "acadlix")}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          {__("No changes will be allowed after submission.", "acadlix")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          varinat="outlined"
          onClick={handleYes}
          sx={{
            borderRadius: 0,
            border: `1px solid ${props?.colorCode?.final_button_border}`,
            backgroundColor: props?.colorCode?.final_button_background,
            color: props?.colorCode?.final_button_color,
            ":hover, :focus": {
              border: `1px solid ${props?.colorCode?.final_button_hover_border}`,
              backgroundColor: props?.colorCode?.final_button_hover_background,
              color: props?.colorCode?.final_button_color,
              boxShadow: "none",
            },
          }}
        >
          {__("YES", "acadlix")}
        </Button>
        <Button
          varinat="outlined"
          onClick={handleNo}
          sx={{
            borderRadius: 0,
            border: `1px solid ${props?.colorCode?.final_button_border}`,
            backgroundColor: props?.colorCode?.final_button_background,
            color: props?.colorCode?.final_button_color,
            ":hover, :focus": {
              border: `1px solid ${props?.colorCode?.final_button_hover_border}`,
              backgroundColor: props?.colorCode?.final_button_hover_background,
              color: props?.colorCode?.final_button_color,
              boxShadow: "none",
            },
          }}
        >
          {__("NO", "acadlix")}
        </Button>
      </Box>
    </Box>
  );
};

export default NtaFinish;
