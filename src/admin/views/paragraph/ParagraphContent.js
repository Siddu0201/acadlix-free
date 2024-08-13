import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import CustomTextField from "../../../components/CustomTextField";
import toast from "react-hot-toast";
import {
  PostCreateQuizParagraph,
  UpdateQuizParagraphById,
} from "../../../requests/admin/AdminParagraphRequest";
import ParagraphLanguageSection from "./sections/ParagraphLanguageSection";
import ParagraphContentSection from "./sections/ParagraphContentSection";
import ParagraphTitleSection from "./sections/ParagraphTitleSection";

const ParagraphContent = (props) => {
  const methods = useForm({
    defaultValues: {
      id: props?.paragraph?.id ?? null,
      quiz_id: Number(props?.quiz_id),
      title: props?.paragraph?.title ?? "",
      language: props?.create
        ? props?.quiz?.quiz_languages?.map((lang) => {
            return {
              id: null,
              language_id: lang?.language_id,
              language_name: lang?.language?.language_name,
              default: Boolean(Number(lang?.default)),
              selected: Boolean(Number(lang?.default)),
              content: "",
            };
          })
        : props?.quiz?.quiz_languages?.map((lang) => {
            if (
              props?.paragraph?.paragraph_languages?.findIndex(
                (plang) => plang?.language_id === lang?.language_id
              ) !== -1
            ) {
              let paralang = props?.paragraph?.paragraph_languages?.find(
                (plang) => plang?.language_id === lang?.language_id
              );
              return {
                id: paralang?.id,
                language_id: paralang?.language_id,
                language_name: paralang?.language?.language_name,
                default: Boolean(Number(lang?.default)),
                selected: Boolean(Number(lang?.default)),
                content: paralang?.content,
              };
            } else {
              return {
                id: null,
                language_id: lang?.language_id,
                language_name: lang?.language?.language_name,
                default: Boolean(Number(lang?.default)),
                selected: Boolean(Number(lang?.default)),
                content: "",
              };
            }
          }),
    },
  });

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
          toast.success("Paragraph created successfully.");
          navigate(`/quiz/${props?.quiz_id}/paragraph`);
        },
      });
    } else {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Paragraph updated successfully.");
          navigate(`/quiz/${props?.quiz_id}/paragraph`);
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
                to={`/quiz/${props?.quiz_id}/paragraph`}
              >
                Back
              </Button>
              <Typography variant="h6">
                {props?.create ? "Create Paragraph" : "Edit Paragraph"}
              </Typography>
            </Box>
          </Grid>
          
          <ParagraphTitleSection {...methods} />

          {Boolean(props?.quiz?.multi_language) && (
            <ParagraphLanguageSection {...methods} />
          )}

          {methods?.watch("language")?.length > 0 &&
            methods?.watch("language")?.map((lang, index) => (
              <React.Fragment key={index}>
                {/* Section contain question */}
                <ParagraphContentSection
                  {...methods}
                  loadEditor={loadEditor}
                  removeEditor={removeEditor}
                  index={index}
                  lang={lang}
                />
              </React.Fragment>
            ))}
          <Grid item xs={12} sm={12}>
            <Button variant="contained" type="submit">
              {createMutation?.isPending || updateMutation?.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save Change"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ParagraphContent;
