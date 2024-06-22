import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React from "react";
import TickImage from "../../../../../images/icons8-correct-96.png";
import ClockImage from "../../../../../images/clock-svgrepo-com.png";
import AccuracyImage from "../../../../../images/percentage-discount-svgrepo-com.svg";
import Rank from "../../../../../images/cup-award-svgrepo-com.svg";
import Percentile from "../../../../../images/percentage-percent-svgrepo-com.svg";
import Speed from "../../../../../images/speed-svgrepo-com.svg";
import Pass from "../../../../../images/grinning-face-svgrepo-com.svg";
import Fail from "../../../../../images/sad-but-relieved-face-svgrepo-com.svg";
import Negative from "../../../../../images/wrong-way-svgrepo-com.svg";
import Average from "../../../../../images/bars-graph-svgrepo-com.svg";
import QuestionReportChart from "./charts/QuestionReportChart";
import ScoreChart from "./charts/ScoreChart";
import { secondsToHms } from "../../../../../helpers/util";

const ResultSection = (props) => {
  const result = props?.watch("questions")?.reduce((total, d) => {
    if (d?.result?.solved_count && d?.result?.correct_count) {
      return total + Number(d?.points);
    } else if (d?.result?.solved_count && d?.result?.incorrect_count) {
      return total - Number(d?.negative_points);
    } else {
      return total;
    }
  }, 0);
  const negative_marks = props?.watch("questions")?.reduce((total, d) => {
    if (d?.result?.solved_count && d?.result?.incorrect_count) {
      return total + Number(d?.negative_points);
    }
    return total;
  }, 0);
  const total = props
    ?.watch("questions")
    ?.reduce((total, d) => total + Number(d?.points), 0);
  const percent = (result / total) * 100;
  const solvedCount = props
    ?.watch("questions")
    ?.filter((d) => d?.result?.solved_count)?.length;
  const time =
    props
      ?.watch("questions")
      .reduce((total, d) => total + d?.result?.time, 0) ?? 0;
  const accuracy =
    props?.watch("questions")?.filter((d) => d?.result?.solved_count)?.length >
    0
      ? (
          (props?.watch("questions")?.filter((d) => d?.result?.correct_count)
            ?.length /
            props?.watch("questions")?.filter((d) => d?.result?.solved_count)
              ?.length) *
          100
        )?.toFixed(2)
      : 0;

  return (
    <Box
      sx={{
        marginY: 1,
      }}
    >
      <Typography
        sx={{
          color: "#fa7419",
          fontWeight: "500",
          fontSize: 24,
        }}
      >
        You have Completed "
        <Typography
          component="span"
          sx={{
            color: "#64B335",
            fontWeight: "500",
            fontSize: 24,
          }}
        >
          {props?.watch("title")}
        </Typography>
        "
      </Typography>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px auto",
        }}
        rowGap={2}
      >
        <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={TickImage} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {result}/{total}
            </Typography>
            <Typography variant="h7">Marks Obtained</Typography>
          </Box>
        </Grid>
        {!props?.watch("hide_negative_marks") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Negative} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {`-${negative_marks}`}
              </Typography>
              <Typography variant="h7">Negative Marks</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_average_score") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Average} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {props?.isPending
                  ? "loading..."
                  : props?.watch("average_score")}
              </Typography>
              <Typography variant="h7">Average Score</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_status_based_on_min_percent") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src={
                  percent > props?.watch("minimum_percent_to_pass")
                    ? Pass
                    : Fail
                }
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {percent > props?.watch("minimum_percent_to_pass")
                  ? "Pass"
                  : "Fail"}
              </Typography>
              <Typography variant="h7">Status</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_accuracy") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={AccuracyImage} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {`${accuracy}%`}
              </Typography>
              <Typography variant="h7">Accuracy</Typography>
            </Box>
          </Grid>
        )}
        {!props?.watch("hide_quiz_time") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={ClockImage} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {secondsToHms(time)}
              </Typography>
              <Typography variant="h7">Time Taken</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_rank") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Rank} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {props?.isPending ? "loading..." : props?.watch("rank")}
              </Typography>
              <Typography variant="h7">Rank</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_percentile") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Percentile} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {props?.isPending ? "loading..." : props?.watch("percentile")}
              </Typography>
              <Typography variant="h7">Percentile</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_speed") && (
          <Grid item xs={6} sm={4} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Speed} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {isNaN(solvedCount / (time / 60))
                  ? 0
                  : (solvedCount / (time / 60)).toFixed(2)}{" "}
                Q/min
              </Typography>
              <Typography variant="h7">Speed</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      {props?.watch("result_comparision_with_topper") && (
        <Grid container>
          <Grid item xs={12} sm={5}>
            <Card>
              <CardHeader title="Your Result" />
              <Divider />
              {props?.isPending ? (
                "Loading..."
              ) : (
                <List dense component="div">
                  <ListItem>
                    <Typography>
                      <b>Name:</b>{` ${props?.watch("name")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Email: </b>{` ${props?.watch("email")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Time: </b>{` ${time}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Points: </b>{` ${result.toFixed(2)}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Result: </b>{` ${percent.toFixed(2)}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Accuracy: </b>{` ${accuracy}%`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Status: </b>{` ${percent > props?.watch("minimum_percent_to_pass")
                        ? "Pass"
                        : "Fail"}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Rank: </b>{` ${props?.watch("rank")}`}
                    </Typography>
                  </ListItem>
                </List>
              )}
            </Card>
          </Grid>
          <Grid item xs={0} sm={2}></Grid>
          <Grid item xs={12} sm={5}>
            <Card>
              <CardHeader title="Topper Result" />
              <Divider />
              {props?.isPending ? (
                "Loading..."
              ) : (
                <List dense component="div">
                  <ListItem>
                    <Typography>
                      <b>Name: </b>{` ${props?.watch("topper_result.name")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Email: </b>{` ${props?.watch("topper_result.email")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Time: </b>{` ${props?.watch("topper_result.quiz_time")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Points: </b>{` ${props?.watch("topper_result.points")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Result: </b>{` ${props?.watch("topper_result.result")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Accuracy: </b>{` ${props?.watch(
                      "topper_result.accuracy"
                    )}%`}
                    </Typography>
                    <Typography></Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Status: </b>{` ${props?.watch("topper_result.status")}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      <b>Rank: </b>{` ${props?.watch("topper_result.rank")}`}
                    </Typography>
                  </ListItem>
                </List>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid item xs={6} md={6}>
          <QuestionReportChart
            {...props}
            skipped={(
              (props
                ?.watch("questions")
                ?.filter((d) => !d?.result?.solved_count)?.length /
                props?.watch("questions")?.length) *
              100
            ).toFixed(2)}
            correct={(
              (props
                ?.watch("questions")
                ?.filter(
                  (d) => d?.result?.solved_count && d?.result?.correct_count
                )?.length /
                props?.watch("questions")?.length) *
              100
            ).toFixed(2)}
            incorrect={(
              (props
                ?.watch("questions")
                ?.filter(
                  (d) => d?.result?.solved_count && d?.result?.incorrect_count
                )?.length /
                props?.watch("questions")?.length) *
              100
            ).toFixed(2)}
          />
        </Grid>
        <Grid md={2}></Grid>
        <Grid item xs={12} md={4}>
          <ScoreChart
            total={props?.watch("questions")?.length}
            skipped={
              props?.watch("questions")?.filter((d) => !d?.result?.solved_count)
                ?.length
            }
            correct={
              props
                ?.watch("questions")
                ?.filter(
                  (d) => d?.result?.solved_count && d?.result?.correct_count
                )?.length
            }
            incorrect={
              props
                ?.watch("questions")
                ?.filter(
                  (d) => d?.result?.solved_count && d?.result?.incorrect_count
                )?.length
            }
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">Question Report</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultSection;
