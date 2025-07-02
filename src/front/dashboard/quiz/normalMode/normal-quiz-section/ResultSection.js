import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import TickImage from "@acadlix/images/icons8-correct-96.png";
import ClockImage from "@acadlix/images/clock-svgrepo-com.png";
import AccuracyImage from "@acadlix/images/percentage-discount-svgrepo-com.svg";
import Rank from "@acadlix/images/cup-award-svgrepo-com.svg";
import Percentile from "@acadlix/images/percentage-percent-svgrepo-com.svg";
import Speed from "@acadlix/images/speed-svgrepo-com.svg";
import Pass from "@acadlix/images/grinning-face-svgrepo-com.svg";
import Fail from "@acadlix/images/sad-but-relieved-face-svgrepo-com.svg";
import Negative from "@acadlix/images/wrong-way-svgrepo-com.svg";
import Average from "@acadlix/images/bars-graph-svgrepo-com.svg";
import Name from "@acadlix/images/avatar-people-person-profile-user-svgrepo-com.svg";
import Result from "@acadlix/images/certificate-manager-svgrepo-com.svg";
import { secondsToHms } from "@acadlix/helpers/util";
import ResultComparisionSection from "./ResultComparisionSection";
import ResultTextSection from "./ResultTextSection";
import { __ } from "@wordpress/i18n";

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
          fontSize: 18,
        }}
      >
        {__("You have Completed", "acadlix")} "
        <Typography
          component="span"
          sx={{
            color: "#64B335",
            fontWeight: "500",
            fontSize: 22,
          }}
        >
          {props?.watch("title")}
        </Typography>
        "
      </Typography>
      <ResultTextSection {...props} percent={percent} />
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px auto",
        }}
        rowGap={2}
      >
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={TickImage} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {result?.toFixed(2)}/{total}
            </Typography>
            <Typography variant="subtitle2">{__("Marks Obtained", "acadlix")}</Typography>
          </Box>
        </Grid>
        {!props?.watch("hide_negative_marks") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Negative} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {`-${negative_marks?.toFixed(2)}`}
              </Typography>
              <Typography variant="subtitle2">{__("Negative Marks", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("save_statistic") && props?.watch("show_average_score") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Average} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {props?.isPending
                  ? __("loading...", "acadlix")
                  : props?.watch("average_score")}
              </Typography>
              <Typography variant="subtitle2">{__("Average Score", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_status_based_on_min_percent") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src={
                  percent >= props?.watch("minimum_percent_to_pass")
                    ? Pass
                    : Fail
                }
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {percent >= props?.watch("minimum_percent_to_pass")
                  ? __("Pass", "acadlix")
                  : __("Fail", "acadlix")}
              </Typography>
              <Typography variant="subtitle2">{__("Status", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_accuracy") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={AccuracyImage} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {`${accuracy}%`}
              </Typography>
              <Typography variant="subtitle2">{__("Accuracy", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {!props?.watch("hide_quiz_time") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={ClockImage} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {secondsToHms(time)}
              </Typography>
              <Typography variant="subtitle2">{__("Time Taken", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("leaderboard") && props?.watch("show_rank") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Rank} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {props?.isPending ? __("loading...", "acadlix") : props?.watch("rank")}
              </Typography>
              <Typography variant="subtitle2">{__("Rank", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("save_statistic") && props?.watch("show_percentile") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Percentile} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {props?.isPending ? __("loading...", "acadlix") : props?.watch("percentile")}
              </Typography>
              <Typography variant="subtitle2">{__("Percentile", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
        {props?.watch("show_speed") && (
          <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={Speed} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {isNaN(solvedCount / (time / 60))
                  ? 0
                  : (solvedCount / (time / 60)).toFixed(2)}{" "}
                {__("Q/min", "acadlix")}
              </Typography>
              <Typography variant="subtitle2">{__("Speed", "acadlix")}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      {props?.watch("leaderboard") &&
        props?.watch("result_comparision_with_topper") && (
          <ResultComparisionSection
            {...props}
            result={percent}
            accuracy={accuracy}
            points={result}
            time={secondsToHms(time)}
            TickImage={TickImage}
            ClockImage={ClockImage}
            AccuracyImage={AccuracyImage}
            Pass={Pass}
            Fail={Fail}
            Name={Name}
            Result={Result}
          />
        )}
    </Box>
  );
};

export default ResultSection;
