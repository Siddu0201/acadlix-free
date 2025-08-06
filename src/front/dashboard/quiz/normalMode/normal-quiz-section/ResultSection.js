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
import MarksObtained from "../result-components/MarksObtained";
import AverageScore from "../result-components/AverageScore";
import NegativeMarks from "../result-components/NegativeMarks";
import ResultStatus from "../result-components/ResultStatus";
import Accuracy from "../result-components/Accuracy";
import TimeTaken from "../result-components/TimeTaken";
import ResultRank from "../result-components/ResultRank";
import ResultPercentile from "../result-components/ResultPercentile";
import ResultSpeed from "../result-components/ResultSpeed";

const ResultSection = (props) => {
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
      <ResultTextSection {...props} />
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px auto",
        }}
        spacing={{
          xs: 2,
          sm: 4,
        }}
      >
        <MarksObtained
            getPoints={props?.getPoints}
            getTotalPoints={props?.getTotalPoints}
        />
        {!props?.watch("hide_negative_marks") && (
          <NegativeMarks
            getNegativePoints={props?.getNegativePoints}
          />
        )}
        {props?.watch("save_statistic") && props?.watch("show_average_score") && (
          <AverageScore
            isPending={props?.isPending}
            average_score={props?.watch("average_score")}
          />
        )}
        {props?.watch("show_status_based_on_min_percent") && (
          <ResultStatus
            getResult={props?.getResult}
            getStatus={props?.getStatus}
            minimum_percent_to_pass={props?.watch("minimum_percent_to_pass")}
          />
        )}
        {props?.watch("show_accuracy") && (
          <Accuracy
            getAccuracy={props?.getAccuracy}
          />
        )}
        {!props?.watch("hide_quiz_time") && (
          <TimeTaken
            getTimeTaken={props?.getTimeTaken}
          />
        )}
        {props?.watch("leaderboard") && props?.watch("show_rank") && (
          <ResultRank
            isPending={props?.isPending}
            rank={props?.watch("rank")}
          />
        )}
        {props?.watch("save_statistic") && props?.watch("show_percentile") && (
          <ResultPercentile
            isPending={props?.isPending}
            percentile={props?.watch("percentile")}
          />
        )}
        {props?.watch("show_speed") && (
          <ResultSpeed
            getSolvedCount={props?.getSolvedCount}
            getTimeTaken={props?.getTimeTaken}
          />
        )}
      </Grid>
      {props?.watch("leaderboard") &&
        props?.watch("result_comparision_with_topper") && (
          <ResultComparisionSection
            {...props}
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
