import React from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Percentile from "@acadlix/images/percentage-percent-svgrepo-com.svg";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const ResultPercentile = ({
    isPending,
    percentile,
}) => {
    return (
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar 
                    src={Percentile} 
                    className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-percentile'
                />
            </Box>
            <Box>
                <Typography 
                    variant="h6" 
                    sx={{ fontWeight: 600 }}
                    className='acadlix-quiz-result-text acadlix-quiz-result-text-percentile'
                >
                    {isPending ? __("loading...", "acadlix") : percentile}
                </Typography>
                <Typography 
                    variant="subtitle2"
                    className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-percentile'
                >
                    {__("Percentile", "acadlix")}
                </Typography>
            </Box>
        </Grid>
    )
}

export default ResultPercentile

ResultPercentile.propTypes = {
    isPending: PropTypes.bool.isRequired,
    percentile: PropTypes.number.isRequired,
}
