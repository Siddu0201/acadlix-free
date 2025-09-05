import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { PostCreateSubject } from "@acadlix/requests/admin/AdminSubjectRequest";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";

const GeneralOptionSection = (props) => {
  const [input, setInput] = React.useState("");
  const [subjects, setSubjects] = React.useState(props?.subjects);
  const createSubjectMutation = PostCreateSubject();

  const createSubject = () => {
    if (input) {
      if (
        subjects?.filter(
          (d) => d?.subject_name?.toLowerCase() === input?.toLowerCase()
        )?.length > 0
      ) {
        props?.setError(`subject_id`, {
          type: "custom",
          message: __("Subject name is already exist", "acadlix"),
        });
      } else {
        createSubjectMutation.mutate(
          { subject_name: input },
          {
            onSuccess: (data) => {
              props?.clearErrors("subject_id");
              setSubjects(data?.data?.subjects);
              props?.setValue("subject_id", data?.data?.subject_id ?? null, {
                shouldDirty: true,
              });
            },
          }
        );
      }
    } else {
      props?.setError(`subject_id`, {
        type: "custom",
        message: __("Subject cannot be empty", "acadlix"),
      });
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardHeader
          title={__("General Options", "acadlix")}
        />
        <CardContent>
          <Grid container spacing={{
            xs: 2,
            sm: 4,
          }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <CustomTextField
                {...props?.register("title")}
                fullWidth
                size="small"
                label={__("Question Title", "acadlix")}
                value={props?.watch("title")}
                onChange={(e) => {
                  props?.setValue("title", e.target.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <CustomTextField
                fullWidth
                size="small"
                label={__("+ Point", "acadlix")}
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
                  if (['e', 'E', '+', '-'].includes(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={props?.watch("points")}
                onChange={(e) => {
                  props?.setValue("points", e.target.value, {
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
            <Grid size={{ xs: 12, sm: 2 }}>
              <CustomTextField
                fullWidth
                size="small"
                label={__("- Point", "acadlix")}
                type="number"
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 0.01,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                }}
                value={props?.watch("negative_points")}
                onKeyDown={(event) => {
                  if (['e', 'E', '+', '-'].includes(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  props?.setValue("negative_points", e.target.value, {
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
            <Grid size={{ xs: 12, sm: 3 }}>
              <Autocomplete
                fullWidth
                size="small"
                value={
                  props?.watch("subject_id") !== null
                    ? subjects.filter(
                      (option) => props?.watch("subject_id") === option?.id
                    )?.[0]
                    : null
                }
                options={subjects ? subjects : []}
                getOptionLabel={(option) => option?.subject_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "spoc_gender",
                    }}
                    label={__("Select Subject", "acadlix")}
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
                  props?.clearErrors("subject_id");
                  props?.setValue("subject_id", newValue?.id ?? null, {
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
                        onMouseDown={createSubject}
                      >
                        {__("Add New", "acadlix")}
                      </Button>
                    </Paper>
                  );
                }}
              />
              {Boolean(props?.formState?.errors?.subject_id) && (
                <Typography component="p" color="error">
                  {props?.formState?.errors?.subject_id?.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GeneralOptionSection;
