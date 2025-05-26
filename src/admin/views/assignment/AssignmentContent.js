import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { PostCreateAssignment, UpdateAssignmentById } from '../../../requests/admin/AdminAssignmentRequest';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TiArrowLeftThick } from '../../../helpers/icons';
import TitleSection from './sections/TitleSection';
import OptionSection from './sections/OptionSection';
import { __ } from '@wordpress/i18n';
import InstructionSection from './sections/InstructionSection';
import AttachmentsSection from './sections/AttachmentsSection';

const AssignmentContent = (props) => {
  const methods = useForm({
    defaultValues: {
      title: props?.assignment?.post_title ?? "",
      post_content: props?.assignment?.post_content ?? "",
      post_author: acadlixOptions?.user_id ?? 0,
      meta: {
        allow_uploads: Boolean(props?.assignment?.rendered_metas?.allow_uploads) ?? false,
        number_of_uploads: props?.assignment?.rendered_metas?.number_of_uploads ?? 1,
        allowed_mime_types: props?.assignment?.rendered_metas?.allowed_mime_types ?? [],
        max_file_size: props?.assignment?.rendered_metas?.max_file_size ?? 2, // its in MB
        enable_marking: Boolean(props?.assignment?.rendered_metas?.enable_marking) ?? false,
        max_points: props?.assignment?.rendered_metas?.max_points ?? 0,
        start_date: props?.assignment?.rendered_metas?.start_date ?? "",
        end_date: props?.assignment?.rendered_metas?.end_date ?? "",
        enable_deadline: Boolean(props?.assignment?.rendered_metas?.enable_deadline) ?? false,
        deadline_type: props?.assignment?.rendered_metas?.deadline_type ?? "days",
        deadline_value: props?.assignment?.rendered_metas?.deadline_value ?? 0,
        attachments: props?.create
          ? []
          : props?.assignment?.rendered_metas?.attachments?.map((a) => {
            return {
              title: a?.title,
              type: a?.type,
              filename: a?.filename,
              file_url: a?.file_url,
              link: a?.link,
            };
          }) ?? [],
      },
    },
  });

  // console.log(methods?.watch("meta"));
  const navigate = useNavigate();
  const createMutation = PostCreateAssignment();
  const updateMutation = UpdateAssignmentById(props?.assignment_id);

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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                {props?.create ? __("Create Assignment", "acadlix") : __("Edit Assignment", "acadlix")}
              </Typography>
            </Box>
          </Grid>

          <TitleSection {...methods} {...props} />

          <InstructionSection
            {...methods}
            {...props}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />

          <OptionSection {...methods} {...props} />

          <AttachmentsSection {...methods} {...props} />

          <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
              <CardContent>
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  loading={createMutation?.isPending || updateMutation?.isPending}
                >
                  {__("Save Change", "acadlix")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default AssignmentContent