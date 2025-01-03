import {
  Autocomplete,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "../../../../helpers/icons";
import CustomTextField from "../../../../components/CustomTextField";
import {
  GetSubjects,
  PostCreateSubject,
} from "../../../../requests/admin/AdminSubjectRequest";
import { useForm } from "react-hook-form";
import { PostSetSubjectAndPoint } from "../../../../requests/admin/AdminQuestionRequest";

const SubjectAndPointModel = (props) => {
  const methods = useForm({
    defaultValues: {
      subject_id: null,
      points: "",
      negative_points: "",
    },
  });
  const [input, setInput] = React.useState("");
  const [subjects, setSubjects] = React.useState([]);
  const createSubjectMutation = PostCreateSubject();

  const createSubject = () => {
    if (input) {
      if (
        subjects?.filter(
          (d) => d?.subject_name?.toLowerCase() === input?.toLowerCase()
        )?.length > 0
      ) {
        methods?.setError(`subject_id`, {
          type: "custom",
          message: "Subject name is already exist",
        });
      } else {
        createSubjectMutation.mutate(
          { subject: input },
          {
            onSuccess: (data) => {
              methods?.clearErrors("subject_id");
              setSubjects(data?.data?.subjects);
              methods?.setValue("subject_id", data?.data?.subject_id ?? null, {
                shouldDirty: true,
              });
            },
          }
        );
      }
    } else {
      methods?.setError(`subject_id`, {
        type: "custom",
        message: "Subject cannot be empty",
      });
    }
  };

  const getSubject = GetSubjects();

  React.useMemo(() => {
    if (getSubject?.data?.data?.subjects?.length > 0) {
      setSubjects(getSubject?.data?.data?.subjects);
    }
  }, [getSubject?.data?.data]);

  const setSubjectAndPointMutation = PostSetSubjectAndPoint(props?.quiz_id);
  const handleSubmit = (data) => {
    setSubjectAndPointMutation?.mutate(
      {
        question_ids: props?.watch("question_ids"),
        ...data,
      },
      {
        onSettled: () => {
          props?.setValue("action", "", { shouldDirty: true });
          props?.setValue("question_ids", [], { shouldDirty: true });
          props?.handleClose();
        },
      }
    );
  };

  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        Set Subject and Points
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
        <Grid container gap={4}>
          <Grid item xs={12} lg={12}>
            <Autocomplete
              sx={{
                width: "100%",
              }}
              size="small"
              value={
                methods?.watch("subject_id") !== null
                  ? subjects.filter(
                      (option) => methods?.watch("subject_id") === option?.id
                    )?.[0]
                  : null
              }
              disablePortal
              options={subjects ? subjects : []}
              getOptionLabel={(option) => option?.subject_name || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "spoc_gender",
                  }}
                  label="Select Subject"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {createSubjectMutation?.isPending ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}
              onChange={(_, newValue) => {
                methods?.setValue("subject_id", newValue?.id ?? null, {
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
                      sx={{ justifyContent: "flex-start", pl: 2 }}
                      onMouseDown={createSubject}
                    >
                      + Add New
                    </Button>
                  </Paper>
                );
              }}
            />
            {Boolean(methods?.formState?.errors?.subject_id) && (
              <Typography component="p" color="error">
                {methods?.formState?.errors?.subject_id?.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="+ Point"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  step: 0.01,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              onKeyDown={(event) => {
                if (["e", "E", "+", "-"].includes(event.key)) {
                  event.preventDefault();
                }
              }}
              value={methods?.watch("points")}
              onChange={(e) => {
                methods?.setValue("points", e.target.value, {
                  shouldDirty: true,
                });
              }}
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
          <Grid item xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="- Point"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  step: 0.01,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              onKeyDown={(event) => {
                if (["e", "E", "+", "-"].includes(event.key)) {
                  event.preventDefault();
                }
              }}
              value={methods?.watch("negative_points")}
              onChange={(e) => {
                methods?.setValue("negative_points", e.target.value, {
                  shouldDirty: true,
                });
              }}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={methods?.handleSubmit(handleSubmit)}
          disabled={setSubjectAndPointMutation?.isPending}
        >
          {setSubjectAndPointMutation?.isPending ? "...loading" : "Save Change"}
        </Button>
      </DialogActions>
    </>
  );
};

export default SubjectAndPointModel;
