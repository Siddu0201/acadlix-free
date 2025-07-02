import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { __ } from "@wordpress/i18n";
import { secondsToHms } from "@acadlix/helpers/util";

const ResultComparisionSection = (props) => {
  return (
    <Grid container >
      <Grid size={{ xs: 12, sm: 12 }}>
        <Card>
          <CardHeader
            title={__('Result comparison with topper', 'acadlix')}
            titleTypographyProps={{
              sx: {
                textAlign: "center",
                fontWeight: {
                  xs: 600,
                  md: 400
                },
                fontSize: {
                  xs: "1.15rem",
                  md: "1.5rem",
                }
              }
            }}
          />
          {props?.isPending ? (
            __("Loading...", "acadlix")
          ) : (
            <Box
              sx={{
                marginX: {
                  md: 4,
                  xs: 2
                },
              }}
            >
              <Grid container >
                <Grid size={{ md: 4, xs: 6 }}></Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    <b>{__('You', 'acadlix')}</b>
                  </Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    <b>{__('Topper', 'acadlix')}</b>
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Name */}
              <Grid container >
                <Grid size={{ xs: 6, md: 4 }}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar src={props?.Name} sx={{ width: 20, height: 20 }} />
                  <b>{__('Name', 'acadlix')}:</b>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>{props?.watch("name")}</Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>{props?.watch("topper_result.name")}</Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Time */}
              <Grid container >
                <Grid size={{ xs: 6, md: 4 }}
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
                  <b>{__('Time', 'acadlix')}:</b>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>{secondsToHms(props?.getTimeTaken())}</Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    {props?.watch("topper_result.quiz_time")}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Points */}
              <Grid container >
                <Grid size={{ xs: 6, md: 4 }}
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
                  <b>{__('Points', 'acadlix')}:</b>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>{props?.getPoints()?.toFixed(2)}</Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    {props?.watch("topper_result.points")}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Result */}
              <Grid container >
                <Grid size={{ xs: 6, md: 4 }}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar src={props?.Result} sx={{ width: 20, height: 20 }} />
                  <b>{__('Result', 'acadlix')}:</b>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>{props?.getResult()?.toFixed(2)}%</Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    {props?.watch("topper_result.result")}%
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              {/* Accuracy */}
              <Grid container >
                <Grid size={{ xs: 6, md: 4 }}
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
                  <b>{__('Accuracy', 'acadlix')}:</b>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>{props?.getAccuracy()}%</Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
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
                <Grid size={{ xs: 6, md: 4 }}
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={
                      props?.getResult() >= props?.watch("minimum_percent_to_pass")
                        ? props?.Pass
                        : props?.Fail
                    }
                    sx={{ width: 20, height: 20 }}
                  />
                  <b>{__('Status', 'acadlix')}:</b>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    {props?.getStatus()}
                  </Typography>
                </Grid>
                <Grid size={{ md: 4, xs: 3 }}>
                  <Typography>
                    {props?.watch("topper_result.result") >= props?.watch("minimum_percent_to_pass")
                      ? __("Pass", "acadlix")
                      : __("Fail", "acadlix")}
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

export default ResultComparisionSection;
