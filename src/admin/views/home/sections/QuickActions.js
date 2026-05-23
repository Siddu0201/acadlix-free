import CustomTypography from '@acadlix/components/CustomTypography'
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Link } from '@mui/material'
import React from 'react'

const QuickActions = (props) => {
  return (
    <Card>
      <CardHeader
        title="Quick Actions"
        subheader="Frequently used LMS operations"
        slotProps={{
          title: {
            variant: "h4",
          },
          subheader: {
            variant: "caption",
          }
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <QuickActionButton
              component={Link}
              href={props.watch('createCourseUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Course
            </QuickActionButton>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <QuickActionButton
              component={Link}
              href={props.watch('createQuizUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Quiz
            </QuickActionButton>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <QuickActionButton
              component={Link}
              href={props.watch('createLessonUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Lesson
            </QuickActionButton>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <QuickActionButton
              component={Link}
              href={props.watch('createCouponUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Coupon
            </QuickActionButton>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Divider sx={{
              marginY: 2,
            }} />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Card sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.primary.contrastText,
            }}>
              <CardContent>
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}>
                  <CustomTypography variant="caption" sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                  }}>
                    Need Help?
                  </CustomTypography>
                  <CustomTypography variant="h4" sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                  }}>
                    Explore Acadlix documentation & support resources.
                  </CustomTypography>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      LinkComponent={Link}
                      target="__blank"
                      href={acadlixOptions?.acadlix_documentation_url}
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.contrastText,
                        color: (theme) => theme.palette.primary.main,
                        "&:hover, &:focus": {
                          backgroundColor: (theme) => theme.palette.primary.contrastText,
                          color: (theme) => theme.palette.primary.main,
                        }
                      }}
                    >
                      Open Docs
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default QuickActions

const QuickActionButton = (props) => {
  return (
    <Button
      variant="outlined"
      fullWidth
      size="large"
      sx={{
        justifyContent: "flex-start",
        color: (theme) => theme.palette.text.primary,
        borderColor: (theme) => theme.palette.grey[200],
        borderRadius: 2,
      }}
      {...props}
    >
      {props.children}
    </Button>
  )
}