import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import CustomTextField from "../../../../components/CustomTextField";
import { MediaUpload } from "@wordpress/media-utils";
import { GetLessonById } from "../../../../requests/admin/AdminLessonRequest";

const EditLessonModel = (props) => {
  const { isFetching, data } = GetLessonById(props?.watch("lesson_id"));

  React.useEffect(() => {
    if (data?.data?.lesson) {
      props?.reset({
        ...props?.watch(),
        title: data?.data?.lesson?.title,
        lesson_content: data?.data?.lesson?.content,
        type: data?.data?.lesson?.type,
        duration: data?.data?.lesson?.duration,
        duration_type: data?.data?.lesson?.duration_type,
        resources:
          data?.data?.lesson?.lesson_resources?.length > 0
            ? data.data?.lesson?.lesson_resources?.map((r) => {
                return {
                  id: r?.id,
                  title: r?.title,
                  type: r?.type,
                  filename: r?.filename,
                  file_url: r?.file_url,
                  link: r?.link,
                };
              })
            : [],
      });
    }
  }, [data]);

  return (
    <>
      <DialogTitle
        id="lesson-dialog-title"
        sx={{
          m: 0,
          p: 2,
        }}
      >
        Edit Lesson
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
      <form onSubmit={props?.handleSubmit(props?.onSubmit)}>
        <DialogContent
          sx={{
            padding: "1rem !important",
            backgroundColor: props?.colorCode?.modal_background,
            maxHeight: {
              xs: "450px",
              sm: "350px",
            },
            overflowY: "auto",
          }}
        >
          {isFetching ? (
            <CircularProgress size={20} />
          ) : (
            <AddNewLesson {...props} />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={props?.handleClose}
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={props?.isPending}>
            {props?.isPending ? "...loading" : "Save Change"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default EditLessonModel;

const AddNewLesson = (props) => {
  const loadPage = () => {
    props?.loadEditor("lesson_content", "lesson_content");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("lesson_content");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  const handleAddResoures = () => {
    props?.setValue(
      "resources",
      [
        ...props?.watch("resources"),
        {
          id: null,
          title: "",
          type: "upload",
          filename: "",
          file_url: "",
          link: "",
        },
      ],
      { shouldDirty: true }
    );
  };

  return (
    <Box>
      <Grid container gap={2}>
        <Grid item xs={12} lg={12}>
          <Typography variant="h6">
            Lesson Title <span style={{ color: "red" }}>*</span>
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12}>
          <CustomTextField
            {...props?.register("title", {
              required: "Title is required.",
            })}
            fullWidth
            name="title"
            size="small"
            value={props?.watch("title") ?? ""}
            onChange={(e) => {
              props?.setValue("title", e?.target?.value, {
                shouldDirty: true,
              });
            }}
            error={Boolean(props?.formState?.errors?.title)}
            helperText={props?.formState?.errors?.title?.message}
            inputProps={{
              sx: {
                border: `0 !important`,
                boxShadow: `none !important`,
                minHeight: `auto !important`,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} lg={12}>
          <Typography variant="h6">Content</Typography>
        </Grid>
        <Grid item xs={12} lg={12}>
          <textarea
            id="lesson_content"
            rows={8}
            style={{
              width: "100%",
            }}
            value={props?.watch("lesson_content") ?? ""}
            onChange={(e) => {
              e?.preventDefault();
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={4}
                sx={{
                  color: "black",
                }}
              >
                <Grid item xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FormLabel
                      id="acadlix-option-lesson-type"
                      sx={{
                        marginRight: 4,
                        color: "black",
                        fontWeight: 500,
                        fontSize: "1.1rem",
                      }}
                    >
                      Type
                    </FormLabel>
                    <RadioGroup
                      name="type"
                      row
                      aria-label="acadlix-option-lesson-type"
                      onChange={(e) => {
                        props?.setValue("type", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <FormControlLabel
                        value="video"
                        control={<Radio />}
                        label="Video"
                        checked={props?.watch("type") === "video"}
                      />
                      <FormControlLabel
                        value="text"
                        control={<Radio />}
                        label="Text"
                        checked={props?.watch("type") === "text"}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label="Duration"
                    size="small"
                    type="number"
                    value={props?.watch("duration") ?? 0}
                    onChange={(e) => {
                      props?.setValue("duration", e?.target?.value, {
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
                    inputProps={{
                      sx: {
                        border: `0 !important`,
                        boxShadow: `none !important`,
                        minHeight: `auto !important`,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    size="small"
                    error={Boolean(props?.formState?.errors?.duration_type)}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Duration Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={props?.watch("duration_type")}
                      label="Duration Type"
                      onChange={(e) => {
                        props?.setValue("duration_type", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <MenuItem value="second">Second(s)</MenuItem>
                      <MenuItem value="minute">Minute(s)</MenuItem>
                      <MenuItem value="hour">Hour(s)</MenuItem>
                      <MenuItem value="day">Day(s)</MenuItem>
                      <MenuItem value="week">Week(s)</MenuItem>
                    </Select>
                    <FormHelperText>
                      {props?.formState?.errors?.duration_type?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {props?.watch("resources")?.length > 0 &&
          props
            ?.watch("resources")
            ?.map((r, index) => (
              <Resources key={index} {...props} {...r} index={index} />
            ))}

        <Grid item xs={12} sm={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddResoures}
          >
            Add Resources
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Resources = (props) => {
  const handleMediaChange = (media) => {
    props?.setValue(`resources.${props?.index}.filename`, media?.filename, {
      shouldDirty: true,
    });
    props?.setValue(`resources.${props?.index}.file_url`, media?.url, {
      shouldDirty: true,
    });
  };
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={4}
            sx={{
              color: "black",
            }}
          >
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                name="title"
                size="small"
                label="Enter Title"
                value={props?.watch(`resources.${props?.index}.title`) ?? ""}
                onChange={(e) => {
                  props?.setValue(
                    `resources.${props?.index}.title`,
                    e?.target?.value,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch(`resources.${props?.index}.type`)}
                  label="Type"
                  onChange={(e) => {
                    props?.setValue(
                      `resources.${props?.index}.type`,
                      e?.target?.value,
                      {
                        shouldDirty: true,
                      }
                    );
                  }}
                >
                  <MenuItem value="upload">Upload</MenuItem>
                  <MenuItem value="link">Link</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {props?.type === "upload" && (
              <Grid item xs={12} sm={12}>
                <MediaUpload
                  onSelect={handleMediaChange}
                  render={({ open }) => (
                    <Button variant="contained" onClick={open}>
                      Upload File
                    </Button>
                  )}
                />
                {props?.filename && (
                  <>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      Selected file:{" "}
                      <a href={props?.file_url} target="_blank">
                        {props?.filename}
                      </a>
                    </Typography>
                  </>
                )}
              </Grid>
            )}
            {props?.type === "link" && (
              <Grid item xs={12} sm={12}>
                <CustomTextField
                  fullWidth
                  name="link"
                  size="small"
                  label="https://example.com/"
                  value={props?.watch(`resources.${props?.index}.link`) ?? ""}
                  onChange={(e) => {
                    props?.setValue(
                      `resources.${props?.index}.link`,
                      e?.target?.value,
                      {
                        shouldDirty: true,
                      }
                    );
                  }}
                  inputProps={{
                    sx: {
                      border: `0 !important`,
                      boxShadow: `none !important`,
                      minHeight: `auto !important`,
                    },
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  props?.setValue(
                    "resources",
                    props
                      ?.watch("resources")
                      ?.filter((_, i) => i !== props?.index),
                    { shouldDirty: true }
                  );
                }}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
