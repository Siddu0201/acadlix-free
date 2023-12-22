import React, {useEffect} from "react";
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
  Switch,
} from "@mui/material";
import Language from "./sections/Language";
import { useForm } from "react-hook-form";
import CustomTextField from "../../../components/CustomTextField";

const QuestionContent = () => {
  const [answer, setAnswer] = React.useState("singleChoice");

  const methods = useForm({
    defaultValues: {
      id: null,
      subject_id: null,
      topic_id: null,
      points: 0,
      negative_point: 0,
      different_incorrect_text: '',
      tip_enabled: 0,
      answer_type: '',
      language: [{
        language_id: null,
        default: true,
        question: '',
        correct_msg: '',
        incorrect_msg: '',
        tip_msg: '',
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
        }
      }]
    }
  });

  console.log(methods.watch());

  const loadEditor = (key, name = '') => {
    window.wp.editor.initialize(key,{
        tinymce: {
            wpautop: true,
            plugins : 'charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern',
            toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv,listbuttons',
            toolbar2: 'styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
            textarea_rows : 20,
            setup: function(editor){
                editor.on('input change', function(){
                    // console.log(editor.getContent());
                })
            }
        },
        quicktags: true,
        mediaButtons: true
    });
  }

  const removeEditor = (key) => {
      window.wp.editor.remove(key);
  }

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
  }

  const loadPage = () => {
    loadEditor('question');
    loadEditor('correct_message');
    loadEditor('incorrect_message');
    loadEditor('hint');
  }

  useEffect(() => {
    loadPage();
    window.addEventListener('load', loadPage);

    return () => {
       removeEditor('question');
       removeEditor('correct_message');
       removeEditor('incorrect_message');
       removeEditor('hint');
       window.removeEventListener('load', loadPage);
    }
  },[]);

  return (
    <Box>
      <Grid container rowSpacing={3} spacing={4} sx={{
        padding: 4
      }}>

        {/* Top section contain title, points, subject, topic */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Question Title"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="+ Point"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="- Point"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={[]}
                    renderInput={(params) => (
                      <TextField {...params} label="Subject" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={[]}
                    renderInput={(params) => (
                      <TextField {...params} label="Topic" />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

         {/* Language section */}
         <Language />

        {/* Section contain question */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Question" />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <textarea 
                    id="question" 
                    style={{
                      width: '100%'
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section contain correct answer */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Message with correct answer" />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <FormControlLabel control={<Switch />} label="Different Message with Correct and Incorrect Answer?" />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <textarea 
                    id="correct_message" 
                    style={{
                      width: '100%'
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <textarea 
                    id="incorrect_message" 
                    style={{
                      width: '100%'
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section contain hint */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Hint(Optional)" />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <textarea 
                    id="hint" 
                    style={{
                      width: '100%'
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader title="Answer Type" />
            <CardContent>
              <RadioGroup row value={answer} onChange={handleChange}>
                <FormControlLabel
                  value="singleChoice"
                  control={<Radio />}
                  label="Single Choice"
                />
                <FormControlLabel
                  value="multipleChoice"
                  control={<Radio />}
                  label="Multiple Choice"
                />
                <FormControlLabel
                  value="trueFalse"
                  control={<Radio />}
                  label="True/False"
                />
                <FormControlLabel
                  value="sortingChoice"
                  control={<Radio />}
                  label="Sorting Choice"
                />
                <FormControlLabel
                  value="matrixSortingChoice"
                  control={<Radio />}
                  label="Matrix Sorting Choice"
                />
                <FormControlLabel
                  value="fillInTheBlank"
                  control={<Radio />}
                  label="Fill in the Blank"
                />
                <FormControlLabel
                  value="numerical"
                  control={<Radio />}
                  label="Numerical"
                />
                <FormControlLabel
                  value="rangeType"
                  control={<Radio />}
                  label="Range Type"
                />
                {/* <FormControlLabel
                  value="paragraph"
                  control={<Radio />}
                  label="Paragraph"
                /> */}
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Section contain answer type form */}
        <Grid item xs={12} sm={12}>
          {answerType()}
        </Grid>

        {/* Language section */}
        <Language />

        <Grid item xs={12} sm={12}>
          <Button variant="contained" color="success">
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default QuestionContent;
