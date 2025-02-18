import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { memo, useState } from "react";
import GridItem1 from "../../../../components/GridItem1";
import CustomSwitch from "../../../../components/CustomSwitch";
import { FaMinus, FaPlus, FaTrash, IoClose } from "../../../../helpers/icons";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { __ } from "@wordpress/i18n";

const Language = (props) => {
  const methods = useForm({
    defaultValues: {
      show_modal: false,
      language_id: null,
    },
  });
  const language_options = props?.languages?.filter((val) =>
    !props?.watch("languages")?.includes(val?.term_id)
  );


  const handleSaveLanaguage = (copy_default_lanaguge = false) => {
    // Check and add default langauge
    if (!props?.watch("meta.default_language_id") && props?.watch("languages")?.length === 0) {
      props?.setValue("meta.default_language_id", methods?.watch("language_id"), { shouldDirty: true });
      // Set quiz language data to default language
      props?.setValue("meta.quiz_language_data.0.language_id", methods?.watch("language_id"), { shouldDirty: true });
    } else {
      let newLangData = {
        language_id: methods?.watch("language_id"),
        default: false,
        selected: false,
        instruction1: "",
        instruction2: "",
        term_and_condition_text: "",
        term_and_condition_warning_text: "",
      }

      if (copy_default_lanaguge) {
        // Copy default langauge
        const defaultLangData = props?.watch("meta.quiz_language_data")?.find(l => l?.default);
        newLangData = {
          ...defaultLangData,
          language_id: methods?.watch("language_id"),
          default: false,
          selected: false,
        };
      }

      props?.setValue("meta.quiz_language_data",
        [
          ...props?.watch("meta.quiz_language_data"),
          newLangData
        ], { shouldDirty: true });
    }

    // Add language
    props?.setValue("languages", [...props?.watch("languages"), methods?.watch("language_id")], {
      shouldDirty: true,
    });

    if (!props?.create) {
      // add langauge to questions
    }

    methods?.setValue("language_id", null);
  }

  const handleAddLanguage = () => {
    if (!methods?.watch("language_id")) {
      toast.error(__('Please select language', 'acadlix'));
      return;
    }

    if (props?.watch("languages")?.length > 0) {
      methods?.setValue("show_modal", true);
      return;
    }
    handleSaveLanaguage(false);
  };

  const handleSetDefaultLanguage = (language_id) => {
    if (!language_id) {
      toast.error(__('Please select language', 'acadlix'));
      return;
    }

    if(confirm(__('Are you sure you want to set this as the default language? This will update all associated data, including questions, instructions, and other content, to use this language as the default.', 'acadlix'))){
      props?.setValue("meta.default_language_id", language_id, { shouldDirty: true });
      props?.setValue(
        "meta.quiz_language_data", 
        props?.watch("meta.quiz_language_data")?.map(l => {
          if(l?.language_id === language_id){
            l.default = true;
            l.selected = true;
          }else{
            l.default = false;
            l.selected = false;
          }
          return l;
        })
        , { shouldDirty: true });
      if(!props?.create){
        // update default langauge
      }
    }
  }

  const handleRemoveLanguage = (language_id) => {
    if (!language_id) {
      toast.error(__('Please select language', 'acadlix'));
      return;
    }

    if(confirm(__('Are you sure you want to delete this language? This action will permanently remove all associated data, including questions, instructions, and other content in this language. Data in other languages will remain unaffected.', 'acadlix'))){
      props?.setValue("languages", props?.watch("languages").filter(l => l !== language_id));
      props?.setValue("meta quiz_language_data", props?.watch("meta quiz_language_data")?.filter(l => l?.language_id !== language_id), { shouldDirty: true });
      if(!props?.create){
        // update default langauge
      }
    }
  }

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      width: "100%",
    },
  }));

  const handleClose = () => {
    methods?.setValue("show_modal", false);
  }

  return (
    <Box sx={{ color: "black" }}>
      <BootstrapDialog
        open={methods?.watch("show_modal")}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CopyLanguageModel
          {...methods}
          handleClose={handleClose}
          handleSaveLanaguage={handleSaveLanaguage}
        />
      </BootstrapDialog>
      <Grid container>
        <Grid item xs={12} sm={6} lg={4}>
          <Grid container>
            <GridItem1 xs={12} lg={12}>
              <Typography variant="h6">{__('Language Options', 'acadlix')}</Typography>
            </GridItem1>
            <GridItem1 xs={12} lg={12}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={props.watch("meta.multi_language")}
                    onChange={(e) => {
                      props?.setValue("meta.multi_language", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                  />
                }
                label={__('Multi Language', 'acadlix')}
              />
            </GridItem1>

            <GridItem1
              xs={12}
              sm={12}
              lg={12}
              sx={{
                display: props?.watch("meta.multi_language") ? "flex" : "none",
                gap: 2
              }}
            >
              <Autocomplete
                size="small"
                fullWidth
                value={
                  methods?.watch("language_id") !== null
                    ? language_options?.find((val) =>
                      val?.term_id === methods?.watch("language_id")
                    )
                    : null
                }
                options={language_options?.length > 0 ? language_options : []}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) => option?.term_id === value?.term_id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={__('Select Languages', 'acadlix')}
                  />
                )}
                onChange={(_, newValue) => {
                  if (!newValue) {
                    methods?.setValue("language_id", null);
                    return;
                  }
                  methods?.setValue("language_id", newValue?.term_id);
                }}
              />
              <LoadingButton
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddLanguage}
              >
                {__('Add', 'acadlix')}
              </LoadingButton>
            </GridItem1>
            <GridItem1
              xs={12}
              sm={12}
              lg={12}
            >
              <List >
                {props?.watch("languages").map((value, index) => (
                  <ListItem
                    key={index}
                    disableGutters
                    secondaryAction={
                      <React.Fragment>
                        {
                          props?.watch("meta.default_language_id") !== value &&
                          <Box sx={{
                            display: "flex",
                            gap: 1
                          }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={handleSetDefaultLanguage.bind(this, value)}
                            >
                              {__('Set Default', 'acadlix')}
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={handleRemoveLanguage.bind(this, value)}
                            >
                              {__('Delete', 'acadlix')}
                            </Button>
                          </Box>
                        }
                      </React.Fragment>
                    }
                  >
                    <ListItemText
                      primary={props?.languages?.find(l => l?.term_id === value)?.name}
                      secondary={props?.watch("meta.default_language_id") === value ? __("Default", 'acadlix') : ""}
                    />
                  </ListItem>
                ))}
              </List>
            </GridItem1>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const CopyLanguageModel = memo((props) => {
  const [copyDefaultLanguage, setCopyDefaultLanguage] = useState(false);
  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {__('Would like to copy data', 'acadlix')}
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
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={copyDefaultLanguage}
                  onChange={(e) => {
                    console.log(e?.target?.checked);
                    setCopyDefaultLanguage(e?.target?.checked);
                  }}
                />
              }
              label={__('Would you like to copy the default language\'s data, such as instructions, questions, and other relevant content, to the newly created language?', 'acadlix')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          {__('Cancel', 'acadlix')}
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            props?.handleClose();
            props?.handleSaveLanaguage(copyDefaultLanguage);
          }}
        >
          {__('Save', 'acadlix')}
        </Button>
      </DialogActions>
    </>
  )
})

export default Language;
