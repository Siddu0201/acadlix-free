import React from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { __ } from "@wordpress/i18n";
import Negative from "@acadlix/images/wrong-way-svgrepo-com.svg";
import PropTypes from "prop-types";

const NegativeMarks = ({
    getNegativePoints,
}) => {
    return (
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                    src={Negative}
                    className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-negative-marks'
                />
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                    className='acadlix-quiz-result-text acadlix-quiz-result-text-negative-marks'
                >
                    {`-${getNegativePoints()?.toFixed(2)}`}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-negative-marks'
                >
                    {__("Negative Marks", "acadlix")}
                </Typography>
            </Box>
        </Grid>
    )
}

export default NegativeMarks

NegativeMarks.propTypes = {
    getNegativePoints: PropTypes.func.isRequired,
}
