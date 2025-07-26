import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import PropTypes from 'prop-types'

const ParagraphText = ({
    lang,
}) => {
    return (
        <Box>
            <Typography 
                component="div" 
                className="acadlix-normal-quiz-question-paragraph-content"
            >
                <CustomLatex>
                    {lang?.paragraph || ""}
                </CustomLatex>
            </Typography>
            <Divider />
        </Box>
    )
}

export default ParagraphText

ParagraphText.propTypes = {
    lang: PropTypes.object.isRequired,
}
