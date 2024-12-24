import { Box, Typography } from "@mui/material";
import React from "react";
import parse from "html-react-parser";

const CourseOverview = (props) => {
  return (
    <Box>
      <Typography component={"div"}>
        {parse(props?.watch("course_content"))}
      </Typography>
    </Box>
  );
};

export default CourseOverview;
