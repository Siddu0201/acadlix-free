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
import { IoClose } from "../../../../helpers/icons";
import CustomTextField from "../../../../components/CustomTextField";
import { MediaUpload } from "@wordpress/media-utils";
import { GetLessonById } from "../../../../requests/admin/AdminLessonRequest";
import VideoUpload from "../../../../modules/video-upload/VideoUpload";
import { convertTime } from "../../../../helpers/util";

const EditLessonModel = (props) => {
  const { isFetching, data } = GetLessonById(props?.watch("lesson_id"));

  React.useEffect(() => {
    if (data?.data?.lesson) {
      if (window.tinymce) {
        const editor = window.tinymce.get("lesson_content");
        if (editor && editor.getContent() !== data?.data?.lesson?.content) {
          editor.setContent(data?.data?.lesson?.content || "");
        }
      }
      props?.reset({
        ...props?.watch(),
        title: data?.data?.lesson?.title ?? "",
        type: data?.data?.lesson?.type ?? "video",
        content: data?.data?.lesson?.content ?? "",
        video: {
          video_type: data?.data?.lesson?.video?.video_type ?? "",
          video_data: {
            html_5: data?.data?.lesson?.video?.video_data?.html_5 ?? "",
            external_link:
              data?.data?.lesson?.video?.video_data?.external_link ?? "",
            youtube: data?.data?.lesson?.video?.video_data?.youtube ?? "",
            vimeo: data?.data?.lesson?.video?.video_data?.vimeo ?? "",
            embedded: data?.data?.lesson?.video?.video_data?.embedded ?? "",
            shortcode: data?.data?.lesson?.video?.video_data?.shortcode ?? "",
          },
          video_thumbnail: data?.data?.lesson?.video?.video_thumbnail ?? "",
        },
        hours: data?.data?.lesson?.hours ?? 0,
        minutes: data?.data?.lesson?.minutes ?? 0,
        seconds: data?.data?.lesson?.seconds ?? 0,
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
            <EditExistingsLesson {...props} />
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

const EditExistingsLesson = (props) => {
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

  const getVideoDuration = (videoUrl) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "metadata";

      // Listen for loaded metadata to get the duration
      video.onloadedmetadata = () => {
        resolve(video.duration); // Duration in seconds
      };

      // Handle error if video fails to load
      video.onerror = () => {
        reject("Error loading video metadata.");
      };
    });
  };

  return (
    <Box>
      <Grid container gap={2}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
                sx={{
                  color: "black",
                }}
              >
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
                    placeholder="Enter Title"
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
                {props?.watch("type") === "video" && (
                  <>
                    <VideoUpload
                      xs={12}
                      sm={12}
                      video={props?.watch("video")}
                      onUpdate={(data) => {
                        props?.setValue("video", data, { shouldDirty: true });
                      }}
                      onMediaUpload={(media) => {
                        if (media?.url && media?.url !== "") {
                          getVideoDuration(media?.url)
                            .then((duration) => {
                              if (duration && duration > 0) {
                                let { hours, minutes, seconds } =
                                  convertTime(duration);
                                props?.setValue("hours", hours, {
                                  shouldDirty: true,
                                });
                                props?.setValue("minutes", minutes, {
                                  shouldDirty: true,
                                });
                                props?.setValue("seconds", seconds, {
                                  shouldDirty: true,
                                });
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                      onVideoLinkDataChange={(type, data) => {
                        if (type === "external_link" && data !== "") {
                          getVideoDuration(data)
                            .then((duration) => {
                              if (duration && duration > 0) {
                                let { hours, minutes, seconds } =
                                  convertTime(duration);
                                props?.setValue("hours", hours, {
                                  shouldDirty: true,
                                });
                                props?.setValue("minutes", minutes, {
                                  shouldDirty: true,
                                });
                                props?.setValue("seconds", seconds, {
                                  shouldDirty: true,
                                });
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                    />

                    <Grid item xs={4} sm={4}>
                      <CustomTextField
                        fullWidth
                        label="Hours"
                        size="small"
                        type="number"
                        value={props?.watch("hours") ?? 0}
                        onChange={(e) => {
                          props?.setValue("hours", e?.target?.value, {
                            shouldDirty: true,
                          });
                        }}
                        inputProps={{
                          sx: {
                            border: `0 !important`,
                            boxShadow: `none !important`,
                            minHeight: `auto !important`,
                          },
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

                    <Grid item xs={4} sm={4}>
                      <CustomTextField
                        fullWidth
                        label="Minutes"
                        size="small"
                        type="number"
                        value={props?.watch("minutes") ?? 0}
                        onChange={(e) => {
                          props?.setValue("minutes", e?.target?.value, {
                            shouldDirty: true,
                          });
                        }}
                        inputProps={{
                          sx: {
                            border: `0 !important`,
                            boxShadow: `none !important`,
                            minHeight: `auto !important`,
                          },
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

                    <Grid item xs={4} sm={4}>
                      <CustomTextField
                        fullWidth
                        label="Seconds"
                        size="small"
                        type="number"
                        value={props?.watch("seconds") ?? 0}
                        onChange={(e) => {
                          props?.setValue("seconds", e?.target?.value, {
                            shouldDirty: true,
                          });
                        }}
                        inputProps={{
                          sx: {
                            border: `0 !important`,
                            boxShadow: `none !important`,
                            minHeight: `auto !important`,
                          },
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
                  </>
                )}

                {props?.watch("type") === "text" && (
                  <ContentSection {...props} />
                )}
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

const ContentSection = (props) => {
  const loadPage = () => {
    props?.loadEditor("lesson_content", "content");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("lesson_content");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Grid item xs={12} sm={12}>
      <textarea
        id="lesson_content"
        rows={12}
        style={{
          width: "100%",
        }}
        value={props?.watch("content") ?? ""}
        onChange={(e) => {
          let value = e?.target?.value;
          if (window.tinymce) {
            const editor = window.tinymce.get("lesson_content");
            if (editor && editor.getContent() !== value) {
              editor.setContent(value || "");
            }
          }
          props.setValue("content", value, {
            shouldDirty: true,
          });
        }}
      />
    </Grid>
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
