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
import { secondsToHms } from "../../../../../helpers/util";

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
    ?.map((d) => d?.subject_name);
  
  return (
    <Box>
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
                Subject
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                Correct
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                Incorrect
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                Skipped
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                Time
              </TableCell>
              <TableCell
                sx={{ fontWeight: "700", border: "2px solid black" }}
                align="center"
              >
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ backgroundColor: "#f4f0e2", border: "2px solid black" }}
                >
                  {row}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {props?.watch('questions').filter(d => d?.subject_name === row && d?.result?.correct_count)?.length}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {props?.watch('questions').filter(d => d?.subject_name === row && d?.result?.solved_count && d?.result?.incorrect_count)?.length}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {props?.watch('questions').filter(d => d?.subject_name === row && !d?.result?.solved_count)?.length}
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                 {
                  secondsToHms(
                    props?.watch('questions').filter(d => d?.subject_name === row)
                    ?.reduce((total, d) => total + d?.result?.time , 0)
                  )
                 }
                </TableCell>
                <TableCell align="center" sx={{ border: "2px solid black" }}>
                  {
                    props?.watch('questions').filter(d => d?.subject_name === row)
                    ?.reduce((total, d) => {
                      if(d?.result?.solved_count && d?.result?.correct_count){
                        return total + d?.points;
                      }else if(d?.result?.solved_count && d?.result?.incorrect_count){
                        return total - d?.negative_points;
                      }else{
                        return total;
                      }
                    }, 0)
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
