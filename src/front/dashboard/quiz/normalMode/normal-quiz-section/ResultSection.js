import {
  Box,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { __ } from "@wordpress/i18n";
import AverageScore from "../result-components/AverageScore";
import ResultText from "../result-components/ResultText";
// import MarksObtained from "../result-components/MarksObtained";
// import NegativeMarks from "../result-components/NegativeMarks";
// import TimeTaken from "../result-components/TimeTaken";

const MarksObtained = React.lazy(() =>
  import(
    /* webpackChunkName: "admin_quiz_front_dashboard_quiz_result_section_marks_obtained" */
    "../result-components/MarksObtained")
);

const NegativeMarks = React.lazy(() =>
  import(
    /* webpackChunkName: "admin_quiz_front_dashboard_quiz_result_section_negative_marks" */
    "../result-components/NegativeMarks")
);

const TimeTaken = React.lazy(() =>
  import(
    /* webpackChunkName: "admin_quiz_front_dashboard_quiz_result_section_time_taken" */
    "../result-components/TimeTaken")
);

const ResultStatus = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_result_status" */
      "@acadlix/pro/front/dashboard/quiz/result-components/ResultStatus") :
    Promise.resolve({ default: () => null })
);

const Accuracy = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_accuracy" */
      "@acadlix/pro/front/dashboard/quiz/result-components/Accuracy") :
    Promise.resolve({ default: () => null })
);

const ResultRank = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_result_rank" */
      "@acadlix/pro/front/dashboard/quiz/result-components/ResultRank") :
    Promise.resolve({ default: () => null })
);

const ResultPercentile = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_result_percentile" */
      "@acadlix/pro/front/dashboard/quiz/result-components/ResultPercentile") :
    Promise.resolve({ default: () => null })
);

const ResultSpeed = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_result_speed" */
      "@acadlix/pro/front/dashboard/quiz/result-components/ResultSpeed") :
    Promise.resolve({ default: () => null })
);

const ResultComparission = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_result_comparission" */
      "@acadlix/pro/front/dashboard/quiz/result-components/ResultComparission") :
    Promise.resolve({ default: () => null })
);

const SubjectWiseResult = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "front_dashboard_quiz_normal_mode_result_section_subject_wise_result" */
      "@acadlix/pro/front/dashboard/quiz/result-components/SubjectWiseResult") :
    Promise.resolve({ default: () => null })
);

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
      <ResultText {...props} />
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
        <React.Suspense fallback={null}>
          <MarksObtained
            getPoints={props?.getPoints}
            getTotalPoints={props?.getTotalPoints}
          />
        </React.Suspense>
        {!props?.watch("hide_negative_marks") && (
          <React.Suspense fallback={null}>
            <NegativeMarks
              getNegativePoints={props?.getNegativePoints}
            />
          </React.Suspense>
        )}
        {props?.watch("save_statistic") && props?.watch("show_average_score") && (
          <AverageScore
            isPending={props?.isPending}
            average_score={props?.watch("average_score")}
          />
        )}
        {props?.watch("show_status_based_on_min_percent") && (
          <React.Suspense fallback={null}>
            <ResultStatus
              getResult={props?.getResult}
              getStatus={props?.getStatus}
              minimum_percent_to_pass={props?.watch("minimum_percent_to_pass")}
            />
          </React.Suspense>
        )}
        {props?.watch("show_accuracy") && (
          <React.Suspense fallback={null}>
            <Accuracy
              getAccuracy={props?.getAccuracy}
            />
          </React.Suspense>
        )}
        {!props?.watch("hide_quiz_time") && (
          <React.Suspense fallback={null}>
            <TimeTaken
              getTimeTaken={props?.getTimeTaken}
            />
          </React.Suspense>
        )}
        {props?.watch("leaderboard") && props?.watch("show_rank") && (
          <React.Suspense fallback={null}>
            <ResultRank
              isPending={props?.isPending}
              rank={props?.watch("rank")}
            />
          </React.Suspense>
        )}
        {props?.watch("save_statistic") && props?.watch("show_percentile") && (
          <React.Suspense fallback={null}>
            <ResultPercentile
              isPending={props?.isPending}
              percentile={props?.watch("percentile")}
            />
          </React.Suspense>
        )}
        {props?.watch("show_speed") && (
          <React.Suspense fallback={null}>
            <ResultSpeed
              getSolvedCount={props?.getSolvedCount}
              getTimeTaken={props?.getTimeTaken}
            />
          </React.Suspense>
        )}
      </Grid>
      {props?.watch("leaderboard") &&
        props?.watch("result_comparision_with_topper") && (
          <React.Suspense fallback={null}>
            <ResultComparission
              {...props}
            />
          </React.Suspense>
        )}
      {props?.watch("show_subject_wise_analysis") && (
        <React.Suspense fallback={null}>
          <SubjectWiseResult
            {...props}
          />
        </React.Suspense>
      )}
    </Box>
  );
};

export default ResultSection;
