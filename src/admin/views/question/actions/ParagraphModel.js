import {
  Alert,
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { IoClose } from "@acadlix/helpers/icons";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { useForm } from "react-hook-form";
import { PostSetParagraph } from "@acadlix/requests/admin/AdminQuestionRequest";
import { __ } from "@wordpress/i18n";

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
    }, {
      onSettled: () => {
        props?.setValue("action", "", { shouldDirty: true });
        props?.setValue("question_ids", [], { shouldDirty: true });
        props?.handleClose();
      }
    })
  }

  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {__("Set Paragraph", "acadlix")}
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
        <Grid
          container
          gap={4}
          spacing={{
            xs: 2,
            sm: 4,
          }}>
          <Grid size={{ xs: 11, lg: 11 }}>
            <Alert severity="warning">
              {__(
                "The existing paragraph assigned to the question will be removed if no paragraph is selected before saving.",
                "acadlix"
              )}
            </Alert>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
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
              label={__("Enable Paragraph", "acadlix")}
            />
          </Grid>
          {methods?.watch("paragraph_enabled") && (
            <Grid size={{ xs: 12, sm: 12 }}>
              <Autocomplete
                fullWidth
                size="small"
                value={
                  methods?.watch("paragraph_id") !== null
                    ? props?.paragraphs.filter(
                      (option) =>
                        methods?.watch("paragraph_id") === option?.ID
                    )?.[0]
                    : null
                }
                options={props?.paragraphs ? props?.paragraphs : []}
                getOptionLabel={(option) => option?.post_title || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.ID === value?.ID
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                    }}
                    label={__("Select Paragraph", "acadlix")}
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                onChange={(_, newValue) => {
                  methods?.setValue("paragraph_id", newValue?.ID ?? null, {
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
          {__("Cancel", "acadlix")}
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={methods?.handleSubmit(handleSubmit)}
          disabled={setParagraphMutation?.isPending}
        >
          {setParagraphMutation?.isPending
            ? __("...loading", "acadlix")
            : __("Save Changes", "acadlix")}
        </Button>
      </DialogActions>
    </>
  );
};

export default ParagraphModel;
