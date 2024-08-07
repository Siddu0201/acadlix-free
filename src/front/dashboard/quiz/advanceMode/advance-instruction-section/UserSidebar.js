import { Box, Drawer, Typography } from "@mui/material";
import React from "react";

const UserSidebar = (props) => {
  const [remainingTop, setRemainingTop] = React.useState(0);

  React.useLayoutEffect(() => {
    let top = 0;
    if (acadlixOptions?.is_admin_bar_showing) {
      top += props?.isDesktop ? 32 : 46;
    }
    top +=
      document.getElementById("acadlix_instruction_topbox")?.clientHeight ?? 0;
    setRemainingTop(top);
  });

  return (
    <Box>
      <Drawer
        sx={{
          width: props?.instructionIsOpen ? props?.sidebarWidth : "0px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: props?.instructionIsOpen ? props?.sidebarWidth : "0px",
            top: remainingTop,
          },
        }}
        anchor="right"
        open={true}
        variant="persistent"
        PaperProps={{
          id: "acadlix_instruction_sidebar",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxBAajPWP4iR49fzZKj0yYDEtTmkxmf84eWsU9wTgSYA&s"
            alt=""
          />
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {props?.watch("name")}
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UserSidebar;
