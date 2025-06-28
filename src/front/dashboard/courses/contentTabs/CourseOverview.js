import { Box, Typography } from "@mui/material";
import React from "react";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const CourseOverview = (props) => {
  return (
    <Box>
      <Typography component={"div"}>
        <CustomLatex>
          {props?.watch("course_content")}
        </CustomLatex>
      </Typography>
    </Box>
  );
};

export default CourseOverview;
