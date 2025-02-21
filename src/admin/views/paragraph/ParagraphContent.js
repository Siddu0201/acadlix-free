import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { useForm } from "react-hook-form";
import { TiArrowLeftThick } from "../../../helpers/icons";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PostCreateQuizParagraph,
  UpdateQuizParagraphById,
} from "../../../requests/admin/AdminParagraphRequest";
import ParagraphLanguageSection from "./sections/ParagraphLanguageSection";
import ParagraphContentSection from "./sections/ParagraphContentSection";
import ParagraphTitleSection from "./sections/ParagraphTitleSection";
import { __ } from "@wordpress/i18n";

const ParagraphContent = (props) => {
  const methods = useForm({
    defaultValues: {
      id: props?.paragraph?.ID ?? null,
      post_parent: props?.create ? Number(props?.quiz_id) : props?.paragraph?.post_parent,
      post_title: props?.paragraph?.post_title ?? "",
      post_author: acadlixOptions?.user_id ?? 0,
      multi_language: Boolean(Number(props?.quiz?.rendered_metas?.multi_language)),
      meta: {
        language_data: props?.paragraph?.rendered_metas?.language_data ??
          props?.quiz?.languages?.map((lang) => {
            return {
              language_id: lang?.term_id,
              default: Boolean(Number(lang?.default)),
              selected: Boolean(Number(lang?.default)),
              content: "",
            };
          }),
      }
    },
  });

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
        textarea_rows: 30,
        setup: function (editor) {
          editor.on("input change", function (e) {
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

  const navigate = useNavigate();
  const createMutation = PostCreateQuizParagraph(props?.quiz_id);
  const updateMutation = UpdateQuizParagraphById(
    props?.quiz_id,
    props?.paragraph_id
  );

  // console.log(methods?.watch());

  const onSubmit = (data) => {
    if (props?.create) {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(__("Paragraph created successfully.", "acadlix"));
          navigate(`/${props?.quiz_id}/paragraph`);
        },
      });
    } else {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success(__("Paragraph updated successfully.", "acadlix"));
          navigate(`/${props?.quiz_id}/paragraph`);
        },
      });
    }
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
                to={`/${props?.quiz_id}/paragraph`}
              >
                {__("Back", "acadlix")}
              </Button>
              <Typography variant="h6">
                {props?.create
                  ? __("Create Paragraph", "acadlix")
                  : __("Edit Paragraph", "acadlix")}
              </Typography>
            </Box>
          </Grid>

          <ParagraphTitleSection {...methods} />

          {methods?.watch("multi_language") && (
            <ParagraphLanguageSection {...methods} {...props} />
          )}

          {methods?.watch("meta.language_data")?.length > 0 &&
            methods?.watch("meta.language_data")?.map((lang, index) => (
              <React.Fragment key={index}>
                {/* Section contain question */}
                <ParagraphContentSection
                  {...props}
                  {...methods}
                  loadEditor={loadEditor}
                  removeEditor={removeEditor}
                  index={index}
                  lang={lang}
                />
              </React.Fragment>
            ))}
          <Grid size={{ xs: 12, sm: 12 }}>
            <Button variant="contained" type="submit">
              {createMutation?.isPending || updateMutation?.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                __("Save Change", "acadlix")
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ParagraphContent;
