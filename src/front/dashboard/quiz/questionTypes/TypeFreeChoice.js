import { Avatar, Box, Typography } from '@mui/material';
import React from 'react'
import { TiTick, RxCross2 } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomTextField from '@acadlix/components/CustomTextField';

const TypeFreeChoice = (props) => {
    const handleChange = (e) => {
        props?.setValue(
            `questions.${props?.index}.language`,
            props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
                lang.answer_data[props?.type].yourAnswer = e?.target.value;
                return lang;
            })
        );

        let data = props?.watch(
            `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`
        );
        props?.setValue(
            `questions.${props?.index}.result`,
            {
                ...props?.watch(`questions.${props?.index}.result`),
                correct_count: data?.caseSensitive ?
                    (data?.correctOption?.includes(data?.yourAnswer) ? 1 : 0)
                    : (data.correctOption?.map((d) => d.toLowerCase()).includes(data.yourAnswer.toLowerCase()) ? 1 : 0),
                incorrect_count: data?.caseSensitive ?
                    (data?.correctOption?.includes(data?.yourAnswer) ? 0 : 1)
                    : (data.correctOption?.map((d) => d.toLowerCase()).includes(data.yourAnswer.toLowerCase()) ? 0 : 1),
                solved_count: data?.yourAnswer ? 1 : 0,
                answer_data: data?.yourAnswer ?? null,
            },
            { shouldDirty: true }
        );
    };

    const isDisabled = () => {
        if(props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)){
            return true;
        }
        return false;
    }

    return (
        <Box
            sx={{
                width: "auto",
                backgroundColor:
                    props?.watch(`questions.${props?.index}.check`)
                        ? props?.watch(`questions.${props?.index}.result.correct_count`)
                            ? (theme) => theme.palette.success.light
                            : (theme) => theme.palette.error.light
                        : "",
                border:
                    props?.watch("mode") !== "advance_mode"
                        ? props?.watch(`questions.${props?.index}.check`)
                            ? props?.watch(`questions.${props?.index}.result.correct_count`)
                                ? (theme) => `1px solid ${theme.palette.success.dark}`
                                : (theme) => `1px solid ${theme.palette.error.dark}`
                            : (theme) => `1px solid ${theme.palette.grey[300]}`
                        : "none",
                borderRadius: 1,
                padding: props?.watch("mode") !== "advance_mode" ? "5px" : 2,
                marginTop: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
                marginBottom: props?.watch("mode") !== "advance_mode" ? "10px" : 0,
                overflow: "auto",
            }}
        >
            {(props?.watch("view_answer") ||
                props?.watch(`questions.${props?.index}.check`)) && (
                    <Typography>
                        <b>{__("Your answer", "acadlix")}</b>
                    </Typography>
                )}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <CustomTextField
                    label={
                        props?.watch("view_answer") ||
                            props?.watch(`questions.${props?.index}.check`)
                            ? ""
                            : __("Type your answer", "acadlix")
                    }
                    size="small"
                    disabled={props?.isDisabled ?? false}
                    sx={{
                        marginY: 2,
                    }}
                    onKeyPress={(e) => {
                        if (e?.key === "Enter") {
                            e?.target?.blur();
                        }
                    }}
                    onChange={handleChange}
                    value={props?.answer_data?.[props?.type]?.yourAnswer}
                />
                {(props?.watch("view_answer") ||
                    props?.watch(`questions.${props?.index}.check`)) && (
                        <Box
                            sx={{
                                position: "relative",
                                marginLeft: "5px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {props?.watch(`questions.${props?.index}.result.correct_count`) ? (
                                <Avatar
                                    sx={{
                                        height: {
                                            xs: 24,
                                        },
                                        width: {
                                            xs: 24,
                                        },
                                        bgcolor: (theme) => theme?.palette?.success?.main,
                                    }}
                                >
                                    <TiTick />
                                </Avatar>
                            ) : (
                                <Avatar
                                    sx={{
                                        height: {
                                            xs: 24,
                                        },
                                        width: {
                                            xs: 24,
                                        },
                                        bgcolor: (theme) => theme.palette.error?.main,
                                    }}
                                >
                                    <RxCross2 />
                                </Avatar>
                            )}
                        </Box>
                    )}
            </Box>

            {(props?.watch("view_answer") ||
                props?.watch(`questions.${props?.index}.check`)) && (
                    <>
                        <Typography>
                            <b>{__("Correct answer", "acadlix")}</b>
                        </Typography>
                        <Typography>{props?.answer_data?.[props?.type]?.correctOption?.join(" | ")}</Typography>
                    </>
                )}
        </Box>
    )
}

export default TypeFreeChoice
