import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import TitleSection from "./sections/TitleSection";
import ContentSection from "./sections/ContentSection";
import OptionSection from "./sections/OptionSection";
import {
  PostCreateLesson,
  UpdateLessonById,
} from "../../../requests/admin/AdminLessonRequest";

const LessonContent = (props) => {
  const methods = useForm({
    defaultValues: {
      title: props?.lesson?.title ?? "",
      content: props?.lesson?.content ?? "",
      type: props?.lesson?.type ?? "",
      duration: props?.lesson?.duration ?? 0,
      duration_type: props?.lesson?.duration_type ?? "minute",
      preview: Boolean(Number(props?.lesson?.preview)) ?? false,
      resources: props?.create
        ? []
        : props?.lesson?.lesson_resources?.map((r) => {
            return {
              id: r?.id,
              title: r?.title,
              type: r?.type,
              filename: r?.filename,
              file_url: r?.file_url,
              link: r?.link,
            };
          }),
    },
  });
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
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv,listbuttons",
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
          <Grid item xs={12} sm={12}>
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
                Back
              </Button>
              <Typography variant="h6">
                {props?.create ? "Create Lesson" : "Edit Lesson"}
              </Typography>
            </Box>
          </Grid>

          <TitleSection {...methods} {...props} />

          <ContentSection
            {...methods}
            {...props}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />

          <OptionSection {...methods} {...props} />

          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Button variant="contained" size="medium" type="submit">
                  {createMutation?.isPending || updateMutation?.isPending ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Save Change"
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
