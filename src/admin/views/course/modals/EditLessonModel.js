import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { IoClose } from "@acadlix/helpers/icons";
import { GetLessonById } from "@acadlix/requests/admin/AdminLessonRequest";
import { __ } from "@wordpress/i18n";
import TitleSection from "../../lesson/sections/TitleSection";
import OptionSection from "../../lesson/sections/OptionSection";

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

  return (
    <Box>
      <Grid
        container
        gap={2}
      >
        <TitleSection
          {...props}
        />
        <OptionSection
          {...props}
          videoUploadGridSize={{ xs: 12, sm: 12 }}
          hourGridSize={{ xs: 4, sm: 4 }}
          minutesGridSize={{ xs: 4, sm: 4 }}
          secondsGridSize={{ xs: 4, sm: 4 }}
        />
      </Grid>
    </Box>
  );
};
