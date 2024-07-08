import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { PostCreateCategory } from "../../../../requests/admin/AdminCategoryRequest";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { GetTemplateById } from "../../../../requests/admin/AdminTemplateRequest";

const CategoryTemplateSection = (props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [input, setInput] = React.useState("");
  const [categories, setCategories] = React.useState(props?.categories);
  const createCategoryMutation = PostCreateCategory();

  const createCategory = () => {
    if (input) {
      if (
        categories?.filter(
          (d) => d?.category_name?.toLowerCase() === input?.toLowerCase()
        )?.length > 0
      ) {
        props?.setError(`category_id`, {
          type: "custom",
          message: "Category name is already exist",
        });
      } else {
        createCategoryMutation.mutate(
          { category: input },
          {
            onSuccess: (data) => {
              props?.clearErrors("category_id");
              setCategories(data?.data?.categories);
              props?.setValue("category_id", data?.data?.category_id ?? null, {
                shouldDirty: true,
              });
            },
          }
        );
      }
    } else {
      props?.setError(`category_id`, {
        type: "custom",
        message: "Category cannot be empty",
      });
    }
  };

  const getTemplateByIdMutation = GetTemplateById();
  const excludedField = [
    "id",
    "load_template_id",
    "templates",
    "non_prerequisite_quiz",
    "prerquisite_data",
  ];
  const handleLoadTemplate = () => {
    if (props?.watch("load_template_id") !== null) {
      getTemplateByIdMutation?.mutate(props?.watch("load_template_id"), {
        onSuccess: (data) => {
          for (const [key, value] of Object.entries(
            JSON.parse(data?.data?.template?.data)
          )) {
            if (!excludedField?.includes(key)) {
              props?.setValue(key, value, { shouldDirty: true });
            }
          }
        },
      });
    } else {
      toast.error("Please select any template", { position: "bottom-right" });
    }
  };

  return (
    <Grid item xs={12} sm={12}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={getTemplateByIdMutation?.isPending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card>
        <CardContent>
          <Grid container spacing={{ xs: 1, sm: 3 }}>
            {/* Used to select category */}
            <Grid item xs={5} sm={3}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("category_id") !== null
                    ? categories?.filter(
                        (option) => props?.watch("category_id") === option?.id
                      )?.[0]
                    : null
                }
                options={categories ? categories : []}
                getOptionLabel={(option) => option?.category_name || ""}
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
                    label="Select Quiz Category"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {createCategoryMutation?.isPending ? (
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
                  props?.setValue("category_id", newValue?.id ?? null, {
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
                        onMouseDown={createCategory}
                      >
                        + Add New
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
            <Grid item xs={7} sm={9}>
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
                    <TextField {...params} label="Select Template" />
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
                    color="success"
                    size="small"
                    onClick={handleLoadTemplate}
                  >
                    Load Template
                  </Button>
                ) : (
                  <IconButton
                    color="success"
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
