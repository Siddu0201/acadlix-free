import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { useForm } from "react-hook-form";
import { MediaUpload } from "@wordpress/media-utils";
import { FaCloudUploadAlt, FaTrash, IoClose } from "@acadlix/helpers/icons";
import CustomTextField from "@acadlix/components/CustomTextField";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

const VideoUpload = ({
  xs = 12,
  sm = 12,
  video = {},
  onUpdate = null,
  onTypeChange = null,
  onVideoLinkDataChange = null,
  onMediaUpload = null,
  onThumbnailUpload = null,
  onRemoveMedia = null,
  onRemoveThumbnail = null,
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
    if (onUpdate) {
      onUpdate(methods?.watch());
    }
  };

  const handleTypeChange = (e) => {
    methods.setValue("video_type", e?.target?.value, { shouldDirty: true });

    if (onTypeChange) {
      onTypeChange(e);
    }

    handleOnUpdate();
  };

  const handleVideoDataChange = (type = "", data = "") => {
    methods.setValue(`video_data.${type}`, data, { shouldDirty: true });

    if (onVideoLinkDataChange) {
      onVideoLinkDataChange(type, data);
    }

    handleOnUpdate();
  };

  const handleMediaUpload = (media) => {
    if (media?.type === "video") {
      handleVideoDataChange("html_5", media?.url ?? "");

      if (onMediaUpload) {
        onMediaUpload(media);
      }
    } else {
      console.error(__('Only video files are allowed.', 'acadlix'));
    }
  };

  const handleThumbnailUpload = (media) => {
    if (media?.type === "image") {
      methods?.setValue("video_thumbnail", media?.url, { shouldDirty: true });

      if (onThumbnailUpload) {
        onThumbnailUpload(media);
      }

      handleOnUpdate();
    } else {
      console.error(__('Only image file is allowed.', 'acadlix'));
    }
  };

  const handleRemoveMedia = () => {
    handleVideoDataChange("html_5", "");

    if (onRemoveMedia) {
      onRemoveMedia();
    }
  };

  const handleRemoveThumbnail = () => {
    methods?.setValue("video_thumbnail", "", { shouldDirty: true });
    handleOnUpdate();
    if (onRemoveThumbnail) {
      onRemoveThumbnail();
    }
  };

  const getLinkName = () => {
    switch (methods?.watch("video_type")) {
      case "external_link":
        return __("External link", 'acadlix');
      case "youtube":
        return __("Youtube link", 'acadlix');
      case "vimeo":
        return __("Vimeo link", 'acadlix');
      case "embedded":
        return __("Embedded code", 'acadlix');
      case "shortcode":
        return __("Shortcode", 'acadlix');
      default:
        return __("Link", 'acadlix');
    }
  };

  return (
    <>
      <Grid size={{xs: xs, sm: sm}}>
        <FormControl fullWidth size="small">
          <InputLabel id="acadlix-select-video-type">
            {__('Select Video Source', 'acadlix')}
          </InputLabel>
          <Select
            labelId="acadlix-select-video-type"
            id="acadlix-video-type"
            value={methods?.watch("video_type")}
            label={__('Select Video Source', 'acadlix')}
            onChange={handleTypeChange}
          >
            <MenuItem value="">{__('Select Video Source', 'acadlix')}</MenuItem>
            <MenuItem value="html_5">{__("HTML:5", 'acadlix')}</MenuItem>
            <MenuItem value="external_link">{__("External Link", 'acadlix')}</MenuItem>
            <MenuItem value="youtube">{__("Youtube", 'acadlix')}</MenuItem>
            <MenuItem value="vimeo">{__("Vimeo", 'acadlix')}</MenuItem>
            <MenuItem value="embedded">{__("Embedded", 'acadlix')}</MenuItem>
            <MenuItem value="shortcode">{__("Shortcode", 'acadlix')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {sm < 12 && (
        <Grid size={{ sm: sm ? 12 - sm : 12 }}
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
          <Grid size={{ xs: xs, sm: sm }}
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
                  {__('Upload Video', 'acadlix')}
                </Button>
              )}
            />
            {methods?.watch("video_data.html_5") !== "" && (
              <>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <b>{__('Selected file:', 'acadlix')}</b>
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
            <Grid size={{ sm: sm ? 12 - sm : 12 }}
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            />
          )}
          <Grid size={{ xs: xs, sm: sm }}
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
                  {__("Upload Thumbnail", "acadlix")}
                </Button>
              )}
            />
          </Grid>
        </>
      )}

      {["external_link", "youtube", "vimeo", "embedded", "shortcode"]?.map(
        (type, index) => (
          <Grid size={{ xs: xs, sm: sm }}
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
            />
          </Grid>
        )
      )}

      {methods?.watch("video_type") !== "" && sm < 12 && (
        <Grid size={{ sm: sm ? 12 - sm : 12 }}
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

VideoUpload.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  video: PropTypes.object,
  onUpdate: PropTypes.func,
  onTypeChange: PropTypes.func,
  onVideoLinkDataChange: PropTypes.func,
  onMediaUpload: PropTypes.func,
  onThumbnailUpload: PropTypes.func,
  onRemoveMedia: PropTypes.func,
  onRemoveThumbnail: PropTypes.func,
};

export default VideoUpload;
