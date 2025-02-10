import React from "react";
import BootstrapDialog from "../modals/BootstrapDialog";
import { IconButton } from "@mui/material";
import { FaEdit } from "../../../../helpers/icons";
import EditLessonModel from "../modals/EditLessonModel";
import { useForm } from "react-hook-form";
import { PostUpdateLessonById } from "../../../../requests/admin/AdminCourseRequest";

const EditLesson = (props) => {
  const methods = useForm({
    defaultValues: {
      lesson_id: props?.c?.contentable_id,
      title: "",
      content: "",
      meta: {
        type: "",
        video: {
          video_type: "",
          video_data: {
            html_5: "",
            external_link: "",
            youtube: "",
            vimeo: "",
            embedded: "",
            shortcode: "",
          },
          video_thumbnail: "",
        },
        hours: 0,
        minutes: 0,
        seconds: 0,
        resources: [],
      },
      show: false,
    },
  });

  // console.log(methods?.watch());

  const handleEditLesson = () => {
    methods?.setValue("show", true, { shouldDirty: true });
  };

  const handleClose = () => {
    methods?.setValue("show", false, { shouldDirty: true });
  };

  const updateMutation = PostUpdateLessonById(
    props?.s?.id,
    props?.c?.contentable_id
  );
  const onSubmit = (data) => {
    updateMutation?.mutate(data, {
      onSuccess: (data) => {
        handleClose();
        props?.setValue(
          `sections.${props?.id}.contents`,
          data?.data?.section?.contents?.map((c) => {
            return {
              id: c?.ID,
              sort: c?.menu_order,
              preview: Boolean(Number(c?.rendered_metas?.preview)),
              type: c?.contentable?.type,
              title: c?.contentable?.title,
              contentable_id: c?.contentable?.id,
              course_section_id: c?.post_parent,
            };
          })
        );
      },
    });
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
    <>
      <BootstrapDialog
        open={methods?.watch("show")}
        onClose={handleClose}
        aria-labelledby="lesson-dialog-title"
        aria-describedby="lesson-dialog-description"
      >
        <EditLessonModel
          {...methods}
          colorCode={props?.colorCode}
          handleClose={handleClose}
          onSubmit={onSubmit}
          isPending={updateMutation?.isPending}
          loadEditor={loadEditor}
          removeEditor={removeEditor}
        />
      </BootstrapDialog>
      <IconButton onClick={handleEditLesson}>
        <FaEdit
          style={{
            fontSize: 14,
          }}
        />
      </IconButton>
    </>
  );
};

export default EditLesson;
