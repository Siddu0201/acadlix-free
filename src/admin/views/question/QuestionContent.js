import React, { useEffect } from "react";
import Fill from "./types/Fill";
import RangeType from "./types/RangeType";
import TrueFalse from "./types/TrueFalse";
import Numerical from "./types/Numerical";
import MultipleChoice from "./types/MultipleChoice";
import SingleChoice from "./types/SingleChoice";
import SortingChoice from "./types/SortingChoice";
import MatrixSortingChoice from "./types/MatrixSortingChoice";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useForm } from "react-hook-form";
import LanguageSection from "./sections/LanguageSection";
import GeneralOptionSection from "./sections/GeneralOptionSection";
import QuestionTextSection from "./sections/QuestionTextSection";
import QuestionMessageSection from "./sections/QuestionMessageSection";
import QuestionHintSection from "./sections/QuestionHintSection";
import QuestionAnswerTypeSection from "./sections/QuestionAnswerTypeSection";
import { Link, useNavigate } from "react-router-dom";
import {
  PostCreateQuizQuestion,
  UpdateQuizQuestionById,
} from "../../../requests/admin/AdminQuestionRequest";
import { TiArrowLeftThick } from "../../../helpers/icons";
import QuestionParagraphSection from "./sections/QuestionParagraphSection";
import { __ } from "@wordpress/i18n";
import FreeChoice from "./types/FreeChoice";

