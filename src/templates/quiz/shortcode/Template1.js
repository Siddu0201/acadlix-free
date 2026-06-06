import CustomTypography from '@acadlix/components/CustomTypography'
import { FaInfinity, FaQuora, FaRegClock, FaRegStar, TbFilePencilFilled } from '@acadlix/helpers/icons'
import { getFormatDate, secondsToHms } from '@acadlix/helpers/util'
import { Box, Card, CardActions, CardContent, Chip, Divider, Grid, useTheme } from '@mui/material'
import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import CustomLatex from '@acadlix/modules/latex/CustomLatex'

const Template1 = (props) => {
  const fields = props?.fields ?? [];
  let quiz_time = props?.watch("quiz_time") ?? 0;
  if (props?.watch("quiz_timing_type") === "subject_wise_time") {
    quiz_time = props?.watch("subject_times")?.reduce((a, b) => a + (b?.time ?? 0), 0) * 1000;
  }

  const hasCategory = fields.includes("category");
  const hasTime = fields.includes("time");
  const hasQuestions = fields.includes("questions");
  const hasPoints = fields.includes("points");
  const hasAttempts = fields.includes("attempts");
  const hasStartDate = fields.includes("start_date") && !!props?.watch("start_date");
  const hasEndDate = fields.includes("end_date") && !!props?.watch("end_date");
  const hasDescription = fields.includes("description");

  return (
    <Box>
      <Card>
        <CardContent>
          {
            hasCategory && (
              <Chip label={props?.watch("category")} color="warning" />
            )
          }
          <CustomTypography
            variant="h3"
            sx={{
              marginY: 2,
            }}>
            {props?.watch("title")}
          </CustomTypography>
          <Grid
            container
            spacing={2}
          >
            {
              hasTime && (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={FaRegClock}
                    iconColor="primary"
                    value={`${secondsToHms(Math.ceil(quiz_time / 1000))}`}
                    label={`${props?.watch("quiz_timing_type") === "per_question_time" ? "Per question time" : "Total time"}`}
                  />
                </Grid>
              )
            }
            {
              hasQuestions && hasTime && (
                <Grid size={{ xs: 1 }} sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    variant="middle"
                    sx={{
                      alignSelf: "stretch",
                    }}
                  />
                </Grid>
              )
            }
            {
              hasQuestions && (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={FaQuora}
                    iconColor="secondary"
                    value={`${props?.watch("questions")?.length}`}
                    label={sprintf(__("Question%s", "acadlix"), props?.watch("questions")?.length !== 1 ? "s" : "")}
                  />
                </Grid>
              )
            }
            {
              hasQuestions && hasTime && (
                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>
              )
            }
            {
              hasPoints && (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={FaRegStar}
                    iconColor="warning"
                    value={`${props?.getTotalPoints()}`}
                    label={sprintf(__("Point%s", "acadlix"), props?.getTotalPoints() !== 1 ? "s" : "")}
                  />
                </Grid>
              )
            }
            {
              hasAttempts && hasPoints && (
                <Grid size={{ xs: 1 }} sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    variant="middle"
                    sx={{
                      alignSelf: "stretch",
                    }}
                  />
                </Grid>
              )
            }
            {
              hasAttempts && (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={TbFilePencilFilled}
                    iconColor="success"
                    value={props?.watch("per_user_allowed_attempt") > 0 ? props?.watch("per_user_allowed_attempt") : <FaInfinity />}
                    label={sprintf(__("Allowed Attempt%s", "acadlix"), props?.watch("per_user_allowed_attempt") !== 1 ? "s" : "")}
                  />
                </Grid>
              )
            }
            {
              hasStartDate && hasEndDate && (
                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>
              )
            }
            {
              hasStartDate &&
              (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={FaRegClock}
                    iconColor="info"
                    value={getFormatDate(props?.watch("start_date"))}
                    label={__("Start Date", "acadlix")}
                  />
                </Grid>
              )
            }
            {
              hasStartDate && hasEndDate &&
              (
                <Grid size={{ xs: 1 }} sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    variant="middle"
                    sx={{
                      alignSelf: "stretch",
                    }}
                  />
                </Grid>
              )
            }
            {
              hasEndDate &&
              (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={FaRegClock}
                    iconColor="error"
                    value={getFormatDate(props?.watch("end_date"))}
                    label={__("End Date", "acadlix")}
                  />
                </Grid>
              )
            }
            {
              hasDescription && (
                <Grid size={{ xs: 12 }}>
                  <Divider />
                  <CustomLatex>
                    {props?.watch("description")}
                  </CustomLatex>
                </Grid>
              )
            }
          </Grid>
        </CardContent>
        <CardActions sx={{
          paddingTop: 0,
        }}>
          {props?.children}
        </CardActions>
      </Card>
    </Box>
  )
}

export default Template1

const Section = ({
  icon: Icon,
  iconColor,
  value,
  label,
}) => {
  const theme = useTheme();
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}>
      <Icon style={{
        color: theme.palette[iconColor]?.main || theme.palette.text.secondary,
      }} />
      <CustomTypography
        component="div"
        sx={{
          color: theme.palette.text.secondary,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}>
        {value} {label}
      </CustomTypography>
    </Box>
  )
}