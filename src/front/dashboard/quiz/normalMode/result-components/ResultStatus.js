import React from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Pass from "@acadlix/images/grinning-face-svgrepo-com.svg";
import Fail from "@acadlix/images/sad-but-relieved-face-svgrepo-com.svg";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { Card } from '@mui/material';

const ResultStatus = ({
    getResult,
    getStatus,
    minimum_percent_to_pass,
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
                        src={
                            getResult() >= minimum_percent_to_pass
                                ? Pass
                                : Fail
                        }
                        className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-status'
                    />
                </Box>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                        className='acadlix-quiz-result-text acadlix-quiz-result-text-status'
                    >
                        {getStatus()}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-status'
                    >
                        {__("Status", "acadlix")}
                    </Typography>
                </Box>
            </Card>
        </Grid >
    )
}

export default ResultStatus

ResultStatus.propTypes = {
    getResult: PropTypes.func.isRequired,
    getStatus: PropTypes.func.isRequired,
    minimum_percent_to_pass: PropTypes.number.isRequired,
}
