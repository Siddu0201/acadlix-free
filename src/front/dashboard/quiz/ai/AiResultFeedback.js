import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import {__} from '@wordpress/i18n'
import { RawHTML } from "@wordpress/element";

const AiResultFeedback = ({
    isPending = false,
    response = ''
}) => {

    return (
        <Box>
            <Typography variant='h6'>
                {__('Response', 'acadlix')}
            </Typography>
            {
                isPending &&
                <CircularProgress size={20} />
            }
            {
                response &&
                <Typography variant='body1' component="div">
                    <RawHTML>{response}</RawHTML>
                </Typography>
            }
        </Box>
    )
}

export default AiResultFeedback
