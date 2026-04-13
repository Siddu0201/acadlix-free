import { FaTrash, RxCross2, TbCopyCheckFilled, TiArrowLeftThick, TiTick } from '@acadlix/helpers/icons';
import { Alert, AlertTitle, Autocomplete, Avatar, Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { __, sprintf } from '@wordpress/i18n';
import CustomTypography from '@acadlix/components/CustomTypography';
import CustomTextField from '@acadlix/components/CustomTextField';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { PostCreateSubject } from '@acadlix/requests/admin/AdminSubjectRequest';
import { hasCapability } from '@acadlix/helpers/util';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomLatex from '@acadlix/modules/latex/CustomLatex';
import { GetCreateQuizQuestion, PostUploadAiQuestions } from '@acadlix/requests/admin/AdminQuestionRequest';
import ValidateSingleChoice from './actions/validate_answer_types/ValidateSingleChoice';
import ValidateMultipleChoice from './actions/validate_answer_types/ValidateMultipleChoice';
import ValidateTrueFalse from './actions/validate_answer_types/ValidateTrueFalse';
import ValidateFreeChoice from './actions/validate_answer_types/ValidateFreeChoice';
import ValidateSortingChoice from './actions/validate_answer_types/ValidateSortingChoice';
import ValidateMatrixSortingChoice from './actions/validate_answer_types/ValidateMatrixSortingChoice';
import ValidateFillInTheBlank from './actions/validate_answer_types/ValidateFillInTheBlank';
import ValidateNumerical from './actions/validate_answer_types/ValidateNumerical';
import ValidateRangeType from './actions/validate_answer_types/ValidateRangeType';
import ValidateAssessment from './actions/validate_answer_types/ValidateAssessment';
import { PostGenerateQuestions } from '@acadlix/requests/ai/AiCommonRequest';

const AddQuestionWithAi = (props) => {
  const { quiz_id } = useParams();
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
      case "assessment":
        answerData = {
          characterLimit: 500,
          referenceAnswer: "",
          yourAnswer: "",
          yourUploads: [],
          allowed_mime_types: [],
          allowUploads: false,
          number_of_uploads: 1,
          max_file_size: 2
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
      quiz_title: "",
      subjects: [],
      question_prompt: "",
      generate_correct_msg: false,
      generate_incorrect_msg: false,
      generate_hint_msg: false,
      enable_source_content: false,
      source_content: "",
      enable_advanced_settings: false,
      advance_setting_chunks: [{
        subject: null,
        difficulty_level: "medium",
        question_type: "singleChoice",
        answer_options: 4,
        number_of_questions: 5,
        status: "Idle",
      }],
      status: "Idle", // Idle/Generating/Generated/Failed
      questions: [],
      quiz: null,
    }
  });

  const getAnswerType = (value = "") => {
    switch (value) {
      case "singleChoice":
        return "Single Choice";
      case "multipleChoice":
        return "Multiple Choice";
      case "trueFalse":
        return "True False";
      case "freeChoice":
        return "Free Choice";
      case "sortingChoice":
        return "Sorting Choice";
      case "matrixSortingChoice":
        return "Matrix Sorting Choice";
      case "fillInTheBlank":
        return "Fill In The Blank";
      case "numerical":
        return "Numerical";
      case "rangeType":
        return "Range Type";
      case "paragraph":
        return "Paragraph";
      case "assessment":
        return "Assessment";
      default:
        return "Single Choice";
    }
  };

  const getQuizQuestion = GetCreateQuizQuestion(quiz_id);

  React.useEffect(() => {
    if (getQuizQuestion?.data) {
      methods.setValue("subjects", getQuizQuestion?.data?.data?.subjects ?? [], {
        shouldDirty: true,
      });
      methods.setValue(`advance_setting_chunks.0.subject`, getQuizQuestion?.data?.data?.subjects?.find((s) => s?.subject_name === "Uncategorized") ?? null, {
        shouldDirty: true,
      });
      methods.setValue("quiz_title", getQuizQuestion?.data?.data?.quiz?.post_title ?? "", {
        shouldDirty: true,
      });
    }
  }, [getQuizQuestion?.data]);



  const handleAddAdvancedSettingChunk = () => {
    const advance_setting_chunks = methods?.watch("advance_setting_chunks") ?? [];
    methods.setValue("advance_setting_chunks", [...advance_setting_chunks, {
      subject: methods?.watch("subjects")?.find((s) => s?.subject_name === "Uncategorized") ?? null,
      difficulty_level: "medium",
      question_type: "singleChoice",
      answer_options: 4,
      number_of_questions: 5,
      status: "Idle", // Idle/Generating/Generated/Failed
    }], {
      shouldDirty: true,
    });
  }

  const generateQuestionsMutation = PostGenerateQuestions();
  const handleGenerateQuestions = (data, index, callback) => {
    if (index == null) {
      methods.setValue("status", "Generating", {
        shouldDirty: true,
      });
    } else {
      methods.setValue(`advance_setting_chunks.${index}.status`, "Generating", {
        shouldDirty: true,
      });
    }
    generateQuestionsMutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res?.data?.questions);
        if (index == null) {
          methods.setValue("status", "Generated", {
            shouldDirty: true,
          });
        } else {
          methods.setValue(`advance_setting_chunks.${index}.status`, "Generated", {
            shouldDirty: true,
          });
        }
        if (res?.data?.quiz) {
          methods.setValue("quiz", res?.data?.quiz, {
            shouldDirty: true,
          });
        }
        if (res?.data?.questions?.length > 0) {
          const existingQuestions = methods?.watch("questions") ?? [];
          methods.setValue(
            "questions",
            [...existingQuestions, ...res?.data?.questions?.map((q) => {
              return {
                selected: false,
                quiz_id: quiz_id,
                subject_id: data?.subject_id ?? null,
                difficulty_level: data?.difficulty_level ?? "medium",
                points: 1,
                different_incorrect_msg: methods?.watch("generate_incorrect_msg") ? true : false,
                hint_enabled: methods?.watch("generate_hint_msg") ? true : false,
                answer_type: q?.answer_type,
                question_languages: [{
                  id: null,
                  language_id: res?.data?.quiz?.languages?.[0]?.term_id ?? null,
                  default: true,
                  question: q?.question,
                  correct_msg: q?.correct_msg ?? "",
                  incorrect_msg: q?.incorrect_msg ?? "",
                  hint_msg: q?.hint_msg ?? "",
                  answer_data: {
                    singleChoice: q?.answer_type === "singleChoice" ? q?.answer_data : getAnswerData("singleChoice"),
                    multipleChoice: q?.answer_type === "multipleChoice" ? q?.answer_data : getAnswerData("multipleChoice"),
                    trueFalse: q?.answer_type === "trueFalse" ? q?.answer_data : getAnswerData("trueFalse"),
                    freeChoice: q?.answer_type === "freeChoice" ? q?.answer_data : getAnswerData("freeChoice"),
                    sortingChoice: q?.answer_type === "sortingChoice" ? q?.answer_data : getAnswerData("sortingChoice"),
                    matrixSortingChoice: q?.answer_type === "matrixSortingChoice" ? q?.answer_data : getAnswerData("matrixSortingChoice"),
                    fillInTheBlank: q?.answer_type === "fillInTheBlank" ? q?.answer_data : getAnswerData("fillInTheBlank"),
                    numerical: q?.answer_type === "numerical" ? q?.answer_data : getAnswerData("numerical"),
                    rangeType: q?.answer_type === "rangeType" ? q?.answer_data : getAnswerData("rangeType"),
                    assessment: q?.answer_type === "assessment" ? q?.answer_data : getAnswerData("assessment"),
                  }
                }]
              }
            })], {
            shouldDirty: true,
          });
        }
        if (callback) callback();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || __("Failed to generate questions", "acadlix"));
        console.error(error);
        if (index == null) {
          methods.setValue("status", "Failed", {
            shouldDirty: true,
          });
        } else {
          methods.setValue(`advance_setting_chunks.${index}.status`, "Failed", {
            shouldDirty: true,
          });
        }
        if (callback) callback();
      }
    });
  }
  const handleSubmit = async () => {
    let data = {
      quiz_id: quiz_id,
      question_prompt: methods?.watch("question_prompt") ?? "",
      generate_correct_msg: methods?.watch("generate_correct_msg") ?? false,
      generate_incorrect_msg: methods?.watch("generate_incorrect_msg") ?? false,
      generate_hint_msg: methods?.watch("generate_hint_msg") ?? false,
      enable_source_content: methods?.watch("enable_source_content") ?? false,
      source_content: methods?.watch("source_content") ?? "",
      difficulty_level: "medium",
      subject: "Uncategorized",
      subject_id: null,
      question_type: "singleChoice",
      answer_options: 4,
      number_of_questions: 5,
    }

    if (methods?.watch("enable_advanced_settings") && methods?.watch("advance_setting_chunks")?.length > 0) {
      const advance_setting_chunks = methods?.watch("advance_setting_chunks") ?? [];
      for (let i = 0; i < advance_setting_chunks?.length; i++) {
        const chunk = advance_setting_chunks[i];
        data.subject = chunk?.subject?.subject_name ?? "Uncategorized";
        data.subject_id = chunk?.subject?.id ?? null;
        data.difficulty_level = chunk?.difficulty_level ?? "medium";
        data.question_type = chunk?.question_type ?? "singleChoice";
        data.answer_options = chunk?.answer_options ?? 4;
        data.number_of_questions = chunk?.number_of_questions ?? 5;

        await new Promise((resolve) => {
          handleGenerateQuestions(
            data,
            i,
            () => resolve());
        });
      }
    } else {
      await new Promise((resolve) => {
        handleGenerateQuestions(
          data,
          null,
          () => resolve());
      });
    }
  }

  const handleRetryGenerationFailedChunk = async () => {
    let data = {
      quiz_id: quiz_id,
      question_prompt: methods?.watch("question_prompt") ?? "",
      generate_correct_msg: methods?.watch("generate_correct_msg") ?? false,
      generate_incorrect_msg: methods?.watch("generate_incorrect_msg") ?? false,
      generate_hint_msg: methods?.watch("generate_hint_msg") ?? false,
      enable_source_content: methods?.watch("enable_source_content") ?? false,
      source_content: methods?.watch("source_content") ?? "",
      difficulty_level: "medium",
      subject: "Uncategorized",
      subject_id: null,
      question_type: "singleChoice",
      answer_options: 4,
      number_of_questions: 5,
    };

    if (methods?.watch("advance_setting_chunks")?.filter((chunk => chunk?.status === "Failed"))?.length > 0) {
      const advance_setting_chunks = methods?.watch("advance_setting_chunks") ?? [];
      for (let i = 0; i < advance_setting_chunks?.length; i++) {
        if (advance_setting_chunks[i]?.status !== "Failed") continue;
        const chunk = advance_setting_chunks[i];
        data.subject = chunk?.subject?.subject_name ?? "Uncategorized";
        data.subject_id = chunk?.subject?.id ?? null;
        data.difficulty_level = chunk?.difficulty_level ?? "medium";
        data.question_type = chunk?.question_type ?? "singleChoice";
        data.answer_options = chunk?.answer_options ?? 4;
        data.number_of_questions = chunk?.number_of_questions ?? 5;

        await new Promise((resolve) => {
          handleGenerateQuestions(
            data,
            i,
            () => resolve());
        });
      }
    } else if (methods?.watch("status") === "Failed") {
      await new Promise((resolve) => {
        handleGenerateQuestions(
          data,
          null,
          () => resolve());
      });
    }
  }

  if (process.env.REACT_APP_MODE == 'development') {
    console.log(methods?.watch());
  }

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 4 }} sx={{
        padding: {
          xs: 2,
          sm: 4,
        }
      }}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size='medium'
            sx={{
              width: "fit-content",
            }}
            component={Link}
            to={`/${quiz_id}/question`}
          >
            {__("Back to Questions", "acadlix")}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card>
            <CardHeader
              title={
                sprintf(
                  /* translators: %s is the quiz title */
                  __("Generate Question(s) with AI (%s)", "acadlix"),
                  methods?.watch("quiz_title") ?? ""
                )
              }
            />
            <CardContent>
              <form onSubmit={methods?.handleSubmit(handleSubmit)}>
                <Grid container spacing={{ xs: 2, sm: 2 }}>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Alert severity="info">
                      <AlertTitle><strong>Quick Start Guide</strong></AlertTitle>
                      <ul style={{ margin: 0, }}>
                        <li><strong>Define:</strong> Enter a prompt or toggle <strong>Source Code</strong> to provide text.</li>
                        <li><strong>Enhance:</strong> Enable <strong>Messages & Hints</strong> for auto-generated feedback.</li>
                        <li><strong>Scale:</strong> Use <strong>Advanced Settings</strong> to add multiple "Chunks" (e.g., 5 Easy + 10 Hard questions).</li>
                      </ul>
                    </Alert>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <CustomTypography>
                      {__("Question generation prompt", "acadlix")}
                    </CustomTypography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <CustomTextField
                      {...methods.register("question_prompt")}
                      multiline
                      minRows={4}
                      placeholder={__("E.g. Generate 5 multiple choice questions for the topic 'Photosynthesis' with difficulty level 'Medium'.", "acadlix")}
                      fullWidth
                      onChange={(e) => {
                        methods.setValue("question_prompt", e.target.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <CustomTypography>
                      {__("Generate correct message", "acadlix")}
                    </CustomTypography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControlLabel
                      control={
                        <CustomSwitch />
                      }
                      checked={methods?.watch("generate_correct_msg") ?? false}
                      onChange={(e) => {
                        methods?.setValue("generate_correct_msg", e?.target?.checked, {
                          shouldDirty: true,
                        });
                      }}
                      label={__("Activate", "acadlix")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <CustomTypography>
                      {__("Generate incorrect message", "acadlix")}
                    </CustomTypography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControlLabel
                      control={
                        <CustomSwitch />
                      }
                      checked={methods?.watch("generate_incorrect_msg") ?? false}
                      onChange={(e) => {
                        methods?.setValue("generate_incorrect_msg", e?.target?.checked, {
                          shouldDirty: true,
                        });
                      }}
                      label={__("Activate", "acadlix")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <CustomTypography>
                      {__("Generate hint message", "acadlix")}
                    </CustomTypography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControlLabel
                      control={
                        <CustomSwitch />
                      }
                      checked={methods?.watch("generate_hint_msg") ?? false}
                      onChange={(e) => {
                        methods?.setValue("generate_hint_msg", e?.target?.checked, {
                          shouldDirty: true,
                        });
                      }}
                      label={__("Activate", "acadlix")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTypography>
                      {__("Enable source content", "acadlix")}
                    </CustomTypography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControlLabel
                      control={
                        <CustomSwitch />
                      }
                      checked={methods?.watch("enable_source_content") ?? false}
                      onChange={(e) => {
                        methods?.setValue("enable_source_content", e?.target?.checked, {
                          shouldDirty: true,
                        });
                      }}
                      label={__("Activate", "acadlix")}
                    />
                  </Grid>
                  <Grid size={{ xs: 0, sm: 0, md: 6 }} sx={{
                    display: { xs: "none", sm: "none", md: "block" },
                  }} />
                  <Grid size={{ xs: 12, sm: 12, md: 12 }}
                    sx={{
                      display: methods?.watch("enable_source_content") ? "flex" : "none",
                    }}
                  >
                    <CustomTextField
                      {...methods.register("source_content")}
                      multiline
                      minRows={4}
                      placeholder={__("Enter your source content here", "acadlix")}
                      fullWidth
                      onChange={(e) => {
                        methods.setValue("source_content", e.target.value, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTypography>
                      {__("Enable Advanced Settings", "acadlix")}
                    </CustomTypography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControlLabel
                      control={
                        <CustomSwitch />
                      }
                      checked={methods?.watch("enable_advanced_settings") ?? false}
                      onChange={(e) => {
                        methods?.setValue("enable_advanced_settings", e?.target?.checked, {
                          shouldDirty: true,
                        });
                      }}
                      label={__("Activate", "acadlix")}
                    />
                  </Grid>
                  <Grid size={{ xs: 0, sm: 0, md: 6 }} sx={{
                    display: { xs: "none", sm: "none", md: "block" },
                  }} />
                  {
                    methods?.watch("enable_advanced_settings") && (
                      <React.Fragment>
                        {
                          methods?.watch("advance_setting_chunks")?.length > 0 && (
                            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                              <Grid container spacing={2} sx={{
                                alignItems: "center",
                              }}>
                                {
                                  methods?.watch("advance_setting_chunks")?.map((chunk, index) => (
                                    <SingleAdvancedSettingChunk
                                      key={index}
                                      index={index}
                                      {...methods}
                                    />
                                  ))
                                }
                              </Grid>
                            </Grid>
                          )}
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleAddAdvancedSettingChunk}
                          >
                            {__("Add More", "acadlix")}
                          </Button>
                        </Grid>
                      </React.Fragment>
                    )
                  }
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      loading={generateQuestionsMutation?.isPending}
                    >
                      {__("Generate Questions", "acadlix")}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card>
            <CardHeader
              title={__("Preview Generated Questions", "acadlix")}
            />
            <CardContent>
              <PreviewGeneratedQuestions
                {...methods}
                getAnswerType={getAnswerType}
                quiz_id={quiz_id}
                handleRetryGenerationFailedChunk={handleRetryGenerationFailedChunk}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box >
  )
}

export default AddQuestionWithAi

const SingleAdvancedSettingChunk = (props) => {
  const [input, setInput] = React.useState("");

  const createSubjectMutation = PostCreateSubject();
  const createSubject = (index) => {
    if (input) {
      if (
        props.watch("subjects")?.filter(
          (d) => d?.subject_name?.toLowerCase() === input?.toLowerCase()
        )?.length > 0
      ) {
        props?.setError(`advance_setting_chunks.${index}.subject`, {
          type: "custom",
          message: __("Subject name is already exist", "acadlix"),
        });
      } else {
        createSubjectMutation.mutate(
          { subject_name: input },
          {
            onSuccess: (data) => {
              props?.clearErrors(`advance_setting_chunks.${props.index}.subject`);
              props?.setValue("subjects", data?.data?.subjects, { shouldDirty: true });
              props?.setValue(`advance_setting_chunks.${props.index}.subject`,
                data?.data?.subjects?.find((s) => s?.id === data?.data?.subject_id) ?? null,
                {
                  shouldDirty: true,
                }
              );
              setInput("");
            },
          }
        );
      }
    } else {
      props?.setError(`advance_setting_chunks.${props.index}.subject`, {
        type: "custom",
        message: __("Subject cannot be empty", "acadlix"),
      });
    }
  };

  const handleDuplicateAdvancedSettingChunk = (index) => {
    const advance_setting_chunks = props.watch("advance_setting_chunks") ?? [];
    const chunkToDuplicate = advance_setting_chunks?.[index];
    if (chunkToDuplicate) {
      const newChunks = [...advance_setting_chunks.slice(0, index + 1), chunkToDuplicate, ...advance_setting_chunks.slice(index + 1)];
      props.setValue("advance_setting_chunks", newChunks, {
        shouldDirty: true,
      });
    }
  }

  const handleRemoveAdvancedSettingChunk = (index) => {
    const advance_setting_chunks = props.watch("advance_setting_chunks") ?? [];
    // setInput(""); // Clear input state when removing chunk
    props.setValue("advance_setting_chunks", advance_setting_chunks?.filter((_, i) => i !== index), {
      shouldDirty: true,
    });
  }

  return (
    <React.Fragment>
      <Grid size={{ xs: 12, sm: 1, md: 5 / 10 }}>
        <Tooltip title={__("Duplicate", "acadlix")} arrow>
          <IconButton
            size="small"
            color="primary"
            onClick={handleDuplicateAdvancedSettingChunk.bind(null, props.index)}
          >
            <TbCopyCheckFilled style={{ fontSize: "1.25rem" }} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid size={{ xs: 12, sm: 11 / 3, md: 22 / 10 }}>
        <Autocomplete
          {
          ...props.register(`advance_setting_chunks.${props.index}.subject`, {
            required: {
              value: true,
              message: __("Subject is required", "acadlix"),
            },
          })
          }
          fullWidth
          size="small"
          value={
            props.watch(`advance_setting_chunks.${props.index}.subject`) ?? null
          }
          options={props.watch("subjects") ? props.watch("subjects") : []}
          getOptionLabel={(option) => option?.subject_name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.id === value?.id
          }
          freeSolo
          inputValue={input}
          onInputChange={(_, newInput) => {
            setInput(newInput);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              // onChange={(e) => setInput(e.target.value)}
              label={__("Select Subject *", "acadlix")}
              error={!!props?.formState?.errors?.advance_setting_chunks?.[props.index]?.subject}
              helperText={props?.formState?.errors?.advance_setting_chunks?.[props.index]?.subject?.message}
              onKeyDown={(e) => {
                if (e?.key === 'Enter') {
                  e.preventDefault();
                  createSubject(props.index)
                }
              }}
              slotProps={{
                input: {
                  ...params.InputProps,
                  autoComplete: "subject",
                  endAdornment: (
                    <React.Fragment>
                      {createSubjectMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }
              }}
            />
          )}
          onChange={(_, newValue) => {
            props?.clearErrors(`advance_setting_chunks.${props.index}.subject`);
            props?.setValue(`advance_setting_chunks.${props.index}.subject`, newValue ?? null, {
              shouldDirty: true,
            });
          }}
          PaperComponent={(data) => {
            return (
              <Paper>
                {data?.children}
                <Button
                  color="primary"
                  fullWidth
                  disabled={!hasCapability("acadlix_add_subject")}
                  sx={{ justifyContent: "flex-start", pl: 2 }}
                  onMouseDown={createSubject.bind(null, props.index)}
                >
                  {__("Add New", "acadlix")}
                </Button>
              </Paper>
            );
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 11 / 3, md: 22 / 10 }}>
        <FormControl
          fullWidth
          size="small"
        >
          <InputLabel id="difficulty-level-label">
            {__("Difficulty Level *", "acadlix")}
          </InputLabel>
          <Select
            {
            ...props.register(`advance_setting_chunks.${props.index}.difficulty_level`, {
              required: {
                value: true,
                message: __("Difficulty level is required", "acadlix"),
              },
            })
            }
            labelId="difficulty-level-label"
            id="difficulty-level-select"
            label={__("Difficulty Level *", "acadlix")}
            value={props.watch(`advance_setting_chunks.${props.index}.difficulty_level`)}
            onChange={(e) => {
              props?.setValue(`advance_setting_chunks.${props.index}.difficulty_level`, e?.target?.value, {
                shouldDirty: true,
              });
            }}
          >
            <MenuItem value="easy">{__("Easy", "acadlix")}</MenuItem>
            <MenuItem value="medium">{__("Medium", "acadlix")}</MenuItem>
            <MenuItem value="hard">{__("Hard", "acadlix")}</MenuItem>
            <MenuItem value="expert">{__("Expert", "acadlix")}</MenuItem>
          </Select>
          {
            !!props?.formState?.errors?.advance_setting_chunks?.[props.index]?.difficulty_level && (
              <FormHelperText error>
                {props?.formState?.errors?.advance_setting_chunks?.[props.index]?.difficulty_level?.message}
              </FormHelperText>
            )
          }
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 11 / 3, md: 22 / 10 }}>
        <FormControl
          fullWidth
          size="small"
        >
          <InputLabel id="question-type-label">
            {__("Question Type *", "acadlix")}
          </InputLabel>
          <Select
            {
            ...props.register(`advance_setting_chunks.${props.index}.question_type`, {
              required: {
                value: true,
                message: __("Question type is required", "acadlix"),
              },
            })
            }
            labelId="question-type-label"
            id="question-type-select"
            label={__("Question Type *", "acadlix")}
            value={props.watch(`advance_setting_chunks.${props.index}.question_type`)}
            onChange={(e) => {
              props?.setValue(`advance_setting_chunks.${props.index}.question_type`, e?.target?.value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          >
            <MenuItem value="singleChoice">{__("Single Choice", "acadlix")}</MenuItem>
            <MenuItem value="multipleChoice">{__("Multiple Choice", "acadlix")}</MenuItem>
            <MenuItem value="trueFalse">{__("True/False", "acadlix")}</MenuItem>
            <MenuItem value="freeChoice">{__("Free Choice", "acadlix")}</MenuItem>
            <MenuItem value="sortingChoice">{__("Sorting Choice", "acadlix")}</MenuItem>
            <MenuItem value="matrixSortingChoice">{__("Matrix Sorting Choice", "acadlix")}</MenuItem>
            <MenuItem value="fillInTheBlank">{__("Fill in the Blank", "acadlix")}</MenuItem>
            {
              acadlixOptions?.isActive && (
                <>
                  <MenuItem value="numerical">{__("Numerical", "acadlix")}</MenuItem>
                  <MenuItem value="rangeType">{__("Range Type", "acadlix")}</MenuItem>
                  <MenuItem value="assessment">{__("Assessment", "acadlix")}</MenuItem>
                </>
              )
            }
          </Select>
          {
            !!props?.formState?.errors?.advance_setting_chunks?.[props.index]?.question_type && (
              <FormHelperText error>
                {props?.formState?.errors?.advance_setting_chunks?.[props.index]?.question_type?.message}
              </FormHelperText>
            )
          }
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 11 / 2, md: 22 / 10 }}>
        <CustomTextField
          {
          ...props.register(`advance_setting_chunks.${props.index}.answer_options`, {
            required: {
              value: ["singleChoice", "multipleChoice", "freeChoice", "sortingChoice", "matrixSortingChoice"].includes(props.watch(`advance_setting_chunks.${props.index}.question_type`)),
              message: __("Answer Options is required", "acadlix"),
            },
            min: {
              value: ["singleChoice", "multipleChoice", "freeChoice", "sortingChoice", "matrixSortingChoice"].includes(props.watch(`advance_setting_chunks.${props.index}.question_type`)) ? 2 : undefined,
              message: __("Answer Options must be at least 2", "acadlix"),
            },
            max: {
              value: ["singleChoice", "multipleChoice", "freeChoice", "sortingChoice", "matrixSortingChoice"].includes(props.watch(`advance_setting_chunks.${props.index}.question_type`)) ? 26 : undefined,
              message: __("Answer Options cannot be more than 26", "acadlix"),
            },
          }
          )}
          fullWidth
          size="small"
          label={__("Answer Options *", "acadlix")}
          type="number"
          InputProps={{
            inputProps: {
              step: 1,
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
          }}
          onKeyDown={(event) => {
            if (['e', 'E', '+', '-', '.'].includes(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={(e) => {
            props?.setValue(`advance_setting_chunks.${props.index}.answer_options`, e.target.value, {
              shouldDirty: true,
            });
          }}
          error={!!props?.formState?.errors?.advance_setting_chunks?.[props.index]?.answer_options}
          helperText={props?.formState?.errors?.advance_setting_chunks?.[props.index]?.answer_options?.message}
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 11 / 2, md: 22 / 10 }}>
        <CustomTextField
          {
          ...props.register(`advance_setting_chunks.${props.index}.number_of_questions`, {
            required: {
              value: true,
              message: __("Number of questions is required", "acadlix"),
            },
            min: {
              value: 1,
              message: __("Number of questions must be at least 1", "acadlix"),
            },
            max: {
              value: 25,
              message: __("Number of questions cannot be more than 25", "acadlix"),
            },
          }
          )}
          fullWidth
          size="small"
          label={__("No. of Questions *", "acadlix")}
          type="number"
          InputProps={{
            inputProps: {
              min: 1,
              max: 25,
              step: 1,
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
          }}
          onKeyDown={(event) => {
            if (['e', 'E', '+', '-', '.'].includes(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={(e) => {
            props?.setValue(`advance_setting_chunks.${props.index}.number_of_questions`, e.target.value, {
              shouldDirty: true,
            });
          }}
          error={!!props?.formState?.errors?.advance_setting_chunks?.[props.index]?.number_of_questions}
          helperText={props?.formState?.errors?.advance_setting_chunks?.[props.index]?.number_of_questions?.message}
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 1, md: 5 / 10 }}>
        <Tooltip title={__("Remove", "acadlix")} arrow>
          <IconButton
            size="small"
            color="error"
            onClick={handleRemoveAdvancedSettingChunk.bind(null, props.index)}
          >
            <FaTrash />
          </IconButton>
        </Tooltip>
      </Grid>
    </React.Fragment>
  )
}

const PreviewGeneratedQuestions = (props) => {

  const answerType = (answer_type, answer_data, lang_index) => {
    switch (answer_type) {
      case "singleChoice":
        return (
          <ValidateSingleChoice
            type="singleChoice"
            answer_data={answer_data}
            lang_index={lang_index}
          />);
      case "multipleChoice":
        return (
          <ValidateMultipleChoice
            type="multipleChoice"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "trueFalse":
        return (
          <ValidateTrueFalse
            type="trueFalse"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "freeChoice":
        return (
          <ValidateFreeChoice
            type="freeChoice"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "sortingChoice":
        return (
          <ValidateSortingChoice
            type="sortingChoice"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "matrixSortingChoice":
        return (
          <ValidateMatrixSortingChoice
            type="matrixSortingChoice"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "fillInTheBlank":
        return (
          <ValidateFillInTheBlank
            type="fillInTheBlank"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "numerical":
        return (
          <ValidateNumerical
            type="numerical"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      case "rangeType":
        return (
          <ValidateRangeType
            type="rangeType"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      // case "paragraph":
      //   return (
      //     <ValidateParagraph
      //       type="paragraph"
      //       answer_data={answer_data}
      //       lang_index={lang_index}
      //     />
      //   )
      case "assessment":
        return (
          <ValidateAssessment
            type="assessment"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
      default:
        return (
          <ValidateSingleChoice
            type="singleChoice"
            answer_data={answer_data}
            lang_index={lang_index}
          />
        )
    }
  };

  const handleSelectAll = () => {
    props?.setValue("questions", props?.watch("questions")?.map((q) => {
      return {
        ...q,
        selected: true,
      }
    }), {
      shouldDirty: true,
    });
  }

  const handleDeselectAll = () => {
    props?.setValue("questions", props?.watch("questions")?.map((q) => {
      return {
        ...q,
        selected: false,
      }
    }), {
      shouldDirty: true,
    });
  }

  const handleRemoveAll = () => {
    if (confirm(__("Are you sure you want to remove all generated questions?", "acadlix"))) {
      props?.setValue("questions", [], {
        shouldDirty: true,
      });
      props?.setValue("status", "Idle", {
        shouldDirty: true,
      });
      props?.setValue("advance_setting_chunks", props?.watch("advance_setting_chunks")?.map((chunk) => {
        return {
          ...chunk,
          status: "Idle",
        }
      }), {
        shouldDirty: true,
      });
    }
  }

  const removeQuestionByIndex = (index) => {
    props?.setValue("questions", props?.watch("questions")?.filter((_, i) => i !== index), {
      shouldDirty: true,
    });
  }

  const uploadAiQuestionMutation = PostUploadAiQuestions(props?.quiz_id);
  const navigate = useNavigate();
  const handleUploadQuestion = () => {
    const data = props?.watch("questions")?.filter((q) => q?.selected);
    uploadAiQuestionMutation.mutate({
      questions: data
    }, {
      onSuccess: (data) => {
        // console.log(data);
        navigate(`/${props?.quiz_id}/question`);
      },
      onError: (error) => {
        console.error(error);
      }
    }
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 12 }}>
        <List>
          {
            ["Generating", "Generated", "Failed"].includes(props?.watch("status")) && (
              <ListItem sx={{
                marginBottom: 0,
                paddingY: 1
              }}>
                <ListItemIcon sx={{
                  minWidth: '25px',
                }}>
                  {
                    props?.watch("status") === 'Generating' && <CircularProgress size={15} />
                  }
                  {
                    props?.watch("status") === 'Generated' && <Avatar sx={{
                      width: 16,
                      height: 16,
                      bgcolor: (theme) => theme.palette.success.main,
                    }}>
                      <TiTick />
                    </Avatar>
                  }
                  {
                    props?.watch("status") === 'Failed' && <Avatar sx={{
                      width: 16,
                      height: 16,
                      bgcolor: (theme) => theme.palette.error.main,
                    }}>
                      <RxCross2 />
                    </Avatar>
                  }
                </ListItemIcon>
                <ListItemText
                  primary={`${props?.watch("status")} ${__("chunk", "acadlix")}`}
                  sx={{
                    marginY: 0
                  }}
                />
              </ListItem>
            )
          }
          {
            props?.watch("advance_setting_chunks")?.length > 0 &&
            props?.watch("advance_setting_chunks")?.map((chunk, index) => (
              <ListItem key={index} sx={{
                marginBottom: 0,
                paddingY: 1,
                display: ["Generating", "Generated", "Failed"].includes(chunk?.status) ? "" : "none",
              }}>
                <ListItemIcon sx={{
                  minWidth: '25px',
                }}>
                  {
                    chunk?.status === 'Generating' && <CircularProgress size={15} />
                  }
                  {
                    chunk?.status === 'Generated' && <Avatar sx={{
                      width: 16,
                      height: 16,
                      bgcolor: (theme) => theme.palette.success.main,
                    }}>
                      <TiTick />
                    </Avatar>
                  }
                  {
                    chunk?.status === 'Failed' && <Avatar sx={{
                      width: 16,
                      height: 16,
                      bgcolor: (theme) => theme.palette.error.main,
                    }}>
                      <RxCross2 />
                    </Avatar>
                  }
                </ListItemIcon>
                <ListItemText
                  primary={`${chunk?.status} ${__("chunk", "acadlix")}` + ` ${index + 1} ` + __("of", "acadlix") + ` ${props?.watch('advance_setting_chunks')?.length}`}
                  sx={{
                    marginY: 0
                  }}
                />
              </ListItem>
            ))
          }
        </List>
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        {
          props?.watch("questions")?.length > 0 &&
          props?.watch("questions")?.map((question, index) => (
            <Card key={index} sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    gap: 1
                  }}
                >
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        checked={props?.watch(`questions.${index}.selected`) || false}
                        onChange={(e) => {
                          props?.setValue(`questions.${index}.selected`, e?.target?.checked, { shouldDirty: true });
                        }}
                      />
                    }
                    sx={{
                      mr: 0,
                    }}
                  />
                  <Typography variant="h6">
                    {`Q${index + 1}`}
                  </Typography>
                  <Chip
                    label={props?.getAnswerType(question?.answer_type)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 1,
                }}>
                  <Tooltip title={__("Remove Question from List", "acadlix")} arrow>
                    <IconButton
                      aria-label="remove-question-from-list"
                      size="small"
                      color="error"
                      onClick={removeQuestionByIndex.bind(this, index)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box>
                {question?.question_languages?.map((lang, lIndex) => (
                  <Box key={lIndex} sx={{ mb: 2 }}>
                    {
                      question?.paragraph_enabled && question?.paragraph_id !== null &&
                      <Box>
                        <Typography component="div">
                          <CustomLatex>
                            {lang?.paragraph || ""}
                          </CustomLatex>
                        </Typography>
                        <Divider />
                      </Box>
                    }
                    <Typography component="div">
                      <CustomLatex>
                        {lang?.question || ""}
                      </CustomLatex>
                    </Typography>
                    <Box>
                      {/* handle answer data here  */}
                      {answerType(
                        question?.answer_type,
                        lang?.answer_data?.[question?.answer_type] || {},
                        lIndex
                      )}
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          display: lang?.hint_msg?.length > 0 ? "" : "none",
                          py: 1,
                        }}
                      >
                        <Typography variant='h6'>
                          {__("Hint:", "acadlix")}
                        </Typography>
                        <Typography component="div">
                          <CustomLatex>
                            {lang?.hint_msg || ""}
                          </CustomLatex>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: lang?.correct_msg?.length > 0 ? "" : "none",
                          py: 1,
                        }}
                      >
                        <Typography variant='h6'>
                          {__("Correct Exp:", "acadlix")}
                        </Typography>
                        <Typography component="div">
                          <CustomLatex>
                            {lang?.correct_msg || ""}
                          </CustomLatex>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: lang?.incorrect_msg?.length > 0 ? "" : "none",
                          py: 1,
                        }}
                      >
                        <Typography variant='h6'>
                          {__("Incorrect Exp:", "acadlix")}
                        </Typography>
                        <Typography component="div">
                          <CustomLatex>
                            {lang?.incorrect_msg || ""}
                          </CustomLatex>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          ))
        }
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}>
          <Button size='small' variant="outlined" color="primary"
            onClick={handleSelectAll}
          >
            {sprintf(
              /* translators: 1: number of selected questions, 2: total number of questions */
              __("Select All (%1$d / %2$d)", "acadlix"),
              props?.watch("questions")?.filter((q) => q?.selected)?.length || 0,
              props?.watch("questions")?.length || 0
            )}
          </Button>
          <Button size='small' variant="outlined" color="primary" onClick={handleDeselectAll}>
            {__("Deselect All", "acadlix")}
          </Button>
          <Button size='small' variant="outlined" color="primary" onClick={handleRemoveAll}>
            {__("Remove All", "acadlix")}
          </Button>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }} >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <Button
            variant="contained"
            type="submit"
            onClick={handleUploadQuestion}
            loading={uploadAiQuestionMutation?.isPending}
            disabled={props?.watch("questions")?.filter((q) => q?.selected)?.length === 0}
          >
            {__("Save Changes", "acadlix")}
          </Button>
          {
            (props?.watch("status") === "Failed" || props?.watch("advance_setting_chunks")?.filter((chunk) => chunk?.status === "Failed")?.length > 0) && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={props?.handleRetryGenerationFailedChunk}
              >
                {__("Retry Generation(failed)", "acadlix")}
              </Button>
            )
          }
        </Box>
      </Grid>
    </Grid>
  )
}