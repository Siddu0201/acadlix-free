import { Avatar, Box, Grid, Typography } from "@mui/material";
import React from "react";
import TickImage from '../../../../../images/icons8-correct-96.png';
import ClockImage from '../../../../../images/clock-svgrepo-com.png';
import AccuracyImage from '../../../../../images/percentage-discount-svgrepo-com.svg';
import QuestionReportChart from "./charts/QuestionReportChart";
import ScoreChart from "./charts/ScoreChart";
import { secondsToHms } from "../../../../../helpers/util";

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
          fontSize: 24,
        }}
      >
        Your have Completed "
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
      <Grid container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px auto",
        }}
      >
        <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={TickImage} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {
                props?.watch('questions')
                ?.reduce((total, d) => {
                  if(d?.result?.solved_count && d?.result?.correct_count){
                    return total + d?.points;
                  }else if(d?.result?.solved_count && d?.result?.incorrect_count){
                    return total - d?.negative_points;
                  }else{
                    return total;
                  }
                },0)
              }
              /
              {props?.watch('questions')?.reduce((total, d) => total + d?.points , 0)}
            </Typography>
            <Typography variant="h7">Marks Obtained</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={AccuracyImage}/>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {`${
                props?.watch('questions')?.filter(d => d?.result?.solved_count)?.length > 0
                ? (props?.watch('questions')?.filter(d => d?.result?.correct_count)?.length/props?.watch('questions')?.filter(d => d?.result?.solved_count)?.length * 100)?.toFixed(2)
                : 0
                }%`}
            </Typography>
            <Typography variant="h7">Accuracy</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}  sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={ClockImage} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {secondsToHms(props
            ?.watch("questions")
            .reduce((total, d) => total + d?.result?.time, 0) ?? 0)}
            </Typography>
            <Typography variant="h7">Time Taken</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Grid item xs={12} md={6}>
          <QuestionReportChart 
            skipped={(props?.watch('questions')?.filter(d => !d?.result?.solved_count)?.length/props?.watch('questions')?.length * 100).toFixed(2)} 
            correct={(props?.watch('questions')?.filter(d => d?.result?.solved_count && d?.result?.correct_count)?.length/props?.watch('questions')?.length * 100).toFixed(2)} 
            incorrect={(props?.watch('questions')?.filter(d => d?.result?.solved_count && d?.result?.incorrect_count)?.length/props?.watch('questions')?.length * 100).toFixed(2)} 
          />
        </Grid>
        <Grid md={2}></Grid>
        <Grid item xs={12} md={4}>
          <ScoreChart 
            total={props?.watch('questions')?.length}
            skipped={props?.watch('questions')?.filter(d => !d?.result?.solved_count)?.length}
            correct={props?.watch('questions')?.filter(d => d?.result?.solved_count && d?.result?.correct_count)?.length}
            incorrect={props?.watch('questions')?.filter(d => d?.result?.solved_count && d?.result?.incorrect_count)?.length}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
          }}>
            <Typography variant='h6'>
                Question Report
            </Typography>
          </Box>
        </Grid>
      </Grid>     
    </Box>
  );
};

export default ResultSection;
