import React from 'react'
import { useForm } from 'react-hook-form'
import BootstrapDialog from '../modals/BootstrapDialog';
import { FaEdit } from '../../../../helpers/icons';
import { PostUpdateAssignmentById } from '../../../../requests/admin/AdminCourseRequest';
import { IconButton } from '@mui/material';
import EditAssignmentModal from '../modals/EditAssignmentModal';

const EditAssignment = (props) => {
  const methods = useForm({
    defaultValues: {
      assignment_id: props?.c?.contentable_id,
      title: "",
      post_content: "",
      post_author: acadlixOptions?.user_id ?? 0,
      meta: {
        assignment_type: "writing",
        allow_multiple: false,
        allowed_mime_types: [],
        enable_marking: false,
        max_marks: 0,
        start_date: "",
        end_date: "",
        resources: [],
      },
      show: false,
    }
  });

  const handleEditAssignment = () => {
    methods?.setValue("show", true, { shouldDirty: true });
  }

  const handleClose = () => {
    methods?.setValue("show", false, { shouldDirty: true });
  }

  const updateMutation = PostUpdateAssignmentById(
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
  }

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
        aria-labelledby="assignment-dialog-title"
        aria-describedby="assignment-dialog-description"
      >
        <EditAssignmentModal
          {...methods}
          colorCode={props?.colorCode}
          handleClose={handleClose}
          onSubmit={onSubmit}
          isPending={updateMutation?.isPending}
          loadEditor={loadEditor}
          removeEditor={removeEditor}
        />
      </BootstrapDialog>
      <IconButton onClick={handleEditAssignment}>
        <FaEdit
          style={{
            fontSize: 14,
          }}
        />
      </IconButton>
    </>
  )
}

export default EditAssignment