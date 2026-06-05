import { Box, Button, Card, CardContent, Grid, Link, Typography } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import LineChart from '@acadlix/charts/LineChart'

const RevenueOverview = (props) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
          }}>
            <Typography
              variant="h4"
            >
              {__("Revenue Overview", "acadlix")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: (theme) => `${theme.palette.text.secondary}`
              }}
            >
              {__("Manage and monitor your revenue and sales performance.", "acadlix")}
            </Typography>
          </Box>
          {/* <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href={props.watch('courseUrl')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {__("View All Courses", "acadlix")}
            </Button>
          </Box> */}
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <LineChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default RevenueOverview