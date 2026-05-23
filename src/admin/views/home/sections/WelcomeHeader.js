import { Box, Button, Card, CardContent, Link, Typography } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import CustomTypography from '@acadlix/components/CustomTypography'

const WelcomeHeader = (props) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
            <CustomTypography
              variant="h2"
            >
              {__("Welcome to Acadlix", "acadlix")}
            </CustomTypography>
            <Typography
              variant="subtitle1"
              color={(theme) => theme.palette.text.secondary}
            >
              {__("Manage your LMS, quizzes, sales from one place.", "acadlix")}
            </Typography>
          </Box>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href={props.watch('createCourseUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              + {__("Create Course", "acadlix")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href={props.watch('createQuizUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {__("Create Quiz", "acadlix")}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WelcomeHeader