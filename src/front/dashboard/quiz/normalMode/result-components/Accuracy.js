import React from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AccuracyImage from "@acadlix/images/percentage-discount-svgrepo-com.svg";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const Accuracy = ({
    getAccuracy,
}) => {
    return (
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                    src={AccuracyImage}
                    className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-accuracy'
                />
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                    className='acadlix-quiz-result-text acadlix-quiz-result-text-accuracy'
                >
                    {`${getAccuracy()?.toFixed(2)}%`}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-accuracy'
                >
                    {__("Accuracy", "acadlix")}
                </Typography>
            </Box>
        </Grid>
    )
}

export default Accuracy

Accuracy.propTypes = {
    getAccuracy: PropTypes.func.isRequired,
}
