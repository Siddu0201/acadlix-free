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
  FormLabel,
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
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { MediaUpload } from "@wordpress/media-utils";
import { GetLessonsForCourse } from "../../../../requests/admin/AdminCourseRequest";
import VideoUpload from "../../../../modules/video-upload/VideoUpload";
import { convertTime, hasCapability } from "../../../../helpers/util";
import { IoClose, IoMdRefresh } from "../../../../helpers/icons";
import { __ } from "@wordpress/i18n";
import AiDescription from "../../../../modules/ai/AiDescription";

const AiLessonButton = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/course/lesson/AiLessonButton") :
    import("@acadlix/free/admin/course/lesson/AiLessonButton")
);

const AddLessonModal = (props) => {
  const handleLessonTypeChange = (type = "") => {
    props?.setValue("lesson_type", type, { shouldDirty: true });
  };

  return (
    <>
      <DialogTitle
        id="lesson-dialog-title"
        sx={{
          m: 0,
          p: 2,
        }}
      >
        {__("Add Lesson", "acadlix")}
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
          <Box
            sx={{
              display: "flex",
              gap: 2,
              paddingBottom: 2
            }}
          >
            {
              hasCapability("acadlix_add_lesson") &&
              <Button
                variant={
                  props?.watch("lesson_type") === "add_new"
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                size="small"
                onClick={handleLessonTypeChange.bind(this, "add_new")}
              >
                {__("Add New", "acadlix")}
              </Button>
            }
            <Button
              variant={
                props?.watch("lesson_type") === "existing"
                  ? "contained"
                  : "outlined"
              }
              color="primary"
              size="small"
              onClick={handleLessonTypeChange.bind(this, "existing")}
            >
              {__("Add from existing", "acadlix")}
            </Button>
          </Box>

          {props?.watch("lesson_type") === "add_new" && (
            <AddNewLesson {...props} />
          )}

          {props?.watch("lesson_type") === "existing" && (
            <AddFromExisting {...props} />
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
            {props?.isPending ? __("...loading", "acadlix") : __("Save Changes", "acadlix")}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default AddLessonModal;

const AddNewLesson = (props) => {
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
        reject(__('Error loading video metadata.', 'acadlix'));
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
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="h6">
                    {__('Lesson Title', 'acadlix')} <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomTextField
                    fullWidth
                    name="title"
                    size="small"
                    placeholder={__('Enter Title', 'acadlix')}
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
                        borderRadius: "6px !important",
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
              <Resources key={index} index={index} {...props} {...r} />
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
      {/* {
        process.env.REACT_APP_IS_PREMIUM === 'true' && acadlixOptions?.isActive &&
        <Grid size={{ xs: 12, sm: 12 }}>
          <AiDescription
            title={props?.watch("title") ?? ""}
            description=""
            type="lesson"
            handleAddDescription={(value) => {
              if (window.tinymce) {
                const editor = window.tinymce.get("lesson_content");
                if (editor && editor.getContent() !== value) {
                  editor.setContent(value || "");
                  editor.save();
                }
              }
              props.setValue("content", value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
      } */}
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

const AddFromExisting = (props) => {
  const [search, setSearch] = React.useState("");
  const { isFetching, data, refetch } = GetLessonsForCourse();

  const handleSearch = (data) => {
    if (search === "") {
      return data;
    } else {
      return data?.filter((d) =>
        d?.post_title?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
  };

  return (
    <Box>
      <Button
        color="primary"
        variant="contained"
        onClick={(e) => {
          refetch();
        }}
        disabled={isFetching}
        sx={{
          marginTop: 2,
        }}
      >
        <IoMdRefresh
          style={{
            fontSize: 18,
          }}
        />
      </Button>
      {isFetching ? (
        <CircularProgress
          size={20}
          sx={{
            marginY: 2,
            display: "flex",
            justifyContent: "center",
          }}
        />
      ) : (
        <Card
          sx={{
            marginY: 2,
          }}
        >
          <CardContent>
            <Box>
              <CustomTextField
                fullWidth
                name="title"
                size="small"
                label={__("Search Lesson...", "acadlix")}
                value={search}
                onChange={(e) => {
                  setSearch(e?.target?.value);
                }}
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Box>
            <List
              sx={{
                padding: 0,
              }}
            >
              {data?.data?.lessons?.length > 0 &&
                handleSearch(data?.data?.lessons)?.map((l, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: 0,
                    }}
                  >
                    <FormControlLabel
                      value={l?.ID}
                      label={l?.post_title}
                      control={
                        <Checkbox
                          checked={
                            props?.watch("lesson_ids")?.find(
                              (lesson_id) => lesson_id === l?.ID
                            )
                              ? true
                              : false
                          }
                          onClick={(e) => {
                            const found = props?.watch("lesson_ids")?.find(
                              (lesson_id) => lesson_id === l?.ID
                            );
                            if (e?.target?.checked && !found) {
                              props?.setValue(
                                "lesson_ids",
                                [...props?.watch("lesson_ids"), l?.ID],
                                {
                                  shouldDirty: true,
                                }
                              );
                            } else if (!e?.target?.checked && found) {
                              props?.setValue(
                                "lesson_ids",
                                props
                                  ?.watch("lesson_ids")
                                  ?.filter((lesson_id) => lesson_id !== l?.ID),
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }}
                        />
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
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
