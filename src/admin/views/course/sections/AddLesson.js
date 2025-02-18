import { Box, Button } from "@mui/material";
import React from "react";
import BootstrapDialog from "../modals/BootstrapDialog";
import { useForm } from "react-hook-form";
import { FaPlus } from "../../../../helpers/icons";
import AddLessonModal from "../modals/AddLessonModal";
import toast from "react-hot-toast";
import { PostAddLesson } from "../../../../requests/admin/AdminCourseRequest";
import { __ } from "@wordpress/i18n";

const AddLesson = (props) => {
  const methods = useForm({
    defaultValues: {
      course_id: props?.watch("courseId"),
      lesson_type: "add_new", //add_new, existing
      lesson_ids: [],
      title: "",
      content: "",
      post_author: acadlixOptions?.user_id ?? 0,
      meta: {
        type: "video",
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

  const handleAddLesson = () => {
    methods?.reset({
      course_id: props?.watch("courseId"),
      lesson_type: "add_new", //add_new, existing
      lesson_ids: [],
      title: "",
      content: "",
      post_author: acadlixOptions?.user_id ?? 0,
      meta: {
        type: "video",
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
      show: true,
    });
  };

  // console.log(methods?.watch());

  const handleClose = () => {
    methods?.setValue("show", false, { shouldDirty: true });
  };

  const addMutation = PostAddLesson(props?.s?.id);
  const onSubmit = (data) => {
    if (data?.lesson_type === "add_new" && data?.title === "") {
      toast?.error("Title is required");
      return;
    }

    if (data?.lesson_type === "existing" && data?.lesson_ids?.length === 0) {
      toast?.error(__("Please select at least 1 lesson.", "acadlix"));
      return;
    }

    addMutation?.mutate(data, {
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
    <Box>
      <BootstrapDialog
        open={methods?.watch("show")}
        onClose={handleClose}
        aria-labelledby="lesson-dialog-title"
        aria-describedby="lesson-dialog-description"
      >
        <AddLessonModal
          {...methods}
          colorCode={props?.colorCode}
          handleClose={handleClose}
          onSubmit={onSubmit}
          isPending={addMutation?.isPending}
          create={true}
          loadEditor={loadEditor}
          removeEditor={removeEditor}
        />
      </BootstrapDialog>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={handleAddLesson}
      >
        <FaPlus
          style={{
            paddingRight: 4,
          }}
        />
        {__("Add Lesson", "acadlix")}
      </Button>
    </Box>
  );
};

export default AddLesson;
