import React from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ClockImage from "@acadlix/images/clock-svgrepo-com.png";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { secondsToHms } from "@acadlix/helpers/util";
import { Card } from '@mui/material';

const TimeTaken = ({
    getTimeTaken,
}) => {
    return (
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Card
                sx={{
                    paddingY: 2,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Avatar
                        src={ClockImage}
                        className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-time-taken'
                    />
                </Box>
                <Box>
                    <Typography
                        component="div"
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                        className='acadlix-quiz-result-text acadlix-quiz-result-text-time-taken'
                    >
                        {secondsToHms(getTimeTaken())}
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitle2"
                        className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-time-taken'
                    >
                        {__("Time Taken", "acadlix")}
                    </Typography>
                </Box>
            </Card>
        </Grid>
    )
}

export default TimeTaken

TimeTaken.propTypes = {
    getTimeTaken: PropTypes.func.isRequired,
}
