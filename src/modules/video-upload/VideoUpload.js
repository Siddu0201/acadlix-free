import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { MediaUpload } from "@wordpress/media-utils";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import CustomTextField from "../../components/CustomTextField";
import { IoClose } from "react-icons/io5";

const VideoUpload = ({
  xs = 12,
  sm = 12,
  video = {},
  onUpdate = () => {},
  onTypeChange = () => {},
  onVideoLinkDataChange = () => {},
  onMediaUpload = () => {},
  onThumbnailUpload = () => {},
  onRemoveMedia = () => {},
  onRemoveThumbnail = () => {},
}) => {
  const methods = useForm({
    defaultValues: {
      video_type: video?.video_type ?? "",
      video_data: {
        html_5: video?.video_data?.html_5 ?? "",
        external_link: video?.video_data?.external_link ?? "",
        youtube: video?.video_data?.youtube ?? "",
        vimeo: video?.video_data?.vimeo ?? "",
        embedded: video?.video_data?.embedded ?? "",
        shortcode: video?.video_data?.shortcode ?? "",
      },
      video_thumbnail: video?.video_thumbnail ?? "",
    },
  });

  const handleOnUpdate = () => {
    if (onUpdate && typeof onUpdate === "function") {
      onUpdate(methods?.watch());
    }
  };

  const handleTypeChange = (e) => {
    methods.setValue("video_type", e?.target?.value, { shouldDirty: true });

    if (onTypeChange && typeof onTypeChange === "function") {
      onTypeChange(e);
    }

    handleOnUpdate();
  };

  const handleVideoDataChange = (type = "", data = "") => {
    methods.setValue(`video_data.${type}`, data, { shouldDirty: true });

    if (onVideoLinkDataChange && typeof onVideoLinkDataChange === "function") {
      onVideoLinkDataChange(type, data);
    }

    handleOnUpdate();
  };

  const handleMediaUpload = (media) => {
    if (media?.type === "video") {
      handleVideoDataChange("html_5", media?.url ?? "");

      if (onMediaUpload && typeof onMediaUpload === "function") {
        onMediaUpload(media);
      }
    } else {
      console.error("Only video files are allowed.");
    }
  };

  const handleThumbnailUpload = (media) => {
    if (media?.type === "image") {
      methods?.setValue("video_thumbnail", media?.url, { shouldDirty: true });

      if (onThumbnailUpload && typeof onThumbnailUpload === "function") {
        onThumbnailUpload(media);
      }

      handleOnUpdate();
    } else {
      console.error("Only image file is allowed.");
    }
  };

  const handleRemoveMedia = () => {
    handleVideoDataChange("html_5", "");

    if (onRemoveMedia && typeof onRemoveMedia === "function") {
      onRemoveMedia();
    }
  };

  const handleRemoveThumbnail = () => {
    methods?.setValue("video_thumbnail", "", { shouldDirty: true });
    handleOnUpdate();
    if (onRemoveThumbnail && typeof onRemoveThumbnail === "function") {
      onRemoveThumbnail();
    }
  };

  const getLinkName = () => {
    switch (methods?.watch("video_type")) {
      case "external_link":
        return "External link";
      case "youtube":
        return "Youtube link";
      case "vimeo":
        return "Vimeo link";
      case "embedded":
        return "Embedded code";
      case "shortcode":
        return "Shortcode";
      default:
        return "Link";
    }
  };

  return (
    <>
      <Grid item xs={xs} sm={sm}>
        <FormControl fullWidth size="small">
          <InputLabel id="acadlix-select-video-type">
            Select Video Source
          </InputLabel>
          <Select
            labelId="acadlix-select-video-type"
            id="acadlix-video-type"
            value={methods?.watch("video_type")}
            label="Select Video Source"
            onChange={handleTypeChange}
          >
            <MenuItem value="">Select Video Source</MenuItem>
            <MenuItem value="html_5">HTML:5</MenuItem>
            <MenuItem value="external_link">External Link</MenuItem>
            <MenuItem value="youtube">Youtube</MenuItem>
            <MenuItem value="vimeo">Vimeo</MenuItem>
            <MenuItem value="embedded">Embedded</MenuItem>
            <MenuItem value="shortcode">Shortcode</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {sm < 12 && (
        <Grid
          item
          sm={sm ? 12 - sm : 12}
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        />
      )}

      {methods?.watch("video_type") === "html_5" && (
        <>
          <Grid
            item
            xs={xs}
            sm={sm}
            sx={{
              display: "block",
            }}
          >
            <MediaUpload
              onSelect={handleMediaUpload}
              allowedTypes={["video"]}
              render={({ open }) => (
                <Button
                  variant="contained"
                  onClick={open}
                  startIcon={<FaCloudUploadAlt />}
                >
                  Upload Video
                </Button>
              )}
            />
            {methods?.watch("video_data.html_5") !== "" && (
              <>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <b>Selected file:</b>
                  <br />
                  {methods?.watch("video_data.html_5")?.split("/").pop()}
                  <IconButton
                    sx={{
                      marginLeft: 2,
                    }}
                    size="small"
                    color="error"
                    onClick={handleRemoveMedia}
                  >
                    <FaTrash />
                  </IconButton>
                </Typography>
              </>
            )}
          </Grid>
          {sm < 12 && (
            <Grid
              item
              sm={sm ? 12 - sm : 12}
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            />
          )}
          <Grid
            item
            xs={xs}
            sm={sm}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
            }}
          >
            <img
              src={
                methods?.watch("video_thumbnail") !== ""
                  ? methods?.watch("video_thumbnail")
                  : acadlixOptions?.default_img_url
              }
              style={{
                height: "auto",
                width: "auto",
                maxHeight: "100%",
                maxWidth: 130,
                borderRadius: 6,
              }}
            />
            {methods?.watch("video_thumbnail") !== "" && (
              <IconButton
                sx={{
                  marginLeft: 2,
                  position: "absolute",
                  left: "120px",
                  top: "10px",
                  backgroundColor: "white",
                  ":hover, :focus": {
                    backgroundColor: "white",
                  },
                }}
                size="small"
                color="error"
                onClick={handleRemoveThumbnail}
              >
                <IoClose />
              </IconButton>
            )}
            <MediaUpload
              onSelect={handleThumbnailUpload}
              allowedTypes={["image"]}
              render={({ open }) => (
                <Button
                  variant="contained"
                  onClick={open}
                  startIcon={<FaCloudUploadAlt />}
                >
                  Upload Thumbnail
                </Button>
              )}
            />
          </Grid>
        </>
      )}

      {["external_link", "youtube", "vimeo", "embedded", "shortcode"]?.map(
        (type, index) => (
          <Grid
            item
            xs={xs}
            sm={sm}
            key={index}
            sx={{
              display: methods?.watch("video_type") === type ? "" : "none",
            }}
          >
            <CustomTextField
              fullWidth
              label={getLinkName()}
              size="small"
              type="text"
              multiline={methods?.watch("video_type") === "embedded"}
              rows={4}
              value={methods?.watch(`video_data.${type}`) ?? ""}
              onChange={(e) => handleVideoDataChange(type, e?.target?.value)}
              inputProps={{
                sx: {
                  border: `0 !important`,
                  boxShadow: `none !important`,
                  minHeight: `auto !important`,
                },
              }}
            />
          </Grid>
        )
      )}

      {methods?.watch("video_type") !== "" && sm < 12 && (
        <Grid
          item
          sm={sm ? 12 - sm : 12}
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        />
      )}
    </>
  );
};

export default VideoUpload;
