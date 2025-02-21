import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { useForm } from "react-hook-form";
import { TiArrowLeftThick } from "../../../helpers/icons";
import { Link, useNavigate } from "react-router-dom";
import TitleSection from "./sections/TitleSection";
import ContentSection from "./sections/ContentSection";
import OptionSection from "./sections/OptionSection";
import {
  PostCreateLesson,
  UpdateLessonById,
} from "../../../requests/admin/AdminLessonRequest";
import { __ } from "@wordpress/i18n";

const LessonContent = (props) => {
  const methods = useForm({
    defaultValues: {
      title: props?.lesson?.post_title ?? "",
      content: props?.lesson?.post_content ?? "",
      post_author: acadlixOptions?.user_id ?? 0,
      meta: {
        type: props?.lesson?.rendered_metas?.type ?? "video",
        video: {
          video_type: props?.lesson?.rendered_metas?.video?.video_type ?? "",
          video_data: {
            html_5: props?.lesson?.rendered_metas?.video?.video_data?.html_5 ?? "",
            external_link: props?.lesson?.rendered_metas?.video?.video_data?.external_link ?? "",
            youtube: props?.lesson?.rendered_metas?.video?.video_data?.youtube ?? "",
            vimeo: props?.lesson?.rendered_metas?.video?.video_data?.vimeo ?? "",
            embedded: props?.lesson?.rendered_metas?.video?.video_data?.embedded ?? "",
            shortcode: props?.lesson?.rendered_metas?.video?.video_data?.shortcode ?? "",
          },
          video_thumbnail: props?.lesson?.rendered_metas?.video?.video_thumbnail ?? "",
        },
        hours: props?.lesson?.rendered_metas?.hours ?? 0,
        minutes: props?.lesson?.rendered_metas?.minutes ?? 0,
        seconds: props?.lesson?.rendered_metas?.seconds ?? 0,
        resources: props?.create
          ? []
          : props?.lesson?.rendered_metas?.resources?.map((r) => {
            return {
              title: r?.title,
              type: r?.type,
              filename: r?.filename,
              file_url: r?.file_url,
              link: r?.link,
            };
          }),
      }
    },
  });

  // console.log(methods?.watch());
  const navigate = useNavigate();
  const createMutation = PostCreateLesson();
  const updateMutation = UpdateLessonById(props?.lesson_id);

  const onSubmit = (data) => {
    if (props?.create) {
      createMutation?.mutate(data, {
        onSuccess: () => {
          navigate("/");
        },
      });
    } else {
      updateMutation?.mutate(data, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        plugins:
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern wpview",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons",
        toolbar2:
          "styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
        textarea_rows: 80,
        setup: function (editor) {
          editor.on("input change", function () {
            methods.setValue(name, window.wp.editor.getContent(key), {
              shouldDirty: true,
            });
          });
        },
      },
      quicktags: true,
      mediaButtons: true,
    });
  };

  const removeEditor = (key) => {
    window.wp.editor.remove(key);
  };

  return (
    <Box>
      <form onSubmit={methods?.handleSubmit(onSubmit)}>
        <Grid
          container
          rowSpacing={3}
          spacing={4}
          sx={{
            padding: 4,
          }}
        >
          <Grid size={{ xs: 12, sm: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<TiArrowLeftThick />}
                size="medium"
                sx={{
                  width: "fit-content",
                }}
                LinkComponent={Link}
                to="/"
              >
                {__("Back", "acadlix")}
              </Button>
              <Typography variant="h6">
                {props?.create ? __("Create Lesson", "acadlix") : __("Edit Lesson", "acadlix")}
              </Typography>
            </Box>
          </Grid>

          <TitleSection {...methods} {...props} />

          {/* <ContentSection
            {...methods}
            {...props}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          /> */}

          <OptionSection
            {...methods}
            {...props}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />

          <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
              <CardContent>
                <Button variant="contained" size="medium" type="submit">
                  {createMutation?.isPending || updateMutation?.isPending ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    __("Save Change", "acadlix")
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LessonContent;
