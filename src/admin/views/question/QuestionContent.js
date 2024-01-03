import React, { useEffect } from "react";
import Fill from "./types/Fill";
import RangeType from "./types/RangeType";
import TrueFalse from "./types/TrueFalse";
import Numerical from "./types/Numerical";
import MultipleChoice from "./types/MultipleChoice";
import SingleChoice from "./types/SingleChoice";
import SortingChoice from "./types/SortingChoice";
import MatrixSortingChoice from "./types/MatrixSortingChoice";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CardContent,
  CardHeader,
  Grid,
  Card,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CustomTextField from "../../../components/CustomTextField";
import CustomSwitch from "../../../components/CustomSwitch";
import LanguageSection from "./sections/LanguageSection";
import GeneralOptionSection from "./sections/GeneralOptionSection";
import QuestionTextSection from "./sections/QuestionTextSection";
import QuestionMessageSection from "./sections/QuestionMessageSection";
import QuestionHintSection from "./sections/QuestionHintSection";
import QuestionAnswerTypeSection from "./sections/QuestionAnswerTypeSection";

const QuestionContent = () => {
  const [answer, setAnswer] = React.useState("singleChoice");

  const methods = useForm({
    defaultValues: {
      id: null,
      subject_id: null,
      topic_id: null,
      points: 0,
      negative_point: 0,
      different_incorrect_text: "",
      tip_enabled: 0,
      answer_type: "",
      language: [
        {
          language_id: null,
          default: true,
          question: "",
          correct_msg: "",
          incorrect_msg: "",
          tip_msg: "",
          answer_data: {
            singleChoice: {},
            multipleChoice: {},
            trueFalse: {},
            sortingChoice: {},
            matrixSortingChoice: {},
            fillInTheBlank: {},
            numerical: {},
            rangeType: {},
            paragraph: {},
          },
        },
      ],
    },
  });

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
          editor.on("input change", function () {
            // console.log(editor.getContent());
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

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const answerType = () => {
    switch (answer) {
      case "singleChoice":
        return <SingleChoice />;
      case "multipleChoice":
        return <MultipleChoice />;
      case "trueFalse":
        return <TrueFalse />;
      case "sortingChoice":
        return <SortingChoice />;
      case "matrixSortingChoice":
        return <MatrixSortingChoice />;
      case "fillInTheBlank":
        return <Fill />;
      case "numerical":
        return <Numerical />;
      case "rangeType":
        return <RangeType />;
      case "paragraph":
        break;
      default:
        break;
    }
  };

  const loadPage = () => {
    loadEditor("question");
    loadEditor("correct_message");
    loadEditor("incorrect_message");
    loadEditor("hint");
  };

  useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      removeEditor("question");
      removeEditor("correct_message");
      removeEditor("incorrect_message");
      removeEditor("hint");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Box>
      <Grid
        container
        rowSpacing={3}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        {/* General section contain title, points, subject, topic */}
        <GeneralOptionSection />

        {/* Language section */}
        <LanguageSection />

        {/* Section contain question */}
        <QuestionTextSection />

        {/* Section contain message with correct answer and incorrect answer */}
        <QuestionMessageSection />

        {/* Section contain hint */}
        <QuestionHintSection />

        {/* Section contain answer type */}
        <QuestionAnswerTypeSection answer={answer} handleChange={handleChange} />

        {/* Section contain answer type form */}
        <Grid item xs={12} sm={12}>
          {answerType()}
        </Grid>

        {/* Language section */}
        <LanguageSection />

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
