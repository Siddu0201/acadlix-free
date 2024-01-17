import React, { useEffect } from "react";
import Fill from "./types/Fill";
import RangeType from "./types/RangeType";
import TrueFalse from "./types/TrueFalse";
import Numerical from "./types/Numerical";
import MultipleChoice from "./types/MultipleChoice";
import SingleChoice from "./types/SingleChoice";
import SortingChoice from "./types/SortingChoice";
import MatrixSortingChoice from "./types/MatrixSortingChoice";
import { Button, Grid, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import LanguageSection from "./sections/LanguageSection";
import GeneralOptionSection from "./sections/GeneralOptionSection";
import QuestionTextSection from "./sections/QuestionTextSection";
import QuestionMessageSection from "./sections/QuestionMessageSection";
import QuestionHintSection from "./sections/QuestionHintSection";
import QuestionAnswerTypeSection from "./sections/QuestionAnswerTypeSection";

const QuestionContent = () => {
  const [availableLanguage, setAvailableLanguage] = React.useState([
    {id: 1, name: "English"},
    {id: 2, name: "Hindi"},
    {id: 3, name: "Tamil"},
    {id: 4, name: "Malyalum"},
    {id: 5, name: "Kannada"},
  ]);

  const methods = useForm({
    defaultValues: {
      id: null,
      subject_id: null,
      title: "",
      points: 1,
      negative_points: 0,
      different_points_for_each_answer: false,
      different_incorrect_msg: false,
      hint_enabled: false,
      answer_type: "singleChoice",
      default_language_id: 1,
      selected_language_id: 1,
      language: [
        {
          language_id: 1,
          question: "",
          correct_msg: "",
          incorrect_msg: "",
          hint_msg: "",
          answer_data: []
        },
      ],
    },
  });

  console.log(methods?.watch());

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        plugins:
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv,listbuttons",
        toolbar2:
          "styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
        textarea_rows: 20,
        setup: function (editor) {
          editor.on("input change", function (e) {
              methods.setValue(name, window.wp.editor.getContent(key), { shouldDirty: true });
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

  const answerType = () => {
    switch (methods.watch("answer_type")) {
      case "singleChoice":
        return (
          <SingleChoice
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "multipleChoice":
        return (
          <MultipleChoice
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "trueFalse":
        return (
          <TrueFalse
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "sortingChoice":
        return (
          <SortingChoice
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "matrixSortingChoice":
        return (
          <MatrixSortingChoice
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "fillInTheBlank":
        return (
          <Fill
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "numerical":
        return (
          <Numerical
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "rangeType":
        return (
          <RangeType
            {...methods}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />
        );
      case "paragraph":
        break;
      default:
        break;
    }
  };

  // console.log(methods.watch());

  return (
    <Box
      sx={{
        color: "black",
      }}
    >
      <Grid
        container
        rowSpacing={3}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        {/* General section contain title, points, subject, topic */}
        <GeneralOptionSection {...methods} />

        {/* Language section */}
        <LanguageSection
          {...methods}
          availableLanguage={availableLanguage}
          setAvailableLanguage={setAvailableLanguage}
          removeEditor={removeEditor}
        />

        {
          methods?.watch("language")?.length > 0 &&
          methods?.watch("language")?.map((lang, index) => (
            <React.Fragment key={index}>
              {/* Section contain question */}
              <QuestionTextSection
                {...methods}
                loadEditor={loadEditor}
                removeEditor={removeEditor}
                index={index}
                lang={lang}
                availableLanguage={availableLanguage}
              />

              {/* Section contain message with correct answer and incorrect answer */}
              <QuestionMessageSection
                {...methods}
                loadEditor={loadEditor}
                removeEditor={removeEditor}
                index={index}
                lang={lang}
                availableLanguage={availableLanguage}
              />

              {/* Section contain hint */}
              <QuestionHintSection
                {...methods}
                loadEditor={loadEditor}
                removeEditor={removeEditor}
                index={index}
                lang={lang}
                availableLanguage={availableLanguage}
              />
            </React.Fragment>
          ))
        }

        {/* Section contain answer type */}
        <QuestionAnswerTypeSection {...methods} />

        {/* Section contain answer type form */}
        <Grid item xs={12} sm={12}>
          {answerType()}
        </Grid>

        {/* Language section */}
        <LanguageSection
          {...methods}
          availableLanguage={availableLanguage}
          setAvailableLanguage={setAvailableLanguage}
          removeEditor={removeEditor}
        />

        <Grid item xs={12} sm={12}>
          <Button variant="contained" color="success">
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionContent;
