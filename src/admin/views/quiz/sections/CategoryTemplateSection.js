import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { PostCreateCategory } from "@acadlix/requests/admin/AdminCategoryRequest";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "@acadlix/helpers/icons";
import { GetTemplateById } from "@acadlix/requests/admin/AdminTemplateRequest";
import { __ } from "@wordpress/i18n";
import { hasCapability } from "@acadlix/helpers/util";

const CategoryTemplateSection = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [input, setInput] = React.useState("");
  const [categories, setCategories] = React.useState(props?.categories);
  const createCategoryMutation = PostCreateCategory();

  const createCategory = () => {
    if (!input) {
      props?.setError(`category_id`, {
        type: "custom",
        message: __("Category cannot be empty", "acadlix"),
      });
      return;
    }

    if (categories?.filter(
      (d) => d?.name?.toLowerCase() === input?.toLowerCase()
    )?.length > 0) {
      props?.setError(`category_id`, {
        type: "custom",
        message: __("Category name is already exist", "acadlix"),
      });
      return;
    }

    createCategoryMutation.mutate(
      { category_name: input },
      {
        onSuccess: (data) => {
          props?.clearErrors("category_id");
          setCategories(data?.data?.categories);
          props?.setValue("category_id", data?.data?.category?.term_id ?? null, {
            shouldDirty: true,
          });
        },
      }
    );
  };

  const getTemplateByIdMutation = GetTemplateById();
  const excludedField = [
    "id",
    "load_template_id",
    "templates",
  ];

  const handleEditorContent = (key, value) => {
    if (window.tinymce) {
      const editor = window.tinymce.get(key);
      if (editor && editor.getContent() !== value) {
        editor.setContent(value || "");
      }
    }
  }
  const handleLoadTemplate = () => {
    if (props?.watch("load_template_id") !== null) {
      getTemplateByIdMutation?.mutate(props?.watch("load_template_id"), {
        onSuccess: (data) => {
          for (const [key, value] of Object.entries(
            data?.data?.template?.data
          )) {
            if (excludedField?.includes(key)) {
              continue;
            }
            if (key === "meta") {
              for (const [metaKey, metaValue] of Object.entries(value)) {
                if (metaKey === "quiz_settings") {
                  for (const [settingKey, settingValue] of Object.entries(metaValue)) {
                    if (["result_text", "admin_message", "student_message"].includes(settingKey)) handleEditorContent(settingKey, settingValue);
                    props?.setValue(`meta.${metaKey}.${settingKey}`, settingValue, { shouldDirty: true });
                  }
                  continue;
                }

                if (metaKey === "language_data") {
                  metaValue.forEach((lang, index) => {
                    handleEditorContent(`instruction1_${index}`, lang.instruction1);
                    handleEditorContent(`instruction2_${index}`, lang.instruction2);
                  })
                }
                props?.setValue(`meta.${metaKey}`, metaValue, { shouldDirty: true });
              }
              continue;
            }
            if (key === "post_content") handleEditorContent(key, value);
            props?.setValue(key, value, { shouldDirty: true });
          }
        },
      });
    } else {
      toast.error(__("Please select any template", "acadlix"), { position: "bottom-right" });
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={getTemplateByIdMutation?.isPending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card>
        <CardContent>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {/* Used to select category */}
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("category_id") !== null
                    ? categories?.filter(
                      (option) => props?.watch("category_id") === option?.term_id
                    )?.[0]
                    : null
                }
                options={categories ? categories : []}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.term_id === value?.term_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        autoComplete: "category",
                        endAdornment: (
                          <React.Fragment>
                            {createCategoryMutation?.isPending ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }
                    }}
                    label={__("Select Quiz Category", "acadlix")}
                    onChange={(e) => setInput(e.target.value)}
                  />
                )}
                onChange={(_, newValue) => {
                  props?.clearErrors("category_id");
                  props?.setValue("category_id", newValue?.term_id ?? null, {
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
                        disabled={!hasCapability("acadlix_add_quiz_category")}
                        sx={{ justifyContent: "flex-start", pl: 2 }}
                        onMouseDown={createCategory}
                      >
                        + {__("Add New", "acadlix")}
                      </Button>
                    </Paper>
                  );
                }}
              />
              {Boolean(props?.formState?.errors?.category_id) && (
                <Typography component="p" color="error">
                  {props?.formState?.errors?.category_id?.message}
                </Typography>
              )}
            </Grid>

            {/* Used to load quiz data from template  */}
            <Grid size={{ xs: 12, sm: 9, lg: 9 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Autocomplete
                  sx={{
                    minWidth: {
                      xs: "auto",
                      sm: "250px",
                    },
                    flex: {
                      xs: 1,
                      sm: "none",
                    },
                    marginRight: 3,
                  }}
                  size="small"
                  value={
                    props?.watch("load_template_id") !== null
                      ? props
                        ?.watch("templates")
                        ?.filter(
                          (option) =>
                            props?.watch("load_template_id") === option?.id
                        )?.[0]
                      : null
                  }
                  options={props?.watch("templates") ?? []}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={__("Select Template", "acadlix")} />
                  )}
                  onChange={(_, newValue) => {
                    props?.setValue("load_template_id", newValue?.id ?? null, {
                      shouldDirty: true,
                    });
                  }}
                />
                {isDesktop ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleLoadTemplate}
                  >
                    {__("Load Template", "acadlix")}
                  </Button>
                ) : (
                  <IconButton
                    color="primary"
                    onClick={handleLoadTemplate}
                    title="load"
                  >
                    <FaCloudDownloadAlt />
                  </IconButton>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryTemplateSection;
