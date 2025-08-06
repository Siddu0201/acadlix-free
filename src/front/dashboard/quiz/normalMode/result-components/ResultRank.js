import React from 'react'
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Rank from "@acadlix/images/cup-award-svgrepo-com.svg";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { Card } from '@mui/material';

const ResultRank = ({
    isPending,
    rank,
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
                        src={Rank}
                        className='acadlix-quiz-result-avatar acadlix-quiz-result-avatar-rank'
                    />
                </Box>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                        className='acadlix-quiz-result-text acadlix-quiz-result-text-rank'
                    >
                        {isPending ? __("loading...", "acadlix") : rank}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        className='acadlix-quiz-result-subtitle acadlix-quiz-result-subtitle-rank'
                    >
                        {__("Rank", "acadlix")}
                    </Typography>
                </Box>
            </Card>
        </Grid>
    )
}

export default ResultRank

ResultRank.propTypes = {
    isPending: PropTypes.bool.isRequired,
    rank: PropTypes.number.isRequired,
}
