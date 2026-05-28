import {
  FaExternalLinkAlt,
  IoClose,
  IoIosArrowDown,
  IoIosArrowUp,
  TiTick
} from '@acadlix/helpers/icons'
import {
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  Avatar,
  Tooltip
} from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { __ } from '@wordpress/i18n'
import {
  getFormatDate,
  getStripHtml,
  secondsToHms
} from '@acadlix/helpers/util'
import Loader from '@acadlix/components/Loader'
import { GetStudentQuizResult } from '@acadlix/requests/admin/AdminStudentRequest'

const QuizModal = (props) => {
  const methods = useForm({
    defaultValues: {
      statistics: [],
    },
  });

  const { isFetching, data } = GetStudentQuizResult(
    props?.student?.id,
    props?.quiz?.contentable?.id,
    props?.quiz?.id
  );

  React.useEffect(() => {
    if (data?.data?.statistics?.length > 0) {
      methods.setValue("statistics",
        data?.data?.statistics?.map((item) => ({
          id: item?.id,
          quiz_id: item?.quiz_id,
          created_at: getFormatDate(item?.created_at),
          result: item?.result,
          points: item?.points,
          quiz_time: item?.quiz_time,
          accuracy: item?.accuracy,
          stats: item?.statistics?.map((stat) => ({
            question: stat?.question?.title ?
              stat?.question?.title :
              getStripHtml(
                stat?.question?.question_languages
                  ?.filter((d) => d?.default)?.[0]
                  ?.question.substring(0, 50)
              ),
            solved_count: stat?.solved_count,
            correct_count: stat?.correct_count,
            incorrect_count: stat?.incorrect_count,
            points: stat?.points,
            negative_points: stat?.negative_points,
            question_time: stat?.question_time,
          })),
        })),
        {
          shouldDirty: true,
        });
    }
  }, [data?.data]);
  return (
    <>
      <DialogTitle
        id="quiz-dialog-title"
        sx={{
          m: 0,
          p: 2,
          backgroundColor: `${props?.watch("settings.quiz_color")}.main`,
          color: `${props?.watch("settings.quiz_color")}.contrastText`,
        }}
      >
        {props?.quiz?.contentable?.title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: `${props?.watch("settings.quiz_color")}.contrastText`,
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent
        sx={{
          padding: "1rem !important",
          maxHeight: {
            xs: "450px",
            sm: "350px",
          },
          overflowY: "auto",
        }}
      >
        {
          isFetching ? <Loader /> : (
            <Box>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}>
                <Avatar sx={{
                  backgroundColor: "success.main",
                  color: "success.contrastText",
                  height: 20,
                  width: 20,
                }}>
                  <TiTick />
                </Avatar>
                <Typography variant="subtitle2">
                  {__("Correct", "acadlix")}
                </Typography>
                <Avatar sx={{
                  backgroundColor: "error.main",
                  color: "error.contrastText",
                  height: 20,
                  width: 20,
                }}>
                  <IoClose />
                </Avatar>
                <Typography variant="subtitle2">
                  {__("Incorrect", "acadlix")}
                </Typography>
                <Avatar sx={{
                  backgroundColor: "grey.main",
                  color: "grey.main",
                  height: 20,
                  width: 20,
                }}>
                </Avatar>
                <Typography variant="subtitle2">
                  {__("Skipped", "acadlix")}
                </Typography>
              </Box>
              <TableContainer>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell align="left">{__("Started at", "acadlix")}</TableCell>
                      <TableCell>{__("Result", "acadlix")}</TableCell>
                      <TableCell>{__("Points", "acadlix")}</TableCell>
                      <TableCell>{__("Quiz Time", "acadlix")}</TableCell>
                      <TableCell>{__("Accuracy", "acadlix")}</TableCell>
                      {/* <TableCell>{__("Action", "acadlix")}</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      methods?.watch("statistics")?.length > 0 ? (
                        methods?.watch("statistics")?.map((item, index) => (
                          <StatisticList
                            {...props}
                            key={index}
                            item={item}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Typography variant="subtitle2">
                              {
                                props?.quiz?.is_statistics_enabled ?
                                  __("No data found", "acadlix") :
                                  __("Statistics is disabled", "acadlix")
                              }
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color={props?.watch("settings.quiz_color")}
          onClick={props?.handleClose}
        >
          {__("Close", "acadlix")}
        </Button>
      </DialogActions>
    </>
  )
}

export default QuizModal

const StatisticList = (props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          // '&:nth-of-type(4n+1)': {
          //     backgroundColor: (theme) => theme.palette.action.hover,
          // },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
          // onClick={() => setOpen(!open)}
          >
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="h6">
            {props?.item?.created_at}
          </Typography>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="subtitle2">
            {props?.item?.result?.toFixed(2)}%
          </Typography>
        </TableCell>
        <TableCell>
          {props?.item?.points}
        </TableCell>
        <TableCell>
          {secondsToHms(props?.item?.quiz_time)}
        </TableCell>
        <TableCell>
          {props?.item?.accuracy?.toFixed(2)}%
        </TableCell>
        {/* <TableCell>
          <Tooltip title={__("View Answersheet", "acadlix")}>
            <IconButton
              size="small"
              color={props?.watch("settings.quiz_color")}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`${acadlixOptions.acadlix_quiz_url}#/${props?.item?.quiz_id}/result/${props?.item?.id}`, '_blank');
              }}
            >
              <FaExternalLinkAlt />
            </IconButton>
          </Tooltip>
        </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{__("Question", "acadlix")}</TableCell>
                    <TableCell>{__("Status", "acadlix")}</TableCell>
                    <TableCell>{__("Time", "acadlix")}</TableCell>
                    <TableCell>{__("Points", "acadlix")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    props?.item?.stats?.map((stat, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: (theme) => theme.palette.action.hover,
                          },
                          // hide last border
                          '&:last-child td, &:last-child th': {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell>{stat?.question}</TableCell>
                        <TableCell>
                          {stat?.solved_count ?
                            stat?.correct_count ?
                              (
                                <Avatar sx={{
                                  backgroundColor: "success.main",
                                  color: "success.contrastText",
                                  height: 20,
                                  width: 20,
                                }}>
                                  <TiTick />
                                </Avatar>
                              ) : (
                                <Avatar sx={{
                                  backgroundColor: "error.main",
                                  color: "error.contrastText",
                                  height: 20,
                                  width: 20,
                                }}>
                                  <IoClose />
                                </Avatar>
                              )
                            :
                            (
                              <Avatar sx={{
                                backgroundColor: "grey.main",
                                color: "grey.main",
                                height: 20,
                                width: 20,
                              }}>
                              </Avatar>
                            )
                          }
                        </TableCell>
                        <TableCell>{secondsToHms(stat?.question_time)}</TableCell>
                        <TableCell>
                          {stat?.solved_count ?
                            stat?.correct_count ?
                              stat?.points :
                              `${stat?.negative_points > 0 ? "-" : ""}${stat?.negative_points}` :
                            0}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}