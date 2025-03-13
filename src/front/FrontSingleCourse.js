import React from 'react'
import { useForm } from 'react-hook-form'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import { IoClose } from '../helpers/icons';
import SingleCourse from './single_course/SingleCourse';
import "./AppFront.css";

const FrontSingleCourse = (props) => {
    console.log(props);
    const methods = useForm({
        defaultValues: {
            id: props?.course?.ID,
            sections:
                props?.course?.sections?.length > 0
                    ? props?.course?.sections?.map((s) => {
                        return {
                            id: s?.ID,
                            title: s?.post_title,
                            contents:
                                s?.contents?.length > 0
                                    ? s?.contents?.map((c) => {
                                        return {
                                            id: c?.ID,
                                            preview: Boolean(Number(c?.rendered_metas?.preview)),
                                            open: false,
                                            type: c?.contentable?.type,
                                            lesson_type: c?.contentable_data?.rendered_metas?.type ?? "video",
                                            title: c?.contentable_data?.post_title,
                                            content_type_id: c?.contentable?.id,
                                            content: c?.contentable_data?.rendered_post_content ?? "",
                                            video: {
                                                video_type: c?.contentable_data?.rendered_metas?.video?.video_type ?? "",
                                                video_data: {
                                                    html_5: c?.contentable_data?.rendered_metas?.video?.video_data?.html_5 ?? "",
                                                    external_link:
                                                        c?.contentable_data?.rendered_metas?.video?.video_data?.external_link ?? "",
                                                    youtube: c?.contentable_data?.rendered_metas?.video?.video_data?.youtube ?? "",
                                                    vimeo: c?.contentable_data?.rendered_metas?.video?.video_data?.vimeo ?? "",
                                                    embedded:
                                                        c?.contentable_data?.rendered_metas?.video?.video_data?.embedded ?? "",
                                                    shortcode:
                                                        c?.contentable_data?.rendered_metas?.video?.video_data?.shortcode ?? "",
                                                },
                                                video_thumbnail:
                                                    c?.contentable_data?.rendered_metas?.video?.video_thumbnail ?? "",
                                            },
                                        };
                                    })
                                    : [],
                        };
                    })
                    : [],
        }
    });

    // console.log(methods?.watch("sections"));

    React.useEffect(() => {
        const items = document.querySelectorAll(".acadlix-curriculum-content-item");
        items.forEach((item) => {
            item.addEventListener("click", () => {
                const content = {
                    index: item.getAttribute("data-section-index"),
                    c_index: item.getAttribute("data-content-index"),
                    isPreview: Boolean(Number(item.getAttribute("data-is-preview"))),
                };
                if (!content.isPreview) {
                    return;
                }
                methods?.setValue(`sections.${content.index}.contents.${content.c_index}.open`, true, { shouldDirty: true });
            });
        });

        // Cleanup event listeners
        return () => {
            items.forEach((item) =>
                item.removeEventListener("click", () => {
                    /* Cleanup function */
                })
            );
        };
    }, []);

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1),
        },
        "& .MuiPaper-root": {
            width: "100%",
        },
    }));
    const handleClose = (index = 0, c_index = 0) => {
        methods?.setValue(`sections.${index}.contents.${c_index}.open`, false, { shouldDirty: true });
    }

    return (
        <React.Fragment>
            {
                methods?.watch("sections")?.length > 0 && (
                    methods?.watch("sections")?.map((s, index) => (
                        <React.Fragment key={index}>
                            {
                                s?.contents?.length > 0 && (
                                    s?.contents?.map((c, c_index) => (
                                        <React.Fragment key={c_index}>
                                            {
                                                c?.preview && (
                                                    <BootstrapDialog
                                                        open={c?.open}
                                                        onClose={handleClose}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"
                                                    >
                                                        <DialogTitle id="alert-dialog-title" sx={{
                                                            m: 0,
                                                            p: 2,
                                                            boxShadow: (theme) => theme.shadows[1],
                                                        }}>
                                                            {c?.title}
                                                        </DialogTitle>
                                                        <IconButton
                                                            aria-label="close"
                                                            onClick={handleClose.bind(this, index, c_index)}
                                                            sx={{
                                                                position: "absolute",
                                                                right: 8,
                                                                top: 8,
                                                                backgroundColor: "transparent",
                                                                color: (theme) => theme.palette.grey[500],
                                                            }}
                                                        >
                                                            <IoClose />
                                                        </IconButton>
                                                        <DialogContent sx={{ m: 0, p: 0 }}>
                                                            <SingleCourse
                                                                handleClose={handleClose.bind(this, index, c_index)}
                                                                c={c}
                                                                index={index}
                                                                c_index={c_index}
                                                                {...methods}
                                                            />

                                                        </DialogContent>
                                                    </BootstrapDialog>
                                                )
                                            }
                                        </React.Fragment>
                                    ))
                                )
                            }
                        </React.Fragment>
                    ))
                )
            }
        </React.Fragment>
    )
}

export default FrontSingleCourse
