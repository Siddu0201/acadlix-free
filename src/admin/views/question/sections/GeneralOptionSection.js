import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { PostCreateSubject } from "../../../../requests/admin/AdminSubjectRequest";

const GeneralOptionSection = (props) => {
  const [input, setInput] = React.useState("");
  const [subjects, setSubjects] = React.useState(props?.subjects);
  const updateMutation = PostCreateSubject();

  const createSubject = () => {
    if(input){
      if(subjects?.filter(d => d?.subject_name?.toLowerCase() === input?.toLowerCase())?.length > 0){
        props?.setError(`subject_id`, { type: "custom", message: "Subject name is already exist"});
      }else{
        updateMutation.mutate(
          { subject: input },
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
    }else{
      props?.setError(`subject_id`, { type: "custom", message: "Subject cannot be empty"});
    }
  };

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="General Options"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={5}>
              <CustomTextField
                {...props?.register("title")}
                fullWidth
                size="small"
                label="Question Title"
                value={props?.watch("title")}
                onChange={(e) => {
                  props?.setValue("title", e.target.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="+ Point"
                type="number"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
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
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="- Point"
                type="number"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                value={props?.watch("negative_points")}
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
            <Grid item xs={12} sm={3}>
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
                    label="Select Subject"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {updateMutation?.isPending ? (
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
                        sx={{ justifyContent: "flex-start", pl: 2 }}
                        onMouseDown={createSubject}
                      >
                        + Add New
                      </Button>
                    </Paper>
                  );
                }}
              />
              {
                Boolean(props?.formState?.errors?.subject_id) &&
                <Typography component="p" color="error">
                  {props?.formState?.errors?.subject_id?.message}
                </Typography>
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GeneralOptionSection;
