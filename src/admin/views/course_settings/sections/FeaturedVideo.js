import { Alert, Box, Button, IconButton } from "@mui/material";
import React from "react";
import { MediaUpload } from "@wordpress/media-utils";
import { IoClose } from "react-icons/io5";

const FeaturedVideo = (props) => {
  const handleMediaChange = (media) => {
    if (media?.type === "video") {
      props?.clearErrors("featured_video");
      props?.setValue("featured_video", media?.url, { shouldDirty: true });
    } else {
      props?.setError("featured_video", {
        type: "custom",
        message: "Only video allowed.",
      });
    }
  };

  const handleRemoveFeaturedVideo = () => {
    props?.setValue("featured_video", "", { shouldDirty: true });
  };

  return (
    <Box>
      {Boolean(props?.formState?.errors?.featured_video) && (
        <Alert
          severity="error"
          sx={{
            marginY: 2,
          }}
        >
          {props?.formState?.errors?.featured_video?.message}
        </Alert>
      )}
      {props?.watch("featured_video") && (
        <Box
          sx={{
            marginY: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <a href={props?.watch("featured_video")} target="_blank">
            {props?.watch("featured_video")?.split("/")?.slice(-1)}
          </a>
          <IconButton
            color="error"
            size="small"
            onClick={handleRemoveFeaturedVideo}
          >
            <IoClose />
          </IconButton>
        </Box>
      )}
      <MediaUpload
        onSelect={handleMediaChange}
        render={({ open }) => (
          <Button variant="contained" onClick={open}>
            Upload Featured Video
          </Button>
        )}
      />
    </Box>
  );
};

export default FeaturedVideo;
