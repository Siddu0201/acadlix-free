import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { __ } from "@wordpress/i18n";
import { shuffleArrayBasedOnOrder } from "@acadlix/helpers/util";
import TypeSingleChoice from "@acadlix/front/dashboard/quiz/questionTypes/TypeSingleChoice";
import TypeMultipleChoice from "@acadlix/front/dashboard/quiz/questionTypes/TypeMultipleChoice";
import TypeTrueFalse from "@acadlix/front/dashboard/quiz/questionTypes/TypeTrueFalse";
import TypeSortingChoice from "@acadlix/front/dashboard/quiz/questionTypes/TypeSortingChoice";
import TypeMatrixSortingChoice from "@acadlix/front/dashboard/quiz/questionTypes/TypeMatrixSortingChoice";
import TypeFill from "@acadlix/front/dashboard/quiz/questionTypes/TypeFill";
import TypeNumerical from "@acadlix/front/dashboard/quiz/questionTypes/TypeNumerical";
import TypeRange from "@acadlix/front/dashboard/quiz/questionTypes/TypeRange";
import LanguageSection from "@acadlix/front/dashboard/quiz/normalMode/normal-quiz-section/LanguageSection";
import QuestionStatusSection from "@acadlix/front/dashboard/quiz/normalMode/normal-quiz-section/QuestionStatusSection";
import PropTypes from "prop-types";
import TypeFreeChoice from "@acadlix/front/dashboard/quiz/questionTypes/TypeFreeChoice";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const QuestionSubjectAndPointSection = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import("@acadlix/pro/front/dashboard/quiz/advanceMode/advance-result-section/AdvanceQuestionSubjectAndPointSection") // Use pro version in Pro build
    : import("@acadlix/front/dashboard/quiz/normalMode/normal-quiz-section/QuestionSubjectAndPointSection")           // Provide fallback if in Free build
);

