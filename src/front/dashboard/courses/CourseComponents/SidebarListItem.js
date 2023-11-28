import { Box, Checkbox, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import ListItemResource from "./ListItemResource";
import { FaVideo } from "react-icons/fa";

const SidebarListItem = () => {
  return (
    <ListItem
      sx={{
        cursor: "pointer",
        "&:hover": {
          bgcolor: "#d1d7dc",
        },
        paddingX: 1,
      }}
    >
      <Checkbox checked disableRipple />
      <ListItemText
        primary="1. Getting Started"
        secondary={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaVideo style={{
                   paddingRight: 5 
                }} />   
                9min
              </Typography>
            </Box>
            <ListItemResource />
          </Box>
        }
        primaryTypographyProps={{
          sx: {
            fontWeight: 600,
          },
        }}
        secondaryTypographyProps={{
          component: "div",
        }}
      />
    </ListItem>
  );
};

export default SidebarListItem;
