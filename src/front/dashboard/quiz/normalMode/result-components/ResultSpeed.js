import React from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Speed from "@acadlix/images/speed-svgrepo-com.svg";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const ResultSpeed = ({
    getSolvedCount,
    getTimeTaken,
}) => {
    return (
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                    src={Speed}
                    className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-speed'
                />
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                    className='acadlix-quiz-result-text acadlix-quiz-result-text-speed'
                >
                    {isNaN(getSolvedCount() / (getTimeTaken() / 60))
                        ? 0
                        : (getSolvedCount() / (getTimeTaken() / 60)).toFixed(2)}{" "}
                    {__("Q/min", "acadlix")}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-speed'
                >
                    {__("Speed", "acadlix")}
                </Typography>
            </Box>
        </Grid>
    )
}

export default ResultSpeed

ResultSpeed.propTypes = {
    getSolvedCount: PropTypes.func.isRequired,
    getTimeTaken: PropTypes.func.isRequired,
}