const AnswerSheet = ({
    statistic = [],
    colorCode = {},
    quiz = {},
    ...props
}) => {
    const theme = useTheme();
    const methods = useForm({
        defaultValues: {
            show_marks: true,
            show_per_question_time: true,
            display_subject: true,
            view_answer: true,
            multi_language: Boolean(Number(quiz?.multi_language)),
            mode: quiz?.rendered_metas?.mode, // normal/check_and_continue/question_below_each_other/advance_mode
            advance_mode_type: quiz?.rendered_metas?.advance_mode_type, // advance_panel/ibps/ssc/gate/sbi/jee/railway
            enable_selectable_questions_rule: Boolean(
                Number(quiz?.rendered_metas?.quiz_settings?.enable_selectable_questions_rule)
            ),
            subject_times:
                quiz?.subject_times ?
                    quiz?.subject_times?.map((s) => {
                        return {
                            ...s,
                            optional: Boolean(Number(s?.optional)),
                        };
                    }) : [],
            questions: statistic?.map((stat) => {
                return {
                    selected: true,
                    check: true,
                    question_id: stat?.question_id,
                    subject_id: stat?.question?.subject_id,
                    subject_name:
                        stat?.question?.subject?.subject_name ?? "Uncategorized",
                    online: stat?.question?.online,
                    sort: stat?.question?.sort,
                    title: stat?.question?.title,
                    points: stat?.question?.points,
                    negative_points: stat?.question?.negative_points,
                    different_points_for_each_answer: Boolean(
                        Number(stat?.question?.different_points_for_each_answer)
                    ),
                    different_incorrect_msg: Boolean(
                        Number(stat?.question?.different_incorrect_msg)
                    ),
                    hint_enabled: Boolean(Number(stat?.question?.hint_enabled)),
                    paragraph_enabled: Boolean(Number(stat?.question?.paragraph_enabled)),
                    paragraph_id: stat?.question?.paragraph_id,
                    answer_type: stat?.question?.answer_type,
                    result: {
                        correct_count: stat?.correct_count,
                        incorrect_count: stat?.incorrect_count,
                        solved_count: stat?.solved_count,
                        hint_count: stat?.hint_count,
                        time: stat?.question_time,
                        answer_data: stat?.answer_data,
                        attempted_at: stat?.attempted_at ?? null,
                    },
                    language:
                        stat?.question?.question_languages?.map((lang) => {
                            return {
                                language_id: lang?.language_id,
                                language_name: lang?.language?.name,
                                default: Boolean(Number(lang?.default)),
                                selected: Boolean(Number(lang?.default)),
                                paragraph: stat?.question?.paragraph?.rendered_metas?.language_data?.find(p => p?.language_id === lang?.language_id)?.content ?? "" ?? "",
                                question: lang?.rendered_question,
                                correct_msg: lang?.rendered_correct_msg,
                                incorrect_msg: lang?.rendered_incorrect_msg,
                                hint_msg: lang?.rendered_hint_msg,
                                answer_data: {
                                    singleChoice:
                                        stat?.question?.answer_type === "singleChoice" && stat?.answer_data
                                            ? lang?.rendered_answer_data?.singleChoice?.map((answer) => ({ ...answer, isChecked: stat?.answer_data?.includes(answer?.position) ?? false }))
                                            : lang?.rendered_answer_data?.singleChoice,
                                    multipleChoice:
                                        stat?.question?.answer_type === "multipleChoice" && stat?.answer_data
                                            ? lang?.rendered_answer_data?.multipleChoice?.map((answer) => ({ ...answer, isChecked: stat?.answer_data?.includes(answer?.position) ?? false }))
                                            : lang?.rendered_answer_data?.multipleChoice,
                                    trueFalse:
                                        stat?.question?.answer_type === "trueFalse" && stat?.answer_data
                                            ? lang?.rendered_answer_data?.trueFalse?.map((answer, index) => ({ ...answer, isChecked: stat?.answer_data == index ?? false }))
                                            : lang?.rendered_answer_data?.trueFalse,
                                    freeChoice:
                                        stat?.question?.answer_type === "freeChoice" && stat?.answer_data
                                            ? { ...lang?.rendered_answer_data?.freeChoice, yourAnswer: stat?.answer_data }
                                            : lang?.rendered_answer_data?.freeChoice,
                                    sortingChoice:
                                        stat?.question?.answer_type === "sortingChoice" && stat?.answer_data
                                            ? shuffleArrayBasedOnOrder(lang?.rendered_answer_data?.sortingChoice, stat?.answer_data)
                                            : lang?.rendered_answer_data?.sortingChoice,
                                    matrixSortingChoice:
                                        stat?.question?.answer_type === "matrixSortingChoice" && stat?.answer_data
                                            ? lang?.rendered_answer_data?.matrixSortingChoice?.map((c, index) => ({ ...c, yourPosition: stat?.answer_data?.[index] ?? null }))
                                            : lang?.rendered_answer_data?.matrixSortingChoice,
                                    fillInTheBlank:
                                        stat?.question?.answer_type === "fillInTheBlank" && stat?.answer_data
                                            ? {
                                                ...lang?.rendered_answer_data?.fillInTheBlank,
                                                correctOption: lang?.rendered_answer_data?.fillInTheBlank?.correctOption?.map((c, index) => ({ ...c, yourAnswer: stat?.answer_data?.[index] ?? '' })),
                                            }
                                            : lang?.rendered_answer_data?.fillInTheBlank,
                                    numerical:
                                        stat?.question?.answer_type === "numerical" && stat?.answer_data
                                            ? { ...lang?.rendered_answer_data?.numerical, yourAnswer: stat?.answer_data }
                                            : lang?.rendered_answer_data?.numerical,
                                    rangeType:
                                        stat?.question?.answer_type === "rangeType" && stat?.answer_data
                                            ? { ...lang?.rendered_answer_data?.rangeType, yourAnswer: stat?.answer_data }
                                            : lang?.rendered_answer_data?.rangeType,
                                },
                            };
                        }) ?? [],
                };
            }),
        },
    });

    // console.log(methods?.watch("questions"));

    let questionRef = React.useRef([]);

    const handleClick = (id) => {
        const elm = document.getElementById(`acadlix_question_${id}`);
        if (elm) {
            elm?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const isQuestionEvaluated = (subjectId = 0, questionId = 0) => {
        const subject = methods?.watch("subject_times")?.find((d) => d?.subject_id === subjectId);
        if (
          methods?.watch("mode") === "advance_mode" &&
          methods?.watch("enable_selectable_questions_rule") &&
          subject &&
          subject?.selectable_rule_number_of_questions > 0
        ) {
          const subject_questions = methods?.watch("questions")?.filter((d) => d?.subject_id === subjectId);
    
          let evaluate_number_of_question = subject_questions?.length;
          if (evaluate_number_of_question > subject?.selectable_rule_number_of_questions) {
            evaluate_number_of_question = subject?.selectable_rule_number_of_questions;
          }
          const attempted_questions = subject_questions
            ?.filter((d) => d?.result?.attempted_at)
            ?.sort((a, b) => new Date(a.result.attempted_at) - new Date(b.result.attempted_at));
          const evaluated_questions = attempted_questions?.slice(0, evaluate_number_of_question);
    
          return evaluated_questions?.some((d) => d?.question_id === questionId);
        }
        return false;
      }

    return (
        <Box>
            {/* Question OverView */}
            <Box
                sx={{
                    border: `1px solid ${colorCode?.overview_border}`,
                    borderRadius: 1,
                    boxShadow: (theme) => theme?.shadows[2],
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        overflowY: "scroll",
                        maxHeight: "105px",
                        padding: {
                            xs: "3px",
                            sm: "5px",
                        },
                        borderBottom: `1px solid ${colorCode?.overview_border}`,
                        boxShadow: (theme) => theme?.shadows[1],
                        backgroundColor: "transparent",
                    }}
                >
                    {methods?.watch("questions")?.map((d, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            sx={{
                                minWidth: {
                                    xs: "31px",
                                    sm: "32px",
                                },
                                padding: "3px 3px",
                                margin: "3px",
                                border: `1px solid ${d?.selected
                                    ? colorCode?.overview_button_active_border
                                    : colorCode?.overview_button_border
                                    }`,
                                boxShadow: d?.selected ? theme.shadows[3] : "none",
                                backgroundColor:
                                    d?.result?.correct_count && d?.result?.solved_count
                                        ? (theme) => theme?.palette?.success?.main
                                        : d?.result?.incorrect_count && d?.result?.solved_count
                                            ? (theme) => theme?.palette?.error?.main
                                            : (theme) => theme?.palette?.grey[300],
                                color: colorCode?.overview_button_active_text,
                                ":hover, :focus": {
                                    backgroundColor:
                                        d?.result?.correct_count && d?.result?.solved_count
                                            ? (theme) => theme?.palette?.success?.main
                                            : d?.result?.incorrect_count && d?.result?.solved_count
                                                ? (theme) => theme?.palette?.error?.main
                                                : (theme) => theme?.palette?.grey[300],
                                    color: colorCode?.overview_button_active_text,
                                    border: `1px solid ${d?.selected
                                        ? colorCode?.overview_button_active_border
                                        : colorCode?.overview_button_border
                                        }`,
                                },
                            }}
                            onClick={handleClick.bind(this, index)}
                        >
                            {++index}
                        </Button>
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        padding: {
                            xs: "3px 3px",
                            sm: "5px 8px",
                        },
                    }}
                >
                    <Box
                        sx={{
                            marginTop: "5px",
                            height: "15px",
                            width: "15px",
                            backgroundColor: (theme) => theme?.palette?.success?.main,
                            marginRight: "5px",
                            display: "inline-block",
                        }}
                    ></Box>
                    <Typography>{__("Correct", "acadlix")}</Typography>
                    <Box
                        sx={{
                            marginTop: "5px",
                            backgroundColor: (theme) => theme?.palette?.error?.main,
                            height: "15px",
                            width: "15px",
                            marginX: "5px",
                            display: "inline-block",
                        }}
                    ></Box>
                    <Typography>{__("Incorrect", "acadlix")}</Typography>
                    <Box
                        sx={{
                            marginTop: "5px",
                            backgroundColor: (theme) => theme?.palette?.grey[300],
                            height: "15px",
                            width: "15px",
                            marginX: "5px",
                            display: "inline-block",
                        }}
                    ></Box>
                    <Typography>{__("Skippeds", "acadlix")}</Typography>
                </Box>
            </Box>

            {methods?.watch("questions")?.length > 0 &&
                methods?.watch("questions")
                    ?.map((question, index) => (
                        <ViewQuestionSection
                            {...props}
                            {...methods}
                            colorCode={colorCode}
                            key={index}
                            index={index}
                            num={index + 1}
                            question={question}
                            first={index === 0}
                            questionRef={questionRef}
                            last={methods?.watch("questions")?.length - 1 === index}
                            isQuestionEvaluated={isQuestionEvaluated}
                        />
                    ))}
        </Box>
    );
};

AnswerSheet.prototype = {
    statistic: PropTypes.object,
    colorCode: PropTypes.object,
    quiz: PropTypes.object,
}

const ViewQuestionSection = (props) => {
    const theme = useTheme();
    const answerType = (data = {}, lang_index = 0) => {
        switch (props?.question?.answer_type) {
            case "singleChoice":
                return (
                    <TypeSingleChoice
                        type="singleChoice"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "multipleChoice":
                return (
                    <TypeMultipleChoice
                        type="multipleChoice"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "trueFalse":
                return (
                    <TypeTrueFalse
                        type="trueFalse"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "freeChoice":
                return (
                    <TypeFreeChoice
                        type="freeChoice"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "sortingChoice":
                return (
                    <TypeSortingChoice
                        type="sortingChoice"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "matrixSortingChoice":
                return (
                    <TypeMatrixSortingChoice
                        type="matrixSortingChoice"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "fillInTheBlank":
                return (
                    <TypeFill
                        type="fillInTheBlank"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "numerical":
                return (
                    <TypeNumerical
                        type="numerical"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            case "rangeType":
                return (
                    <TypeRange
                        type="rangeType"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
            default:
                return (
                    <TypeSingleChoice
                        type="singleChoice"
                        lang_index={lang_index}
                        index={props?.index}
                        {...props}
                        {...data}
                    />
                );
        }
    };

    const questionBelowSx = {
        boxShadow: (theme) => theme?.shadows[2],
        paddingX: 2,
        paddingY: 3,
        marginTop: 3,
        borderRadius: "6px",
    };

    return (
        <Box
            sx={{
                ...questionBelowSx,
                display: props?.question?.selected ? "" : "none",
                marginBottom: 5,
            }}
            id={`acadlix_question_${props?.index}`}
            ref={(elem) => (props.questionRef.current[props.index] = elem)}
        >
            <Box>
                {props?.watch("multi_language") && <LanguageSection {...props} />}
                <React.Suspense fallback={null}>
                    <QuestionSubjectAndPointSection {...props} />
                </React.Suspense>

                {props?.question?.language?.length > 0 &&
                    props?.question?.language?.map((lang, lang_index) => (
                        <React.Fragment key={lang_index}>
                            <Box
                                sx={{
                                    display: lang?.selected ? "block" : "none",
                                }}
                            >
                                {props?.question?.paragraph_enabled &&
                                    props?.question?.paragraph_id !== null && (
                                        <Box>
                                            <Typography component="div">
                                                <CustomLatex>
                                                    {lang?.paragraph}
                                                </CustomLatex>
                                            </Typography>
                                            <Divider />
                                        </Box>
                                    )}
                                <Typography component="div">
                                    <CustomLatex>
                                        {lang?.question}
                                    </CustomLatex>
                                </Typography>
                                {answerType(lang, lang_index)}
                            </Box>
                        </React.Fragment>
                    ))}
                <QuestionStatusSection {...props} />
                {props?.question?.language?.length > 0 &&
                    props?.question?.language?.map((lang, index) => (
                        <Box key={index} sx={{
                            display: lang?.selected ? "" : "none"
                        }}>
                            {props?.question?.result?.solved_count ? (
                                props?.question?.result?.correct_count ? (
                                    <Box
                                        sx={{
                                            border: (theme) =>
                                                `1px solid ${theme?.palette?.grey[300]}`,
                                            padding: 2,
                                            marginY: 2,
                                            borderRadius: 1,
                                            backgroundColor: "transparent",
                                            boxShadow: theme?.shadows[1],
                                            display: lang?.correct_msg?.length > 0 ? "" : "none",
                                        }}
                                    >
                                        <Box>
                                            <Typography>
                                                <b>{__("Explanation", "acadlix")}</b>
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography component="div">
                                                <CustomLatex>
                                                    {lang?.correct_msg}
                                                </CustomLatex>
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            border: (theme) =>
                                                `1px solid ${theme?.palette?.grey[300]}`,
                                            padding: 2,
                                            marginY: 2,
                                            borderRadius: 1,
                                            backgroundColor: "transparent",
                                            boxShadow: theme?.shadows[1],
                                            display: props?.question?.different_incorrect_msg
                                                ? lang?.incorrect_msg?.length > 0
                                                    ? ""
                                                    : "none"
                                                : lang?.correct_msg?.length > 0
                                                    ? ""
                                                    : "none",
                                        }}
                                    >
                                        <Box>
                                            <Typography>
                                                <b>{__("Explanation", "acadlix")}</b>
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography component="div">
                                                <CustomLatex>
                                                    {props?.question?.different_incorrect_msg
                                                        ? lang?.incorrect_msg
                                                        : lang?.correct_msg}
                                                </CustomLatex>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )
                            ) : (
                                <Box
                                    sx={{
                                        border: (theme) => `1px solid ${theme?.palette?.grey[300]}`,
                                        padding: 2,
                                        marginY: 2,
                                        borderRadius: 1,
                                        backgroundColor: "transparent",
                                        boxShadow: theme?.shadows[1],
                                        display: props?.question?.different_incorrect_msg
                                            ? lang?.incorrect_msg?.length > 0
                                                ? ""
                                                : "none"
                                            : lang?.correct_msg?.length > 0
                                                ? ""
                                                : "none",
                                    }}
                                >
                                    <Box>
                                        <Typography>
                                            <b>{__("Explanation", "acadlix")}</b>
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography component="div">
                                            <CustomLatex>
                                                {props?.question?.different_incorrect_msg
                                                    ? lang?.incorrect_msg
                                                    : lang?.correct_msg}
                                            </CustomLatex>
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))}
            </Box>
        </Box>
    );
};

export default AnswerSheet;
