import React from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { __ } from "@wordpress/i18n";
import Negative from "@acadlix/images/wrong-way-svgrepo-com.svg";
import PropTypes from "prop-types";
import { Card } from '@mui/material';

const NegativeMarks = ({
    getNegativePoints,
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
                        src={Negative}
                        className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-negative-marks'
                    />
                </Box>
                <Box>
                    <Typography
                        component="div"
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                        className='acadlix-quiz-result-text acadlix-quiz-result-text-negative-marks'
                    >
                        {`-${getNegativePoints()?.toFixed(2)}`}
                    </Typography>
                    <Typography
                        component="div"
                        variant="subtitle2"
                        className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-negative-marks'
                    >
                        {__("Negative Marks", "acadlix")}
                    </Typography>
                </Box>
            </Card>
        </Grid>
    )
}

export default NegativeMarks

NegativeMarks.propTypes = {
    getNegativePoints: PropTypes.func.isRequired,
}
