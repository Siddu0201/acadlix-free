import React from 'react'
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  LuFileChartColumn,
  TiTick
} from '@acadlix/helpers/icons'
import { __ } from '@wordpress/i18n'
import BootstrapDialog from '@acadlix/components/BootstrapDialog'
import QuizModal from '../../modals/QuizModal'
import { hasCapability } from '@acadlix/helpers/util'

const QuizList = (props) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          paddingLeft: 4,
        }}
      >
        {__("Quizzes", "acadlix")}
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
            return section?.contents?.filter((content) => content?.contentable?.type === "quiz")?.map((quiz) => {
              return (
                <QuizItem
                  {...props}
                  key={quiz?.id}
                  quiz={quiz}
                />
              );
            })
          })}
        </List>
      </Box>
    </>
  )
}

export default QuizList

const QuizItem = (props) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };
  return (
    <>
      <BootstrapDialog
        md='70%'
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="quiz-dialog-title"
        aria-describedby="quiz-dialog-description"
      >
        <QuizModal
          {...props}
          handleClose={handleClose}
        />
      </BootstrapDialog>
      <ListItem
        key={props?.quiz?.contentable?.id}
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
                backgroundColor: props?.quiz?.is_completed ? `${props.watch("settings.quiz_color")}.main` : "grey.light",
                color: props?.quiz?.is_completed ? `${props.watch("settings.quiz_color")}.contrastText` : "grey.light",
              }}
            >
              {
                props?.quiz?.is_completed ? (
                  <TiTick />
                ) : null
              }
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id={props?.quiz?.contentable?.id}
            primary={props?.quiz?.contentable?.title}
          />
        </ListItemButton>
        {
          hasCapability("acadlix_view_student_quiz_answersheet") && (props?.quiz?.is_completed ? (
            <Tooltip
              title={__("View Result", "acadlix")}
            >
              <IconButton
                aria-label="result"
                size="small"
                color={props.watch("settings.quiz_color")}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
              >
                <LuFileChartColumn />
              </IconButton>
            </Tooltip>
          ) : null
          )
        }
      </ListItem>
    </>
  )
}