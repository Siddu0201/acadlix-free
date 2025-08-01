import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { PostSaveTemplate } from "@acadlix/requests/admin/AdminTemplateRequest";
import { FaCloudUploadAlt } from "@acadlix/helpers/icons";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";

const SaveTemplateSection = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [template_id, setTemplate_id] = React.useState(null);
  const [input, setInput] = React.useState("");

  const saveTemplateMutation = PostSaveTemplate();

  const saveTemplate = () => {
    if (template_id || input) {
      saveTemplateMutation?.mutate(
        {
          id: template_id,
          name: input,
          type: "quiz",
          data: props?.watch(),
        },
        {
          onSuccess: (data) => {
            setTemplate_id(null);
            setInput("");
            props?.setValue("templates", data?.data?.templates, {
              shouldDirty: true,
            });
            toast.success(__('Template created successfully', 'acadlix'));
          },
        }
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Autocomplete
        sx={{
          minWidth: {
            xs: "120px",
            sm: "250px",
          },
          marginRight: 3,
        }}
        size="small"
        value={
          template_id !== null
            ? props
                ?.watch("templates")
                ?.filter((option) => option?.id === template_id)?.[0]
            : null
        }
        freeSolo
        inputValue={input}
        onInputChange={(e, newValue) => setInput(newValue)}
        options={props?.watch("templates") ?? []}
        getOptionLabel={(option) => option?.name || ""}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: "template",
            }}
            label={__('Enter Template Name', 'acadlix')}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {saveTemplateMutation?.isPending ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onChange={(_, newValue) => {
          setTemplate_id(newValue?.id);
        }}
      />
      {isDesktop ? (
        <Button
          variant="contained"
          size="small"
          onClick={saveTemplate}
          color="primary"
          disabled={!hasCapability('acadlix_add_template')}
        >
          {saveTemplateMutation?.isPending ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            __("Save Template", "acadlix")
          )}
        </Button>
      ) : (
        <IconButton 
          color="success" 
          onClick={saveTemplate} 
          title="load"
          disabled={!hasCapability('acadlix_add_template')}
        >
          {saveTemplateMutation?.isPending ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <FaCloudUploadAlt />
          )}
        </IconButton>
      )}
    </Box>
  );
};

export default SaveTemplateSection;
