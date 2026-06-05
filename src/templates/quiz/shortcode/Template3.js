import CustomTypography from '@acadlix/components/CustomTypography'
import { FaQuora, FaRegClock, TbFilePencilFilled } from '@acadlix/helpers/icons'
import { secondsToHms } from '@acadlix/helpers/util'
import { Avatar, Box, Card, CardActions, CardContent, Chip, useTheme } from '@mui/material'
import React from 'react'

const Template3 = (props) => {
  return (
    <Box>
      <Card>
        <CardContent>
          <Chip label="Category" color="warning" />
          <CustomTypography variant="h4" sx={{
            marginY: 2,
          }}>
            {props?.watch("title")}
          </CustomTypography>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
            {
              ["full_quiz_time", "per_question_time"].includes(props?.watch("quiz_timing_type")) && (
                <Section
                  icon={FaRegClock}
                  iconColor="primary"
                  value={`${secondsToHms(Math.ceil(props?.watch("quiz_time") / 1000))}`}
                  label={`${props?.watch("quiz_timing_type") === "full_quiz_time" ? "Total time" : "Per question time"}`}
                />
              )}
            <Section
              icon={FaQuora}
              iconColor="secondary"
              value={`${props?.watch("questions")?.length}`}
              label={`Questions`}
            />
            {/* <Section
              icon={TbFilePencilFilled}
              iconColor="success"
              value={`${props?.watch("quiz_attempts")}`}
              label={`Attempts`}
            /> */}
          </Box>
        </CardContent>
        <CardActions>
          {props?.children}
        </CardActions>
      </Card>
    </Box>
  )
}

export default Template3

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
      justifyContent: "space-between",
    }}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}>
        <Icon style={{
          color: theme.palette[iconColor]?.main || theme.palette.text.secondary,
        }} />
        <CustomTypography sx={{
          color: theme.palette.text.secondary,
        }}>
          {`${label}`}
        </CustomTypography>
      </Box>
      <CustomTypography sx={{
        color: theme.palette.text.secondary,
      }}>
        {`${value}`}
      </CustomTypography>
    </Box>
  )
}