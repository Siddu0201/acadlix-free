import React from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Average from "@acadlix/images/bars-graph-svgrepo-com.svg";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const AverageScore = ({
    isPending,
    average_score,
}) => {
    return (
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                    src={Average}
                    className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-average-score'
                />
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                    className='acadlix-quiz-result-text acadlix-quiz-result-text-average-score'
                >
                    {isPending
                        ? __("loading...", "acadlix")
                        : average_score}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-average-score'
                >
                    {__("Average Score", "acadlix")}
                </Typography>
            </Box>
        </Grid>
    )
}

export default AverageScore

AverageScore.propTypes = {
    isPending: PropTypes.bool.isRequired,
    average_score: PropTypes.number.isRequired,
}
