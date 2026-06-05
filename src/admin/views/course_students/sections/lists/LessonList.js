import React from 'react'
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import {
  TiTick
} from '@acadlix/helpers/icons'
import { __ } from '@wordpress/i18n'

const LessonList = (props) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          paddingLeft: 4,
        }}
      >
        {__("Lessons", "acadlix")}
      </Typography>
      <Box>
        <List
          dense
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
        >
          {props?.student?.sections?.map((section) => {
            return section?.contents?.filter((content) => content?.contentable?.type === "lesson")?.map((lesson) => {
              return (
                <LessonItem
                  {...props}
                  key={lesson?.id}
                  lesson={lesson}
                />
              );
            })
          })}
        </List>
      </Box>
    </>
  )
}

export default LessonList


const LessonItem = (props) => {
  return (
    <ListItem
      key={props?.lesson?.contentable?.id}  
      disablePadding
    >
      <ListItemButton>
        <ListItemAvatar sx={{
          minWidth: 30,
        }}>
          <Avatar
            sx={{
              width: 20,
              height: 20,
              backgroundColor: props?.lesson?.is_completed ? `${props.watch("settings.lesson_color")}.main` : "grey.light",
              color: props?.lesson?.is_completed ? `${props.watch("settings.lesson_color")}.contrastText` : "grey.light",
            }}
          >
            {
              props?.lesson?.is_completed && (
                <TiTick />
              )
            }
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          id={props?.lesson?.contentable?.id}
          primary={props?.lesson?.contentable?.title}
        />
      </ListItemButton>
    </ListItem>
  )
}