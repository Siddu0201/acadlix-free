import {
  Box,
  Checkbox,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import ListItemResource from "./ListItemResource";
import { FaFile, FaVideo, MdQuiz } from "@acadlix/helpers/icons";

const SidebarListItem = (props) => {
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
      id={`acadlix_course_listitem_${props?.c?.id}`}
      onClick={props?.handleNavigate.bind(this, props?.c?.id)}
    >
      <Checkbox
        checked={props?.c?.is_completed}
        disableRipple
        disabled={!props?.c?.is_completed}
        onClick={(e) => {
          e?.stopPropagation();
          props?.handleIncomplete(props?.c?.id, props?.index, props?.c_index);
        }}
      />
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
                {props?.c?.lesson_type === "video" &&
                props?.c?.type === "lesson"
                  ? `${props?.c?.hours}:${props?.c?.minutes}:${props?.c?.seconds}`
                  : "1 min"}
              </Typography>
            </Box>
            {(props?.c?.type === "lesson") &&
              props?.c?.resources?.length > 0 && (
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
