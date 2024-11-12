import * as React from "react";
import { Box } from "@mui/material";
import SidebarList from "../courseComponents/SidebarList";

const CourseSidebar = (props) => {
  return (
    <Box>
      {props?.watch("sections")?.length > 0 &&
        props
          ?.watch("sections")
          ?.map((s, index, arr) => (
            <SidebarList
              key={index}
              index={index}
              num={index + 1}
              first={index === 0}
              last={arr?.length-1 === index}
              s={s}
              {...props}
            />
          ))}
    </Box>
  );
};

export default CourseSidebar;
