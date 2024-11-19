import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MediaUpload } from "@wordpress/media-utils";
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomTextField from "../../../../components/CustomTextField";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import ContentSection from "./ContentSection";
import { convertTime } from "../../../../helpers/util";
import toast from "react-hot-toast";
import VideoUpload from "../../../../modules/video-upload/VideoUpload";

const OptionSection = (props) => {
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
    <Grid item xs={12} sm={12}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 3, sm: 4 }}
            sx={{
              color: "black",
            }}
          >
            <Grid item xs={12} lg={12}>
              <Typography variant="h6">Options</Typography>
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
                  sm={6}
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

                <Grid item xs={4} sm={2}>
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

                <Grid item xs={4} sm={2}>
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

                <Grid item xs={4} sm={2}>
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

            {props?.watch("type") === "text" && <ContentSection {...props} />}

            <Grid item xs={12} sm={12}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={props?.watch("preview") ?? false}
                    onChange={(e) => {
                      props?.setValue("preview", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                  />
                }
                label="Preview"
              />
            </Grid>

            {props?.watch("resources")?.length > 0 &&
              props
                ?.watch("resources")
                ?.map((r, index) => (
                  <Resources key={index} index={index} {...props} {...r} />
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
        </CardContent>
      </Card>
    </Grid>
  );
};

export default OptionSection;

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
