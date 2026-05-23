import { Box, Button, Card, CardContent, CardHeader, Chip, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'

const CourseOverview = (props) => {
  function createData(name, students, completion, revenue, action) {
    return { name, students, completion, revenue, action };
  }

  const rows = [
    createData('SSC CGL Complete batch', 2198, '78%', 1.2, 4.0),
    createData('IBPS PO Complete batch', 237, '9%', 2.4, 4.3),
    createData('NEET Complete batch', 262, '16%', 3.6, 6.0),
  ];
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
              {__("Course Overview", "acadlix")}
            </Typography>
            <Typography
              variant="caption"
              color={(theme) => theme.palette.text.secondary}
            >
              {__("Manage and monitor your most important courses.", "acadlix")}
            </Typography>
          </Box>
          <Box sx={{
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
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{
              backgroundColor: "#f9fafc",
            }}>
              <TableRow>
                <TableCell sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Course</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Students</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Completion</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Revenue</TableCell>
                <TableCell align="center" sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: `400 !important`,
                  }}>{row.students}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.completion}
                      color='success'
                      size='small'
                      sx={{
                        fontSize: 12,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: `400 !important`,
                  }}>{row.revenue}</TableCell>
                  <TableCell align="center">
                    <Button
                      // variant="outlined"
                      color="primary"
                      size="small"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default CourseOverview