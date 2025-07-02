import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { secondsToHms } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const SubjectResultSection = (props) => {
  const subjects = props
    ?.watch("questions")
    .filter((obj, index, arr) => {
      return (
        arr.findIndex((o) => {
          return (
            JSON.stringify(o?.subject_name) ===
            JSON.stringify(obj?.subject_name)
          );
        }) === index
      );
    })
    // ?.map((d) => d?.subject_name);
  
  return (
    <Box sx={{
      marginY: 1
    }}>
      <TableContainer
        sx={{ maxWidth: 1200, margin: "0px auto" }}
        component={Paper}
      >
        <Table
          sx={{ maxWidth: 1200, margin: "0px auto" }}
          aria-label="simple table"
        >
          <TableHead
            align="center"
            sx={{ backgroundColor: "#fec901", border: "2px solid black" }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "700", border: "2px solid black" }}>
                {__("Subject", "acadlix")}
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                {__("Correct", "acadlix")}
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                {__("Incorrect", "acadlix")}
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                {__("Skipped", "acadlix")}
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                {__("Time", "acadlix")}
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                {__("Score", "acadlix")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ backgroundColor: "#f4f0e2", border: "2px solid black" }}
                >
                  {subject?.subject_name}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {props?.getCorrectCountBySubjectId(subject?.subject_id)}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {props?.getIncorrectCountBySubjectId(subject?.subject_id)}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {props?.getSkippedCountBySubjectId(subject?.subject_id)}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                 {
                  secondsToHms(
                    props?.getTimeBySubjectId(subject?.subject_id)
                  )
                 }
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {
                    props?.getPointsBySubjectId(subject?.subject_id)?.toFixed(2)
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubjectResultSection;
