import { Box, Typography } from "@mui/material";
import React from "react";
import Latex from "react-latex-next";

const CourseOverview = (props) => {
  return (
    <Box>
      <Typography component={"div"}>
        <Latex>
          {props?.watch("course_content")}
        </Latex>
      </Typography>
    </Box>
  );
};

export default CourseOverview;
