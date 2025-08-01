import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { MediaUpload } from "@wordpress/media-utils";
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import ContentSection from "./ContentSection";
import { convertTime } from "@acadlix/helpers/util";
import VideoUpload from "@acadlix/modules/video-upload/VideoUpload";
import { __ } from "@wordpress/i18n";

const OptionSection = ({
  hoursInputProps = {},
  minutesInputProps = {},
  secondsInputProps = {},
  videoUploadGridSize={ xs: 12, sm: 6 },
  hourGridSize = { xs: 4, sm: 2 },
  minutesGridSize = { xs: 4, sm: 2 },
  secondsGridSize = { xs: 4, sm: 2 },
  ...props
}) => {
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
        if (video.duration && video.duration > 0) {
          let { hours, minutes, seconds } =
            convertTime(video.duration);
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
        resolve(true); // Duration in seconds
      };

      // Handle error if video fails to load
      video.onerror = () => {
        reject(__('Error loading video metadata.', 'acadlix'));
      };
    });
  };

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 3, sm: 4 }}
          >
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography variant="h6">
                {__('Options', 'acadlix')}
              </Typography>
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
                  {...videoUploadGridSize}
                  video={props?.watch("meta.video")}
                  onUpdate={(data) => {
                    props?.setValue("meta.video", data, { shouldDirty: true });
                  }}
                  onMediaUpload={(media) => {
                    if (media?.url && media?.url !== "") {
                      getVideoDuration(media?.url)
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  }}
                  onVideoLinkDataChange={(type, data) => {
                    if (type === "external_link" && data !== "") {
                      getVideoDuration(data)
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  }}
                />

                <Grid size={hourGridSize}>
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
                    sx={{
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                    {...hoursInputProps}
                  />
                </Grid>

                <Grid size={minutesGridSize}>
                  <CustomTextField
                    fullWidth
                    label={__('Minutes', 'acadlix')}
                    size="small"
                    type="number"
                    value={props?.watch("meta.minutes") ?? 0}
                    onChange={(e) => {
                      props?.setValue("meta.minutes", e?.target?.value, {
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
                    {...minutesInputProps}
                  />
                </Grid>

                <Grid size={secondsGridSize}>
                  <CustomTextField
                    fullWidth
                    label={__('Seconds', 'acadlix')}
                    size="small"
                    type="number"
                    value={props?.watch("meta.seconds") ?? 0}
                    onChange={(e) => {
                      props?.setValue("meta.seconds", e?.target?.value, {
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
                    {...secondsInputProps}
                  />
                </Grid>
              </>
            )}

            {props?.watch("meta.type") === "text" &&
              <ContentSection {...props} />
            }

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
        </CardContent>
      </Card>
    </Grid>
  );
};

export default OptionSection;

const Resources = ({ resourcesInputProps = {}, ...props }) => {
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
                {...resourcesInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">{__("Type", "acadlix")}</InputLabel>
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
                  {...resourcesInputProps}
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
