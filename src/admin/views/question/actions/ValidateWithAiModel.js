import { FaEdit, FaTrash, IoClose, RxCross2, TiTick } from '@acadlix/helpers/icons'
import { Alert, Avatar, Box, Button, Card, Checkbox, Chip, CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { useForm } from 'react-hook-form'
import CustomLatex from '@acadlix/modules/latex/CustomLatex'
import ValidateSingleChoice from './validate_answer_types/ValidateSingleChoice'
import ValidateMultipleChoice from './validate_answer_types/ValidateMultipleChoice'
import ValidateTrueFalse from './validate_answer_types/ValidateTrueFalse'
import ValidateFreeChoice from './validate_answer_types/ValidateFreeChoice'
import ValidateSortingChoice from './validate_answer_types/ValidateSortingChoice'
import ValidateMatrixSortingChoice from './validate_answer_types/ValidateMatrixSortingChoice'
import ValidateFillInTheBlank from './validate_answer_types/ValidateFillInTheBlank'
import ValidateNumerical from './validate_answer_types/ValidateNumerical'
import ValidateAssessment from './validate_answer_types/ValidateAssessment'
import ValidateRangeType from './validate_answer_types/ValidateRangeType'
import CustomSwitch from '@acadlix/components/CustomSwitch'
import toast from 'react-hot-toast'
import { capitalizeFirstLetter } from '@acadlix/helpers/util'
import { PostValidateQuestions } from '@acadlix/requests/ai/AiCommonRequest'
import { GetQuestionByIds, PostBulkUpdateQuestionsAI } from '@acadlix/requests/admin/AdminQuestionRequest'

const ValidateWithAiModel = (props) => {
  const chunkLength = 15;
  const methods = useForm({
    defaultValues: {
      incomming_question_ids: props?.watch('question_ids') || [],
      quiz_id: props?.quiz_id || '',
      question_ids: [],
      questions: [],
      chunks: []
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

  const getQuestions = GetQuestionByIds(
    props?.quiz_id || '',
    props?.watch('question_ids') || []
  );

  const handleAIValidationData = (data, chunk_index) => {
    // Process AI validation data here
    methods?.setValue(
      `chunks.${chunk_index}.question`,
      methods?.watch(`chunks.${chunk_index}.question`)?.map((q, qIndex) => {
        const aiFeedback = data?.find(f => f.id === q.id) || {};
        return {
          ...q,
          status: aiFeedback?.status || 'Unverified',
          feedback: aiFeedback?.feedback || '',
          question_languages: q?.question_languages?.map((lang, lIndex) => ({
            ...lang,
            ai_answer_data: aiFeedback?.ai_answer_data || [],
            ai_question: aiFeedback?.ai_question || "",
            ai_correct_msg: lang?.correct_msg ? aiFeedback?.ai_correct_msg || "" : "",
            ai_incorrect_msg: lang?.incorrect_msg ? aiFeedback?.ai_incorrect_msg || "" : "",
            ai_hint_msg: lang?.hint_msg ? aiFeedback?.ai_hint_msg || "" : "",
          })) || [],
        };
      }),
      { shouldDirty: true }
    );

    console.log(
      methods?.watch(`chunks.${chunk_index}.question`)
    );
  }

  const questionValidateMutation = PostValidateQuestions();

  const handleQuestionValidation = (data, index, callback) => {
    // Set status to processing
    methods?.setValue(
      `chunks.${index}.status`,
      'processing',
      { shouldDirty: true }
    );

    questionValidateMutation?.mutate(data, {
      onSuccess: (res) => {
        // Handle success
        methods?.setValue(
          `chunks.${index}.status`,
          'success',
          { shouldDirty: true }
        );
        handleAIValidationData(res?.data?.feedback, index);
        if (callback) callback();
      },
      onError: (err) => {
        // Handle error
        methods?.setValue(
          `chunks.${index}.status`,
          'failed',
          { shouldDirty: true }
        );
        if (callback) callback();
      }
    })
  }

  const handleRetryValidation = async () => {
    // Retry validation for failed chunks
    const chunks = methods?.watch('chunks')?.filter(chunk => chunk.status === 'failed') || [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      await new Promise((resolve) => {
        handleQuestionValidation(
          {
            questions: chunk?.question || [],
          },
          i,
          () => resolve()
        );
      });
    }
  }


  useEffect(() => {
    if (getQuestions?.data?.data?.questions?.length > 0) {
      const question = getQuestions?.data?.data?.questions?.map(q => ({
        id: q?.id,
        answer_type: q?.answer_type,
        answer_type_label: getAnswerType(q?.answer_type),
        subject_name: q?.subject?.subject_name || '',
        difficulty_level: q?.difficulty_level,
        paragraph_enabled: Boolean(q?.paragraph_enabled),
        paragraph_id: q?.paragraph_id || null,
        question_languages: q?.question_languages?.map(lang => ({
          id: lang?.id,
          paragraph:
            q?.paragraph?.rendered_metas?.language_data?.find(
              (p) => p?.language_id === lang?.language_id
            )?.content ?? ""
            ?? "",
          answer_data: lang?.answer_data,
          question: lang?.question,
          correct_msg: lang?.correct_msg,
          incorrect_msg: lang?.incorrect_msg,
          hint_msg: lang?.hint_msg,
          ai_answer_data: [],
          ai_question: "",
          ai_correct_msg: "",
          ai_incorrect_msg: "",
          ai_hint_msg: "",
        })) || [],
        status: "Unverified", // Unverified, Valid, Flagged, Invalied
        feedback: "", // Feedback from AI model
      }))
        || [];
      const totalPages = Math.ceil(question?.length / chunkLength);
      const chunks = Array.from({ length: totalPages }, (_, index) => {
        return {
          index: index,
          status: 'pending', // pending, processing, success, failed
          question: question?.slice(index * chunkLength, index * chunkLength + chunkLength)
        };
      });
      methods?.setValue('chunks', chunks, { shouldDirty: true });

      // Process chunks sequentially
      const processChunksSequentially = async () => {
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          await new Promise((resolve) => {
            handleQuestionValidation(
              {
                questions: chunk?.question || [],
              },
              i,
              () => resolve()
            );
          });
        }
      };

      processChunksSequentially();
    }
  }, [getQuestions?.data?.data]);

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

  const getAiChipColor = (status = "") => {
    switch (status) {
      case "Unverified":
        return "default";
      case "Pending":
        return "warning";
      case "Valid":
        return "success";
      case "Flagged":
        return "error";
      default:
        return "default";
    }
  };

  const handleSelectAll = () => {
    methods?.setValue(
      'question_ids',
      methods?.watch('chunks')?.flatMap(chunk => chunk?.question?.map(question => question?.id)) || [],
      { shouldDirty: true }
    );
  }

  const handleDeselectAll = () => {
    methods?.setValue(
      'question_ids',
      [],
      { shouldDirty: true }
    );
  }

  const removeQuestionById = (questionId) => {
    const updatedChunks = methods?.watch('chunks')?.map(chunk => ({
      ...chunk,
      question: chunk?.question?.filter(q => q?.id !== questionId)
    })) || [];
    methods?.setValue(
      'chunks',
      updatedChunks,
      { shouldDirty: true }
    );
    // Also remove from selected question_ids if present
    const updatedQuestionIds = methods?.watch('question_ids')?.filter(id => id !== questionId) || [];
    methods?.setValue(
      'question_ids',
      updatedQuestionIds,
      { shouldDirty: true }
    );
    // Also remove from incomming_question_ids to avoid re-fetching
    const updatedIncommingQuestionIds = methods?.watch('incomming_question_ids')?.filter(id => id !== questionId) || [];
    methods?.setValue(
      'incomming_question_ids',
      updatedIncommingQuestionIds,
      { shouldDirty: true }
    );
  }

  const bulkUpdateMutation = PostBulkUpdateQuestionsAI(
    props?.quiz_id || ''
  );
  const handleSubmit = () => {
    // Prepare final questions data
    const question_ids = methods?.watch('question_ids') || [];
    if (question_ids.length === 0) {
      alert(__("Please select at least one question to save changes.", "acadlix"));
      return;
    }
    const finalQuestions = methods?.watch('chunks')?.flatMap(chunk => {
      let questions = [];
      if (Array.isArray(chunk?.question)) {
        questions = chunk?.question?.map(q => {
          if (question_ids.includes(q?.id)) {
            return {
              ...q,
              question_languages: q?.question_languages?.map(lang => {
                let answer_data = lang?.answer_data || {};
                // Merge ai_answer_data into answer_data based on answer_type
                if (Array.isArray(lang?.ai_answer_data) && lang?.ai_answer_data?.length > 0) {
                  answer_data[q?.answer_type] = lang?.ai_answer_data;
                } else if (typeof lang?.ai_answer_data === 'object' && Object.keys(lang?.ai_answer_data || {})?.length > 0) {
                  answer_data[q?.answer_type] = lang?.ai_answer_data;
                }
                return {
                  id: lang?.id,
                  paragraph: lang?.paragraph,
                  question: lang?.ai_question?.length > 0 ? lang?.ai_question : lang?.question,
                  answer_data: answer_data,
                  correct_msg: lang?.ai_correct_msg?.length > 0 ? lang?.ai_correct_msg : lang?.correct_msg,
                  incorrect_msg: lang?.ai_incorrect_msg?.length > 0 ? lang?.ai_incorrect_msg : lang?.incorrect_msg,
                  hint_msg: lang?.ai_hint_msg?.length > 0 ? lang?.ai_hint_msg : lang?.hint_msg,
                };
              }) || [],
            };
          }

        }) || [];
      }
      return questions;
    }) || [];

    bulkUpdateMutation?.mutate({
      questions: finalQuestions,
    }, {
      onSuccess: (res) => {
        toast.success(res?.data?.message || __('Questions updated successfully.', 'acadlix'));
        props?.handleValiadteAndRefresh();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || __('An error occurred while updating questions.', 'acadlix'));
        console.error(err);
      }
    });
  }
  // console.log(methods?.watch('chunks'));
  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {__("Validate Questions With AI", "acadlix")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Alert severity="warning">
              {__("Note: The validation process may take some time depending on the number of questions selected. Please be patient while the AI model processes the questions.", "acadlix")}
            </Alert>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            <List>
              {
                getQuestions?.isFetching && (
                  <ListItem sx={{
                    marginBottom: 0,
                    paddingY: 1
                  }}>
                    <ListItemIcon sx={{
                      minWidth: '25px',
                    }}>
                      <CircularProgress size={15} />
                    </ListItemIcon>
                    <ListItemText
                      primary={__("Creating chunks...", "acadlix")}
                      sx={{
                        marginY: 0
                      }}
                    />
                  </ListItem>
                )
              }
              {
                methods?.watch('chunks')?.length > 0 &&
                methods?.watch('chunks')?.map((chunk, index) => (
                  <ListItem key={index} sx={{
                    marginBottom: 0,
                    paddingY: 1
                  }}>
                    <ListItemIcon sx={{
                      minWidth: '25px',
                    }}>
                      {
                        chunk?.status === 'pending' && <CircularProgress size={15} />
                      }
                      {
                        chunk?.status === 'processing' && <CircularProgress size={15} />
                      }
                      {
                        chunk?.status === 'success' && <Avatar sx={{
                          width: 16,
                          height: 16,
                          bgcolor: (theme) => theme.palette.success.main,
                        }}>
                          <TiTick />
                        </Avatar>
                      }
                      {
                        chunk?.status === 'failed' && <Avatar sx={{
                          width: 16,
                          height: 16,
                          bgcolor: (theme) => theme.palette.error.main,
                        }}>
                          <RxCross2 />
                        </Avatar>
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={`${capitalizeFirstLetter(chunk?.status)} ${__("chunk", "acadlix")}` + ` ${index + 1} ` + __("of", "acadlix") + ` ${methods?.watch('chunks')?.length}`}
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

          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            {
              methods?.watch('chunks')?.length > 0 &&
              methods?.watch('chunks')?.map((chunk, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {
                    ['success', 'failed'].includes(chunk?.status) &&
                    chunk?.question?.length > 0 &&
                    chunk?.question?.map((question, qIndex) => (
                      <Card key={qIndex} sx={{ p: 2, mb: 2 }}>
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
                                  checked={methods?.watch('question_ids')?.includes(question?.id)}
                                  onChange={(e) => {
                                    const currentQuestionIds = methods?.watch('question_ids') || [];
                                    if (e?.target?.checked) {
                                      methods?.setValue(
                                        'question_ids',
                                        [...currentQuestionIds, question?.id],
                                        { shouldDirty: true }
                                      );
                                    } else {
                                      methods?.setValue(
                                        'question_ids',
                                        currentQuestionIds.filter(id => id !== question?.id),
                                        { shouldDirty: true }
                                      );
                                    }
                                  }}
                                />
                              }
                              sx={{
                                mr: 0,
                              }}
                            />
                            <Typography variant="h6">
                              {`Q${qIndex + index * chunkLength + 1}`}
                            </Typography>
                            <Chip
                              label={getAnswerType(question?.answer_type)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                            <Chip
                              label={question?.status}
                              size="small"
                              color={getAiChipColor(question?.status)}
                            />
                          </Box>
                          <Box sx={{
                            display: 'flex',
                            gap: 1,
                          }}>
                            <Tooltip title={__("Go to Question", "acadlix")}>
                              <IconButton
                                aria-label="go-to-question"
                                size="small"
                                color='primary'
                                href={`${acadlixOptions.adminQuizURL}#/${props?.quiz_id}/question/edit/${question?.id}`}
                                target='_blank'
                              >
                                <FaEdit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={__("Remove Question from List", "acadlix")} arrow>
                              <IconButton
                                aria-label="remove-question-from-list"
                                size="small"
                                color="error"
                                onClick={removeQuestionById.bind(this, question?.id)}
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
                        {
                          question?.status === 'Flagged' && (
                            <>
                              <Divider />
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">
                                  {__("AI Suggested Corrections", "acadlix")}
                                </Typography>
                                <Typography component="div">
                                  {question?.feedback || ""}
                                </Typography>
                              </Box>
                              <Box>
                                {question?.question_languages?.map((lang, lIndex) => (
                                  <Box key={lIndex} sx={{ mb: 2 }}>
                                    {/* {
                                  question?.paragraph_enabled && question?.paragraph_id !== null &&
                                  <Box>
                                    <Typography component="div">
                                      <CustomLatex>
                                        {lang?.paragraph || ""}
                                      </CustomLatex>
                                    </Typography>
                                    <Divider />
                                  </Box>
                                } */}
                                    <Box
                                      sx={{
                                        display: lang?.ai_question?.length > 0 ? "" : "none",
                                        py: 1,
                                      }}
                                    >
                                      <Typography variant='h6'>
                                        {__("AI Question:", "acadlix")}
                                      </Typography>
                                      <Typography component="div">
                                        <CustomLatex>
                                          {lang?.ai_question || ""}
                                        </CustomLatex>
                                      </Typography>
                                    </Box>
                                    <Box>
                                      <Box
                                        sx={{
                                          display: (Array.isArray(lang?.ai_answer_data) && lang?.ai_answer_data?.length > 0) ||
                                            (typeof lang?.ai_answer_data === 'object' && Object.keys(lang?.ai_answer_data || {})?.length > 0)
                                            ? "" : "none",
                                          py: 1,
                                        }}
                                      >
                                        <Typography variant='h6'>
                                          {__("AI Answer Data:", "acadlix")}
                                        </Typography>
                                        {/* handle answer data here  */}
                                        {answerType(
                                          question?.answer_type,
                                          lang?.ai_answer_data || {},
                                          lIndex
                                        )}
                                      </Box>
                                    </Box>
                                    <Box>
                                      <Box
                                        sx={{
                                          display: lang?.ai_hint_msg?.length > 0 ? "" : "none",
                                          py: 1,
                                        }}
                                      >
                                        <Typography variant='h6'>
                                          {__("AI Hint:", "acadlix")}
                                        </Typography>
                                        <Typography component="div">
                                          <CustomLatex>
                                            {lang?.ai_hint_msg || ""}
                                          </CustomLatex>
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: lang?.ai_correct_msg?.length > 0 ? "" : "none",
                                          py: 1,
                                        }}
                                      >
                                        <Typography variant='h6'>
                                          {__("AI Correct Exp:", "acadlix")}
                                        </Typography>
                                        <Typography component="div">
                                          <CustomLatex>
                                            {lang?.ai_correct_msg || ""}
                                          </CustomLatex>
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: lang?.ai_incorrect_msg?.length > 0 ? "" : "none",
                                          py: 1,
                                        }}
                                      >
                                        <Typography variant='h6'>
                                          {__("AI Incorrect Exp:", "acadlix")}
                                        </Typography>
                                        <Typography component="div">
                                          <CustomLatex>
                                            {lang?.ai_incorrect_msg || ""}
                                          </CustomLatex>
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            </>
                          )
                        }
                      </Card>
                    ))
                  }
                </Box>
              ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 2,
      }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}>
          <Button variant="outlined" color="primary" onClick={handleSelectAll} >
            {__("Select All", "acadlix")}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleDeselectAll}>
            {__("Deselect All", "acadlix")}
          </Button>
        </Box>
        <Box sx={{
          display: 'flex',
          gap: 2,
        }}>
          {
            methods?.watch('chunks')?.filter(chunk => chunk.status === 'failed')?.length > 0 && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={handleRetryValidation}
              >
                {__("Retry Validation", "acadlix")}
              </Button>
            )
          }
          <Button
            variant="contained"
            type="submit"
            onClick={methods?.handleSubmit(handleSubmit)}
            loading={bulkUpdateMutation?.isPending}
          >
            {__("Save Changes", "acadlix")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={props?.handleClose}
          >
            {__("Cancel", "acadlix")}
          </Button>
        </Box>
      </DialogActions>
    </>
  )
}

export default ValidateWithAiModel