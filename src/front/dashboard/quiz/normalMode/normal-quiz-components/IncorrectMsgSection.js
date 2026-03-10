import React from 'react'
import { Box, Typography } from '@mui/material'
import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const IncorrectMsgSection = ({
    lang,
    question,
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
                display: question?.different_incorrect_msg
                    ? lang?.incorrect_msg?.length > 0
                        ? ""
                        : "none"
                    : lang?.correct_msg?.length > 0
                        ? ""
                        : "none",
            }}
            className="acadlix-normal-quiz-incorrect-msg-section"
        >
            <Box>
                <Typography
                    className="acadlix-normal-quiz-incorrect-msg-label"
                    component="div"
                >
                    <b>{__('Explanation', 'acadlix')}</b>
                </Typography>
            </Box>
            <Box>
                <Typography 
                    component="div" 
                    className="acadlix-normal-quiz-incorrect-msg-content"
                >
                    <CustomLatex>
                        {question?.different_incorrect_msg
                            ? lang?.incorrect_msg
                            : lang?.correct_msg}
                    </CustomLatex>
                </Typography>
            </Box>
        </Box>
    )
}

export default IncorrectMsgSection

IncorrectMsgSection.propTypes = {
    lang: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
}
