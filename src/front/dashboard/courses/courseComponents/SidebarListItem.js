import {
  Box,
  Checkbox,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import ListItemResource from "./ListItemResource";
import { FaFile, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdQuiz } from "react-icons/md";

const SidebarListItem = (props) => {
  // console.log(props);
  return (
    <ListItem
      sx={{
        cursor: "pointer",
        bgcolor: props?.c?.is_active ? "#d1d7dc" : "initial",
        "&:hover": {
          bgcolor: "#d1d7dc",
        },
        paddingX: 1,
      }}
      onClick={props?.handleNavigate.bind(this, props?.c?.id)}
    >
      <Checkbox checked={props?.c?.is_completed} disableRipple disabled />
      <ListItemText
        primary={`${props?.c_num}. ${props?.c?.title}`}
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
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {props?.c?.type === "lesson" ? (
                  props?.c?.lesson_type === "video" ? (
                    <FaVideo
                      style={{
                        marginRight: 5,
                      }}
                    />
                  ) : (
                    <FaFile
                      style={{
                        marginRight: 5,
                      }}
                    />
                  )
                ) : (
                  <MdQuiz
                    style={{
                      marginRight: 5,
                    }}
                  />
                )}
                {`${props?.c?.duration} ${props?.c?.duration_type?.substr(0,3)}`}
              </Typography>
            </Box>
            {props?.c?.type === "lesson" &&
              props?.c?.lesson_resources?.length > 0 && (
                <ListItemResource {...props} />
              )}
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
