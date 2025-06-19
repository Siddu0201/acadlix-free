import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { IoClose } from "../../../../helpers/icons";
import CustomTextField from "../../../../components/CustomTextField";
import { MediaUpload } from "@wordpress/media-utils";
import { GetLessonById } from "../../../../requests/admin/AdminLessonRequest";
import VideoUpload from "../../../../modules/video-upload/VideoUpload";
import { convertTime } from "../../../../helpers/util";
import { __ } from "@wordpress/i18n";

const AiLessonButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/course/lesson/AiLessonButton") :
    import("@acadlix/free/admin/course/lesson/AiLessonButton")
);

const EditLessonModel = (props) => {
  const { isFetching, data } = GetLessonById(props?.watch("lesson_id"));

  React.useEffect(() => {
    if (data?.data?.lesson) {
      if (window.tinymce) {
        const editor = window.tinymce.get("lesson_content");
        if (editor && editor.getContent() !== data?.data?.lesson?.post_content) {
          editor.setContent(data?.data?.lesson?.post_content || "");
        }
      }
      props?.reset({
        ...props?.watch(),
        title: data?.data?.lesson?.post_title ?? "",
        content: data?.data?.lesson?.post_content ?? "",
        meta: {
          type: data?.data?.lesson?.rendered_metas?.type ?? "video",
          video: {
            video_type: data?.data?.lesson?.rendered_metas?.video?.video_type ?? "",
            video_data: {
              html_5: data?.data?.lesson?.rendered_metas?.video?.video_data?.html_5 ?? "",
              external_link:
                data?.data?.lesson?.rendered_metas?.video?.video_data?.external_link ?? "",
              youtube: data?.data?.lesson?.rendered_metas?.video?.video_data?.youtube ?? "",
              vimeo: data?.data?.lesson?.rendered_metas?.video?.video_data?.vimeo ?? "",
              embedded: data?.data?.lesson?.rendered_metas?.video?.video_data?.embedded ?? "",
              shortcode: data?.data?.lesson?.rendered_metas?.video?.video_data?.shortcode ?? "",
            },
            video_thumbnail: data?.data?.lesson?.rendered_metas?.video?.video_thumbnail ?? "",
          },
          hours: data?.data?.lesson?.rendered_metas?.hours ?? 0,
          minutes: data?.data?.lesson?.rendered_metas?.minutes ?? 0,
          seconds: data?.data?.lesson?.rendered_metas?.seconds ?? 0,
          resources: data?.data?.lesson?.rendered_metas?.resources?.map((r) => {
            return {
              title: r?.title,
              type: r?.type,
              filename: r?.filename,
              file_url: r?.file_url,
              link: r?.link,
            };
          }) ?? [],
        },
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
        {__("Edit Lesson", "acadlix")}
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
            {__("Cancel", "acadlix")}
          </Button>
          <Button variant="contained" type="submit" disabled={props?.isPending}>
            {props?.isPending ? "...loading" : "Save Changes"}
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
      "meta.resources",
      [
        ...props?.watch("meta.resources"),
        {
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
        reject(__("Error loading video metadata.", "acadlix"));
      };
    });
  };

  return (
    <Box>
      <Grid container gap={2}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
                sx={{
                  color: "black",
                }}
              >
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Typography variant="h6">
                    {__("Lesson Title", "acadlix")} <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <CustomTextField
                    {...props?.register("title", {
                      required: __("Title is required.", "acadlix"),
                    })}
                    fullWidth
                    name="title"
                    size="small"
                    placeholder={__("Enter Title", "acadlix")}
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
                <Grid size={{ xs: 12, sm: 12 }}>
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
                      {__("Type", "acadlix")}
                    </FormLabel>
                    <RadioGroup
                      name="type"
                      row
                      aria-label="acadlix-option-lesson-type"
                      onChange={(e) => {
                        props?.setValue("meta.type", e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <FormControlLabel
                        value="video"
                        control={<Radio />}
                        label={__("Video", "acadlix")}
                        checked={props?.watch("meta.type") === "video"}
                      />
                      <FormControlLabel
                        value="text"
                        control={<Radio />}
                        label={__("Text", "acadlix")}
                        checked={props?.watch("meta.type") === "text"}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {props?.watch("meta.type") === "video" && (
                  <>
                    <VideoUpload
                      xs={12}
                      sm={12}
                      video={props?.watch("meta.video")}
                      onUpdate={(data) => {
                        props?.setValue("meta.video", data, { shouldDirty: true });
                      }}
                      onMediaUpload={(media) => {
                        if (media?.url && media?.url !== "") {
                          getVideoDuration(media?.url)
                            .then((duration) => {
                              if (duration && duration > 0) {
                                let { hours, minutes, seconds } =
                                  convertTime(duration);
                                props?.setValue("meta.hours", hours, {
                                  shouldDirty: true,
                                });
                                props?.setValue("meta.minutes", minutes, {
                                  shouldDirty: true,
                                });
                                props?.setValue("meta.seconds", seconds, {
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
                                props?.setValue("meta.hours", hours, {
                                  shouldDirty: true,
                                });
                                props?.setValue("meta.minutes", minutes, {
                                  shouldDirty: true,
                                });
                                props?.setValue("meta.seconds", seconds, {
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

                    <Grid size={{ xs: 4, sm: 4 }}>
                      <CustomTextField
                        fullWidth
                        label={__("Hours", "acadlix")}
                        size="small"
                        type="number"
                        value={props?.watch("meta.hours") ?? 0}
                        onChange={(e) => {
                          props?.setValue("meta.hours", e?.target?.value, {
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

                    <Grid size={{ xs: 4, sm: 4 }}>
                      <CustomTextField
                        fullWidth
                        label={__("Minutes", "acadlix")}
                        size="small"
                        type="number"
                        value={props?.watch("meta.minutes") ?? 0}
                        onChange={(e) => {
                          props?.setValue("meta.minutes", e?.target?.value, {
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

                    <Grid size={{ xs: 4, sm: 4 }}>
                      <CustomTextField
                        fullWidth
                        label={__("Seconds", "acadlix")}
                        size="small"
                        type="number"
                        value={props?.watch("meta.seconds") ?? 0}
                        onChange={(e) => {
                          props?.setValue("meta.seconds", e?.target?.value, {
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

                {props?.watch("meta.type") === "text" && (
                  <ContentSection {...props} />
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {props?.watch("meta.resources")?.length > 0 &&
          props
            ?.watch("meta.resources")
            ?.map((r, index) => (
              <Resources key={index} {...props} {...r} index={index} />
            ))}

        <Grid size={{ xs: 12, sm: 12 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddResoures}
          >
            {__("Add Resources", "acadlix")}
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
    <>
      <React.Suspense fallback={null}>
        <AiLessonButton {...props} />
      </React.Suspense>
      <Grid size={{ xs: 12, sm: 12 }}>
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
    </>
  );
};

const Resources = (props) => {
  const handleMediaChange = (media) => {
    props?.setValue(`meta.resources.${props?.index}.filename`, media?.filename, {
      shouldDirty: true,
    });
    props?.setValue(`meta.resources.${props?.index}.file_url`, media?.url, {
      shouldDirty: true,
    });
  };
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={4}
            sx={{
              color: "black",
            }}
          >
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                name="title"
                size="small"
                label={__("Enter Title", "acadlix")}
                value={props?.watch(`meta.resources.${props?.index}.title`) ?? ""}
                onChange={(e) => {
                  props?.setValue(
                    `meta.resources.${props?.index}.title`,
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
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {__("Type", "acadlix")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch(`meta.resources.${props?.index}.type`)}
                  label={__("Type", "acadlix")}
                  onChange={(e) => {
                    props?.setValue(
                      `meta.resources.${props?.index}.type`,
                      e?.target?.value,
                      {
                        shouldDirty: true,
                      }
                    );
                  }}
                >
                  <MenuItem value="upload">{__("Upload", "acadlix")}</MenuItem>
                  <MenuItem value="link">{__("Link", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {props?.type === "upload" && (
              <Grid size={{ xs: 12, sm: 12 }}>
                <MediaUpload
                  onSelect={handleMediaChange}
                  render={({ open }) => (
                    <Button variant="contained" onClick={open}>
                      {__("Upload File", "acadlix")}
                    </Button>
                  )}
                />
                {props?.filename && (
                  <>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      {__("Selected file:", "acadlix")}{" "}
                      <a href={props?.file_url} target="_blank">
                        {props?.filename}
                      </a>
                    </Typography>
                  </>
                )}
              </Grid>
            )}
            {props?.type === "link" && (
              <Grid size={{ xs: 12, sm: 12 }}>
                <CustomTextField
                  fullWidth
                  name="link"
                  size="small"
                  label={__("https://example.com/", "acadlix")}
                  value={props?.watch(`meta.resources.${props?.index}.link`) ?? ""}
                  onChange={(e) => {
                    props?.setValue(
                      `meta.resources.${props?.index}.link`,
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
            <Grid size={{ xs: 12, sm: 12 }}>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  props?.setValue(
                    "meta.resources",
                    props
                      ?.watch("meta.resources")
                      ?.filter((_, i) => i !== props?.index),
                    { shouldDirty: true }
                  );
                }}
              >
                {__("Remove", "acadlix")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
