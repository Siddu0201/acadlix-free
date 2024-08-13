import {
  Alert,
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import CustomSwitch from "../../../../components/CustomSwitch";
import { useForm } from "react-hook-form";
import { PostSetParagraph } from "../../../../requests/admin/AdminQuestionRequest";

const ParagraphModel = (props) => {
  const methods = useForm({
    defaultValues: {
      paragraph_enabled: false,
      paragraph_id: null,
    },
  });

  const setParagraphMutation = PostSetParagraph(props?.quiz_id);

  const handleSubmit = (data) => {
    setParagraphMutation?.mutate({
        question_ids: props?.watch("question_ids"),
        ...data
    },{
        onSettled: () => {
            props?.setValue("action", "", {shouldDirty: true});
            props?.setValue("question_ids", [], {shouldDirty: true});
            props?.handleClose();
        }
    })
  }

  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        Set Paragraph
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
        <Grid container gap={4} spacing={4}>
          <Grid item xs={11} lg={11}>
            <Alert severity="warning">
              The existing paragraph assigned to the question will be removed if
              no paragraph is selected before saving.
            </Alert>
          </Grid>
          <Grid item xs={12} lg={12}>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={methods?.watch("paragraph_enabled")}
                  onChange={(e) => {
                    methods?.setValue("paragraph_enabled", e?.target?.checked, {
                      shouldDirty: true,
                    });
                  }}
                />
              }
              label="Enable Paragraph"
            />
          </Grid>
          {methods?.watch("paragraph_enabled") && (
            <Grid item xs={12} sm={12}>
              <Autocomplete
                fullWidth
                size="small"
                value={
                  methods?.watch("paragraph_id") !== null
                    ? props?.paragraphs.filter(
                        (option) =>
                          methods?.watch("paragraph_id") === option?.id
                      )?.[0]
                    : null
                }
                options={props?.paragraphs ? props?.paragraphs : []}
                getOptionLabel={(option) => option?.title || ""}
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
                    label="Select Paragraph"
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                onChange={(_, newValue) => {
                  methods?.setValue("paragraph_id", newValue?.id ?? null, {
                    shouldDirty: true,
                  });
                }}
              />
              {Boolean(methods?.formState?.errors?.paragraph_id) && (
                <Typography component="p" color="error">
                  {methods?.formState?.errors?.paragraph_id?.message}
                </Typography>
              )}
            </Grid>
          )}
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
          disabled={setParagraphMutation?.isPending}
        >
          {setParagraphMutation?.isPending ? "...loading" : "Save Change"}
        </Button>
      </DialogActions>
    </>
  );
};

export default ParagraphModel;
