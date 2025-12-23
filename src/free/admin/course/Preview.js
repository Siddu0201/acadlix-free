import { CircularProgress, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { MdVisibility, MdVisibilityOff } from '@acadlix/helpers/icons'
import { PostTooglePreviewContent } from '@acadlix/requests/admin/AdminCourseRequest';
import { __ } from '@wordpress/i18n';
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement';
import { Link } from 'react-router-dom';

const Preview = (props) => {
    const tooglePreviewMutation = PostTooglePreviewContent(props?.s?.id, props?.c?.id);

    const handleTooglePreview = () => {
        tooglePreviewMutation?.mutate(
            {
                preview: !props?.c?.preview,
            },
            {
                onSuccess: (data) => {
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
            }
        );
    }
    return (
        // <Tooltip title={props?.c?.preview ? __("Remove from Preview", "acadlix") : __("Add to Preview", "acadlix")}>
        //     <IconButton
        //         disabled
        //     // onClick={handleTooglePreview}
        //     >
        //         {
        //             tooglePreviewMutation?.isPending ?
        //                 <CircularProgress size={14} color="inherit" />
        //                 :
        //                 props?.c?.preview ?
        //                     <MdVisibility style={{
        //                         fontSize: 14
        //                     }} />
        //                     :
        //                     <MdVisibilityOff style={{
        //                         fontSize: 14
        //                     }} />

        //         }
        //     </IconButton>
        // </Tooltip>
        <>
            <CustomFeatureElement
                element="iconbutton"
                label="preview"
                icon={<MdVisibilityOff />}
                attributes={{
                    size: 'small',
                    disabled: true,
                    color: 'grey',
                    sx: {
                        p: 1,
                    },
                    LinkComponent: Link
                }}
                iconsx={{
                    color: '#fff',
                }}
            />
        </>
    )
}

export default Preview