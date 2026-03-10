import React from 'react'
import { Box, Typography } from '@mui/material'
import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import PropTypes from 'prop-types'
import { __ } from "@wordpress/i18n";

const HintSection = ({
    lang,
    question,
    disable_hint,
}) => {
    return (
        <Box
            sx={{
                border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
                padding: 2,
                marginY: 2,
                borderRadius: 1,
                backgroundColor: "transparent",
                boxShadow: (theme) => theme?.shadows[1],
                display:
                    question?.hint && lang?.hint_msg?.length > 0 && !disable_hint
                        ? ""
                        : "none",
            }}
            className="acadlix-normal-quiz-hint-section"
        >
            <Box>
                <Typography 
                    className="acadlix-normal-quiz-hint-label"
                    component="div"
                >
                    <b>{__('Hint', 'acadlix')}</b>
                </Typography>
            </Box>
            <Box>
                <Typography component="div" className="acadlix-normal-quiz-hint-content">
                    <CustomLatex>
                        {lang?.hint_msg || ""}
                    </CustomLatex>
                </Typography>
            </Box>
        </Box>
    )
}

export default HintSection

HintSection.propTypes = {
    lang: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    disable_hint: PropTypes.bool,   
}
