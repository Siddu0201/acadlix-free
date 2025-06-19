import { Box, Button } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form'
import BootstrapDialog from '../modals/BootstrapDialog';
import { FaPlus } from '../../../../helpers/icons';
import { __ } from '@wordpress/i18n';
import AddAssignmentModal from '../modals/AddAssignmentModal';
import { hasCapability } from '../../../../helpers/util';
import { PostAddAssignment } from '../../../../requests/admin/AdminCourseRequest';
import toast from 'react-hot-toast';

const AddAssignmentButton = React.lazy(() =>
    process.env.REACT_APP_IS_PREMIUM === 'true' ?
        import("@acadlix/pro/admin/course/AddAssignmentButton") :
        import("@acadlix/free/admin/course/AddAssignmentButton")
);

const AddAssignment = (props) => {
    const methods = useForm({
        defaultValues: {
            course_id: props?.watch("courseId"),
            assignment_type: hasCapability("acadlix_add_assignment") ? "add_new" : "existing", //add_new, existing
            assignment_ids: [],
            title: "",
            post_content: "",
            post_author: acadlixOptions?.user_id ?? 0,
            meta: {
                allow_uploads: false,
                number_of_uploads: 1,
                allowed_mime_types: [],
                max_file_size: 2, // its in MB
                enable_marking: false,
                max_points: 0,
                start_date: "",
                end_date: "",
                enable_deadline: false,
                deadline_type: "days",
                deadline_value: 0,
                attachments: [],
            },
            show: false,
        }
    });
    // console.log(methods?.watch("meta"));

    const handleAddAssignment = () => {
        methods?.reset();
        methods?.setValue("show", true);
    }

    const handleClose = () => {
        methods?.setValue("show", false);
    }

    const addMutation = PostAddAssignment(props?.s?.id);
    const onSubmit = (data) => {
        if (data?.assignment_type === "add_new" && data?.title === "") {
            toast?.error("Title is required");
            return;
        }

        if (data?.assignment_type === "existing" && data?.assignment_ids?.length === 0) {
            toast?.error(__("Please select at least 1 assignment.", "acadlix"));
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
            }
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
        <Box>
            <BootstrapDialog
                open={methods?.watch("show")}
                onClose={handleClose}
                aria-labelledby="assignment-dialog-title"
                aria-describedby="assignment-dialog-description"
            >
                <AddAssignmentModal
                    {...methods}
                    colorCode={props?.colorCode}
                    handleClose={handleClose}
                    onSubmit={onSubmit}
                    isPending={addMutation?.isPending}
                    create={true}
                    loadEditor={loadEditor}
                    removeEditor={removeEditor}
                    existingAssignmentIds={
                        props?.watch('sections')?.map((section) => {
                            return section?.contents?.filter((content) => {
                                return content?.type === "assignment";
                            })?.map((content) => {
                                return content?.contentable_id;
                            });
                        })?.flat()
                    }
                />
            </BootstrapDialog>
            <React.Suspense fallback={null}>
              <AddAssignmentButton 
                {...props}
                handleAddAssignment={handleAddAssignment}
              />
            </React.Suspense>
            {/* <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAddAssignment}
            >
                <FaPlus
                    style={{
                        paddingRight: 4,
                    }}
                />
                {__("Add Assignment", "acadlix")}
            </Button> */}
        </Box>
    )
}

export default AddAssignment