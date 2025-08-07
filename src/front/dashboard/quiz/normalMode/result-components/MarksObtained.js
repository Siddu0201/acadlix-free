import React from 'react'
import TickImage from "@acadlix/images/icons8-correct-96.png";
import { Avatar, Box, Card, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const MarksObtained = ({
  getPoints,
  getTotalPoints,
}) => {
  return (
    <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
      <Card
        sx={{
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={TickImage}
            className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-marks-obtained'
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600 }}
            className='acadlix-quiz-result-text acadlix-quiz-result-text-marks-obtained'
          >
            {getPoints()?.toFixed(2)}/{getTotalPoints()?.toFixed(2)}
          </Typography>
          <Typography
            variant="subtitle2"
            className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-marks-obtained'
          >
            {__("Marks Obtained", "acadlix")}
          </Typography>
        </Box>
      </Card>
    </Grid>
  )
}

export default MarksObtained

MarksObtained.propTypes = {
  getPoints: PropTypes.func.isRequired,
  getTotalPoints: PropTypes.func.isRequired,
}
