import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import VideoUpload from "@acadlix/modules/video-upload/VideoUpload";

const FeaturedVideo = (props) => {
  return (
    <Box>
      <Grid container spacing={{ xs: 3, sm: 4 }}>
        <VideoUpload
          xs={12}
          sm={8}
          video={props?.watch("video")}
          onUpdate={(data) => {
            props?.setValue("video", data, { shouldDirty: true });
          }}
        />
      </Grid>
    </Box>
  );
};

export default FeaturedVideo;
