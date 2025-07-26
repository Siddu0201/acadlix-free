import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const QuestionText = ({
    lang,
}) => {
    return (
        <Typography 
            component="div" 
            className="acadlix-normal-quiz-question-content"
        >
            <CustomLatex>
                {lang?.question || ""}
            </CustomLatex>
        </Typography>
    )
}

export default QuestionText

QuestionText.propTypes = {
    lang: PropTypes.object.isRequired,
}
