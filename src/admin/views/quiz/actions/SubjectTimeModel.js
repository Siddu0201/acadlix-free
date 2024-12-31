import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React from "react";
import { IoClose } from "../../../../helpers/icons";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTextField from "../../../../components/CustomTextField";
import { useForm } from "react-hook-form";
import {
  GetSubjectByQuizId,
  PostSetSubjectWiseTime,
} from "../../../../requests/admin/AdminQuizRequest";

const SubjectTimeModel = (props) => {
  const methods = useForm({
    defaultValues: {
      quiz_id: props?.watch("quiz_id"),
      advance_mode_type: "",
      quiz_timing_type: "",
      subject_wise_question: false,
      optional_subject: false,
      subjects: [],
    },
  });
  const getSubject = GetSubjectByQuizId(props?.watch("quiz_id"));
  React.useEffect(() => {
    if (getSubject?.data?.data?.quiz) {
      methods?.setValue(
        "advance_mode_type",
        getSubject?.data?.data?.quiz?.advance_mode_type,
        { shouldDirty: true }
      );
      methods?.setValue(
        "quiz_timing_type",
        getSubject?.data?.data?.quiz?.quiz_timing_type === "subject_wise_time"
          ? "subject_wise_time"
          : "",
        { shouldDirty: true }
      );
      methods?.setValue(
        "subject_wise_question",
        getSubject?.data?.data?.quiz?.subject_wise_question,
        { shouldDirty: true }
      );
      methods?.setValue(
        "optional_subject",
        getSubject?.data?.data?.quiz?.optional_subject,
        { shouldDirty: true }
      );
    }

    if (getSubject?.data?.data?.subjects) {
      methods?.setValue("subjects", getSubject?.data?.data?.subjects, {
        shouldDirty: true,
      });
    }
  }, [getSubject?.data]);

  const setSubjectWiseTime = PostSetSubjectWiseTime();
  const handleSubmit = (data) => {
    setSubjectWiseTime?.mutate(data, {
      onSuccess: () => {
        props?.handleClose();
      },
    });
  };
  return (
    <>
      <DialogTitle id="alert-subject-title" sx={{ m: 0, p: 2 }}>
        Set Subject Wise Actions
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
      <DialogContent
        sx={{
          padding: "1rem !important",
        }}
      >
        {getSubject?.isFetching ? (
          <CircularProgress size={20} />
        ) : (
          <Grid container gap={4}>
            <Grid
              item
              xs={12}
              lg={12}
              sx={{
                display: ["jee"].includes(methods.watch("advance_mode_type"))
                  ? "none"
                  : "",
              }}
            >
              <FormControlLabel
                control={
                  <CustomSwitch
                    value="subject_wise_time"
                    checked={
                      methods?.watch("quiz_timing_type") ===
                        "subject_wise_time" ?? false
                    }
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        methods?.setValue(
                          "quiz_timing_type",
                          e?.target?.value,
                          {
                            shouldDirty: true,
                          }
                        );
                      } else {
                        methods?.setValue("quiz_timing_type", "", {
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                }
                label="Subject wise timing"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={methods?.watch("subject_wise_question") ?? false}
                    onChange={(e) => {
                      methods?.setValue(
                        "subject_wise_question",
                        e?.target?.checked,
                        {
                          shouldDirty: true,
                        }
                      );
                    }}
                  />
                }
                label="Subject wise specific number of questions"
              />
            </Grid>
            {/* <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={methods?.watch("optional_subject") ?? false}
                    onChange={(e) => {
                      methods?.setValue(
                        "optional_subject",
                        e?.target?.checked,
                        {
                          shouldDirty: true,
                        }
                      );
                    }}
                  />
                }
                label="Optional Subjects"
              />
            </Grid> */}
            <Grid item xs={12} lg={12}>
              <List dense component="div" role="list">
                {methods?.watch("subjects")?.length > 0 &&
                  methods?.watch("subjects")?.map((s, s_index) => (
                    <ListItem key={s_index} sx={{
                      gap: 2,
                    }}>
                      <ListItemText
                        primary={`${s?.subject_name} (${s?.number_of_question})`}
                      />
                      <CustomTextField
                        label="Time (in sec)"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={s?.time}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue === "" || /^[0-9]*$/.test(newValue)) {
                            methods?.setValue(
                              `subjects.${s_index}.time`,
                              newValue,
                              { shouldDirty: true }
                            );
                          }
                        }}
                        sx={{
                          display:
                            methods?.watch("quiz_timing_type") ===
                            "subject_wise_time"
                              ? ""
                              : "none",
                          maxWidth: "30%",
                          marginX: 2,
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                        }}
                      />
                      <CustomTextField
                        {...methods?.register(
                          `subjects.${s_index}.specific_number_of_questions`,
                          {
                            min: {
                              value: 0,
                              message: "Value should not be less than 0.",
                            },
                            max: {
                              value: s?.number_of_question,
                              message: `Value should not be more than ${s?.number_of_question}.`,
                            },
                          }
                        )}
                        label="No. of questions"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={s?.specific_number_of_questions}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue === "" || /^[0-9]*$/.test(newValue)) {
                            methods?.setValue(
                              `subjects.${s_index}.specific_number_of_questions`,
                              newValue,
                              { shouldDirty: true }
                            );
                          }
                        }}
                        error={Boolean(
                          methods?.formState?.errors?.subjects?.[s_index]
                            ?.specific_number_of_questions
                        )}
                        helperText={
                          methods?.formState?.errors?.subjects?.[s_index]
                            ?.specific_number_of_questions?.message
                        }
                        sx={{
                          display: methods?.watch("subject_wise_question")
                            ? ""
                            : "none",
                          maxWidth: "30%",
                          marginX: 2,
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={Boolean(s?.optional)}
                            onChange={(e) => {
                              methods?.setValue(
                                `subjects.${s_index}.optional`,
                                e?.target?.checked,
                                {
                                  shouldDirty: true,
                                }
                              );
                            }}
                          />
                        }
                        sx={{
                          display: methods?.watch("optional_subject")
                            ? ""
                            : "none",
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </Grid>
            <Grid item xs={12} lg={12}>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={props?.handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={methods?.handleSubmit(handleSubmit)}
                  disabled={setSubjectWiseTime?.isPending}
                >
                  {setSubjectWiseTime?.isPending ? "...loading" : "Save Change"}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </>
  );
};

export default SubjectTimeModel;
