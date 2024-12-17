import { Box } from "@mui/material";
import React from "react";
import TopBox from "./TopBox";
import UserSidebar from "./UserSidebar";
import SkyBlueBox from "./SkyBlueBox";
import MainArea from "./MainArea";
import BottomNavigation2 from "./BottomNavigation2";

const Instruction2 = (props) => {
  const idList = [
    "acadlix_instruction_topbox",
    "acadlix_instruction_skybluebox",
    "acadlix_instruction2_button_options",
  ];
  const [remainingHeight, setRemainingHeight] = React.useState(0);
  React.useLayoutEffect(() => {
    let total = 0;
    idList.forEach((a, i) => {
      total += document.getElementById(a)?.clientHeight ?? 0;
    });
    // if (acadlixOptions?.is_admin_bar_showing) {
    //   total += props?.isDesktop ? 32 : 46;
    // }
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
        {props?.watch("languages")?.length > 0 &&
          props?.watch("languages")?.map((l, index) => (
            <React.Fragment key={index}>
              <MainArea
                {...props}
                language={l}
                remainingHeight={remainingHeight}
                instruction={l?.instruction2}
              />
            </React.Fragment>
          ))}
        <BottomNavigation2 {...props} />
      </Box>
    </Box>
  );
};

export default Instruction2;
