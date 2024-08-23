import {
  Box,
  Avatar,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const AdvanceResultComparission = (props) => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <Card>
          <CardHeader
            title="Result comparison with topper"
            titleTypographyProps={{
              sx: {
                textAlign: "center",
                fontWeight: {
                  xs: 600,
                  md: 400,
                },
                fontSize: {
                  xs: "1.15rem",
                  md: "1.5rem",
                },
              },
            }}
          />
          {props?.isPending ? (
            "Loading..."
          ) : (
            <Box
              sx={{
                marginX: {
                  md: 4,
                  xs: 2,
                },
              }}
            >
              <Grid container>
                <Grid item md={4} xs={6}></Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    <b>You</b>
                  </Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    <b>Topper</b>
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Name */}
              <Grid container>
                <Grid
                  item
                  md={4}
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar src={props?.Name} sx={{ width: 20, height: 20 }} />
                  <b>Name:</b>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>{props?.watch("name")}</Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>{props?.watch("topper_result.name")}</Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Time */}
              <Grid container>
                <Grid
                  item
                  md={4}
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={props?.ClockImage}
                    sx={{ width: 20, height: 20 }}
                  />
                  <b>Time:</b>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>{props?.time}</Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    {props?.watch("topper_result.quiz_time")}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Points */}
              <Grid container>
                <Grid
                  item
                  md={4}
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={props?.TickImage}
                    sx={{ width: 20, height: 20 }}
                  />
                  <b>Points:</b>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>{props?.points?.toFixed(2)}</Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    {props?.watch("topper_result.points")}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Result */}
              <Grid container>
                <Grid
                  item
                  md={4}
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar src={props?.Result} sx={{ width: 20, height: 20 }} />
                  <b>Result:</b>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>{props?.result?.toFixed(2)}%</Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    {props?.watch("topper_result.result")}%
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Accuracy */}
              <Grid container>
                <Grid
                  item
                  md={4}
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={props?.AccuracyImage}
                    sx={{ width: 20, height: 20 }}
                  />
                  <b>Accuracy:</b>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>{props?.accuracy}%</Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    {props?.watch("topper_result.accuracy")}%
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Status */}
              <Grid
                container
                sx={{
                  marginBottom: "15px",
                }}
              >
                <Grid
                  item
                  md={4}
                  xs={6}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={
                      props?.result > props?.watch("minimum_percent_to_pass")
                        ? props?.Pass
                        : props?.Fail
                    }
                    sx={{ width: 20, height: 20 }}
                  />
                  <b>Status:</b>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    {props?.result > props?.watch("minimum_percent_to_pass")
                      ? "Pass"
                      : "Fail"}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  <Typography>
                    {props?.watch("topper_result.status")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdvanceResultComparission;