const QuestionContent = (props) => {
  const getAnswerData = (type, position = 0) => {
    let answerData = {};
    switch (type) {
      case "singleChoice":
        answerData = [
          {
            position: position,
            option: "",
            points: 0,
            negative_points: 0,
            isCorrect: false,
            isChecked: false,
          },
        ];
        break;
      case "multipleChoice":
        answerData = [
          {
            position: position,
            option: "",
            points: 0,
            negative_points: 0,
            isCorrect: false,
            isChecked: false,
          },
        ];
        break;
      case "trueFalse":
        answerData = [
          { option: "True", isCorrect: false, isChecked: false },
          { option: "False", isCorrect: false, isChecked: false },
        ];
        break;
      case "freeChoice":
        answerData = {
          option: "",
          correctOption: [],
          caseSensitive: false,
          yourAnswer: ""
        };
        break;
      case "sortingChoice":
        answerData = [
          {
            option: "",
            position: position,
          },
        ];
        break;
      case "matrixSortingChoice":
        answerData = [
          {
            criteria: "",
            element: "",
            correctPosition: position,
            yourPosition: null,
          },
        ];
        break;
      case "fillInTheBlank":
        answerData = {
          option: "",
          caseSensitive: false,
          correctOption: [],
        };
        break;
      case "numerical":
        answerData = {
          option: "",
          yourAnswer: "",
        };
        break;
      case "rangeType":
        answerData = {
          from: "",
          to: "",
          yourAnswer: "",
        };
        break;
      case "paragraph":
        answerData = {};
        break;
      default:
        answerData = [];
        break;
    }

    return answerData;
  };

  const methods = useForm({
    defaultValues: {
      id: props?.question?.id ?? null,
      quiz_id: Number(props?.quiz_id),
      subject_id: props?.question?.subject_id
        ? Number(props?.question?.subject_id)
        : null,
      online: !props?.create ? Boolean(Number(props?.question?.online)) : true,
      sort: props?.create
        ? props?.quiz?.questions_count + 1
        : props?.question?.sort,
      multi_language: Boolean(Number(props?.quiz?.rendered_metas?.multi_language)),
      title: props?.question?.title ?? "",
      points: props?.question?.points ? Number(props?.question?.points) : 1,
      negative_points: props?.question?.negative_points
        ? Number(props?.question?.negative_points)
        : 0,
      different_points_for_each_answer: Boolean(
        Number(props?.question?.different_points_for_each_answer)
      ),
      different_incorrect_msg: Boolean(
        Number(props?.question?.different_incorrect_msg)
      ),
      hint_enabled: Boolean(Number(props?.question?.hint_enabled)),
      paragraph_enabled: Boolean(Number(props?.question?.paragraph_enabled)),
      paragraph_id: props?.question?.paragraph_id,
      answer_type: props?.question?.answer_type ?? "singleChoice",
      language: props?.create
        ? props?.quiz?.languages?.map((lang) => {
          return {
            id: null,
            language_id: lang?.term_id,
            language_name: lang?.name,
            default: lang?.term_id === props?.quiz?.rendered_metas?.default_language_id,
            selected: lang?.term_id === props?.quiz?.rendered_metas?.default_language_id,
            question: "",
            correct_msg: "",
            incorrect_msg: "",
            hint_msg: "",
            answer_data: {
              singleChoice: getAnswerData("singleChoice"),
              multipleChoice: getAnswerData("multipleChoice"),
              trueFalse: getAnswerData("trueFalse"),
              freeChoice: getAnswerData("freeChoice"),
              sortingChoice: getAnswerData("sortingChoice"),
              matrixSortingChoice: getAnswerData("matrixSortingChoice"),
              fillInTheBlank: getAnswerData("fillInTheBlank"),
              numerical: getAnswerData("numerical"),
              rangeType: getAnswerData("rangeType"),
            },
          };
        })
        : props?.question?.question_languages?.map((lang) => {
          return {
            id: lang?.id,
            language_id: lang?.language_id,
            language_name: lang?.language?.name,
            default: Boolean(Number(lang?.default)),
            selected: Boolean(Number(lang?.default)),
            question: lang?.question,
            correct_msg: lang?.correct_msg,
            incorrect_msg: lang?.incorrect_msg,
            hint_msg: lang?.hint_msg,
            answer_data: lang?.answer_data ?? {
              singleChoice: getAnswerData("singleChoice"),
              multipleChoice: getAnswerData("multipleChoice"),
              trueFalse: getAnswerData("trueFalse"),
              freeChoice: getAnswerData("freeChoice"),
              sortingChoice: getAnswerData("sortingChoice"),
              matrixSortingChoice: getAnswerData("matrixSortingChoice"),
              fillInTheBlank: getAnswerData("fillInTheBlank"),
              numerical: getAnswerData("numerical"),
              rangeType: getAnswerData("rangeType"),
            },
          };
        }),
    },
  });

  // console.log(methods?.watch("language"));

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        plugins:
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern wpview",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons",
        toolbar2:
          "styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
        textarea_rows: 20,
        setup: function (editor) {
          editor.on("input change", function (e) {
            methods.setValue(name, window.wp.editor.getContent(key), {
              shouldDirty: true,
            });
          });
        },
      },
      quicktags: true,
      mediaButtons: true,
    });
  };

  const removeEditor = (key) => {
    window.wp.editor.remove(key);
  };

  const answerType = (lang, index) => {
    switch (methods.watch("answer_type")) {
      case "singleChoice":
        return (
          <SingleChoice
            {...methods}
            index={index}
            lang={lang}
            type="singleChoice"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
            getAnswerData={getAnswerData}
          />
        );
      case "multipleChoice":
        return (
          <MultipleChoice
            {...methods}
            index={index}
            lang={lang}
            type="multipleChoice"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
            getAnswerData={getAnswerData}
          />
        );
      case "trueFalse":
        return (
          <TrueFalse
            {...methods}
            index={index}
            lang={lang}
            type="trueFalse"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "freeChoice":
        return (
          <FreeChoice
            {...methods}
            index={index}
            lang={lang}
            type="freeChoice"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "sortingChoice":
        return (
          <SortingChoice
            {...methods}
            index={index}
            lang={lang}
            type="sortingChoice"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
            getAnswerData={getAnswerData}
          />
        );
      case "matrixSortingChoice":
        return (
          <MatrixSortingChoice
            {...methods}
            index={index}
            lang={lang}
            type="matrixSortingChoice"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
            getAnswerData={getAnswerData}
          />
        );
      case "fillInTheBlank":
        return (
          <Fill
            {...methods}
            index={index}
            lang={lang}
            type="fillInTheBlank"
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "numerical":
        return (
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive && (
            <Numerical
              {...methods}
              index={index}
              lang={lang}
              type="numerical"
              loadEditor={loadEditor}
              removeEditor={removeEditor}
            />
          )
        );
      case "rangeType":
        return (
          process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive && (
            <RangeType
              {...methods}
              index={index}
              lang={lang}
              type="rangeType"
              loadEditor={loadEditor}
              removeEditor={removeEditor}
            />
          )
        );
      case "paragraph":
        break;
      default:
        break;
    }
  };

  // console.log(methods.watch());
  // console.log(props?.quiz);

  const navigate = useNavigate();
  const createMutation = PostCreateQuizQuestion(props?.quiz_id);
  const updateMutation = UpdateQuizQuestionById(
    props?.quiz_id,
    props?.question_id
  );
  const onSubmit = (data) => {
    const newData = { ...data };
    if (props?.create) {
      createMutation.mutate(newData, {
        onSuccess: (data) => {
          navigate(`/${props?.quiz_id}/question`);
        },
      });
    } else {
      updateMutation.mutate(newData, {
        onSuccess: (data) => {
          navigate(`/${props?.quiz_id}/question`);
        },
      });
    }
  };

  return (
    <Box
      sx={{
        color: "black",
      }}
    >
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid
          container
          rowSpacing={3}
          spacing={4}
          sx={{
            padding: 4,
          }}
        >
          <Grid size={{ xs: 12, sm: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<TiArrowLeftThick />}
                size="medium"
                sx={{
                  width: "fit-content",
                }}
                LinkComponent={Link}
                to={`/${props?.quiz_id}/question`}
              >
                {__("Back", "acadlix")}
              </Button>
              <Typography variant="h6">
                {props?.create ? __("Create Question", "acadlix") : __("Edit Question", "acadlix")}
              </Typography>
            </Box>
          </Grid>
          {/* General section contain title, points, subject, topic */}
          <GeneralOptionSection {...methods} {...props} />

          {
            process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
            <QuestionParagraphSection {...methods} {...props} />
          }

          {/* Language section */}
          {/* {methods?.watch("multi_language") && (
            <LanguageSection
              {...methods}
              removeEditor={removeEditor}
              getAnswerData={getAnswerData}
            />
          )} */}

          {methods?.watch("language")?.length > 0 &&
            methods?.watch("language")?.map((lang, index) => (
              <React.Fragment key={index}>
                {/* Section contain question */}
                <QuestionTextSection
                  {...methods}
                  loadEditor={loadEditor}
                  removeEditor={removeEditor}
                  index={index}
                  lang={lang}
                />

                {/* Section contain message with correct answer and incorrect answer */}
                <QuestionMessageSection
                  {...methods}
                  loadEditor={loadEditor}
                  removeEditor={removeEditor}
                  index={index}
                  lang={lang}
                />

                {/* Section contain hint */}
                <QuestionHintSection
                  {...methods}
                  loadEditor={loadEditor}
                  removeEditor={removeEditor}
                  index={index}
                  lang={lang}
                />
              </React.Fragment>
            ))}

          {/* Section contain answer type */}
          <QuestionAnswerTypeSection
            {...methods}
            getAnswerData={getAnswerData}
          />

          {/* Section contain answer type form */}
          {methods?.watch("language")?.length > 0 &&
            methods?.watch("language")?.map((lang, index) => (
              <React.Fragment key={index}>
                <Grid size={{ xs: 12, sm: 12, lg: 12 }}
                  sx={{
                    display: lang?.selected ? "" : "none",
                  }}
                >
                  {answerType(lang, index)}
                </Grid>
              </React.Fragment>
            ))}

          {/* Language section */}
          {/* {methods?.watch("multi_language") && (
            <LanguageSection
              {...methods}
              removeEditor={removeEditor}
              getAnswerData={getAnswerData}
            />
          )} */}

          <Grid size={{ xs: 12, sm: 12 }}>
            <Button variant="contained" type="submit">
              {createMutation?.isPending || updateMutation?.isPending ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                __("Save Changes", "acadlix")
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default QuestionContent;
