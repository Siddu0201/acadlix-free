import CustomTypography from '@acadlix/components/CustomTypography'
import { FaQuora, FaRegClock, FaRegStar, TbFilePencilFilled } from '@acadlix/helpers/icons'
import { secondsToHms } from '@acadlix/helpers/util'
import { Avatar, Box, Card, CardActions, CardContent, Chip, Divider, Grid, useTheme } from '@mui/material'
import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import CustomLatex from '@acadlix/modules/latex/CustomLatex'

const Template2 = (props) => {
  let quiz_time = props?.watch("quiz_time") ?? 0;
  if (props?.watch("quiz_timing_type") === "subject_wise_time") {
    quiz_time = props?.watch("subject_times")?.reduce((a, b) => a + (b?.time ?? 0), 0) * 1000;
  }
  return (
    <Box>
      <Card>
        <CardContent>
          {
            props?.fields?.includes("category") && (
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
              props?.fields?.includes("time") && (
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
              props?.fields?.includes("questions") && props?.fields?.includes("time") && (
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
              props?.fields?.includes("questions") && (
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
              props?.fields?.includes("questions") && props?.fields?.includes("time") && (
                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>
              )
            }
            {
              props?.fields?.includes("points") && (
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
              props?.fields?.includes("attempts") && props?.fields?.includes("points") && (
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
              props?.fields?.includes("attempts") && (
                <Grid size={{ xs: 11 / 2 }}>
                  <Section
                    icon={TbFilePencilFilled}
                    iconColor="success"
                    value={`${props?.watch("quiz_attempts")}`}
                    label={sprintf(__("Attempt%s", "acadlix"), props?.watch("quiz_attempts") !== 1 ? "s" : "")}
                  />
                </Grid>
              )
            }
            {
              props?.fields?.includes("description") && (
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

export default Template2

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
      <Avatar variant="rounded" sx={{
        backgroundColor: theme.palette[iconColor]?.light || theme.palette.action.hover,
        color: theme.palette[iconColor]?.main || theme.palette.text.secondary,
      }}>
        <Icon style={{ color: theme.palette[iconColor]?.main || theme.palette.text.secondary }} />
      </Avatar>
      <Box>
        <CustomTypography>
          {value}
        </CustomTypography>
        <CustomTypography variant="body2" sx={{
          color: theme.palette.text.secondary,
        }}>
          {label}
        </CustomTypography>
      </Box>
    </Box>
  )
}