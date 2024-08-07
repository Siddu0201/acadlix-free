import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import TopBox from "./TopBox";
import SkyBlueBox from "./SkyBlueBox";
import MainArea from "./MainArea";
import BottomNavigation from "./BottomNavigation";
import UserSidebar from "./UserSidebar";

const Instruction1 = (props) => {
  const idList = [
    "acadlix_instruction_topbox",
    "acadlix_instruction_skybluebox",
    "acadlix_instruction1_button_options",
  ];
  const [remainingHeight, setRemainingHeight] = React.useState(0);
  React.useLayoutEffect(() => {
    let total = 0;
    idList.forEach((a, i) => {
      total += document.getElementById(a)?.clientHeight ?? 0;
    });
    setRemainingHeight(total);
  });

  return (
    <Box>
      <TopBox {...props} />
      <Box>
        <UserSidebar {...props} />
      </Box>
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: props?.instructionIsOpen
              ? `calc(100% - ${props?.sidebarWidth}px)`
              : "100%",
          },
        }}
      >
        <SkyBlueBox {...props} data="Instructions" />
        <MainArea {...props} remainingHeight={remainingHeight} instruction={props?.watch("instruction1")} />
        <BottomNavigation {...props} />
      </Box>
    </Box>
  );
};

export default Instruction1;
