import React from 'react'
import { GetStatisticByStatisticId } from '@acadlix/requests/front/FrontStatisticRequest';
import { Link, useParams } from 'react-router-dom';
import AnswerSheet from '@acadlix/modules/answersheet/AnswerSheet';
import { TiArrowLeftThick } from '@acadlix/helpers/icons';
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const ViewAnswersheet = () => {
    const { statistic_ref_id } = useParams();
    const { data, isFetching } = GetStatisticByStatisticId(statistic_ref_id);

    const colorCode = {
        button: "#13455b",
        timer: "#00f",
        answered: "#6ca54c",
        review: "#ffb800",
        answered_and_review: "#674787",
        correct: "#56AB2F",
        incorrect: "#FF6B6B",
        skipped: "#8f83f7",
        radio: "#0075ff",
        incorrect_number: "#f00",
        correct_number: "#6ca54c",
        overview_border: "#C3D1A3",
        overview_background: "#f8faf5",
        overview_button_border: "#CFCFCF",
        overview_button_background: "#fff",
        overview_button_text: "black",
        overview_button_active_text: "white",
        overview_button_active_border: "#7DB1D3",
        option_background: "#f8faf5",
        option_border: "#C3D1A3",
        hint_background: "#f8faf5",
        hint_border: "#C3D1A3",
        category_title: "#6451cd",
        leaderboard_header: "#9bbb59",
        leaderborad_text_background: "#f5faea",
    };

    const defaultSetting = {
        component: "Box",
        component_name: "acadlix_front_result_view_answersheet_box",
        children: [
            {
                component: "Grid",
                component_name: "acadlix_front_result_view_answersheet_grid",
                props: {
                    container: true,
                    spacing: 4
                },
                children: [
                    {
                        component: "Grid",
                        component_name: "acadlix_front_result_view_answersheet_grid_item",
                        props: {
                            size: {
                                xs: 12,
                                lg: 12,
                            }
                        },
                        children: [
                            {
                                component: "Button",
                                component_name: "acadlix_front_result_view_answersheet_back_button",
                                props: {
                                    variant: "contained",
                                    startIcon: <TiArrowLeftThick />,
                                    size: "medium",
                                    sx: {
                                        width: "fit-content",
                                    },
                                    LinkComponent: Link,
                                    to: `/result`
                                },
                                value: __("Back", "acadlix")
                            }
                        ]
                    },
                    {
                        component: "Grid",
                        component_name: "acadlix_front_result_view_answersheet_card_grid_item",
                        props: {
                            size: {
                                xs: 12,
                                lg: 12,
                            }
                        },
                        children: [
                            {
                                component: "Card",
                                component_name: "acadlix_front_result_view_answersheet_card",
                                children: [
                                    {
                                        component: "CardHeader",
                                        component_name: "acadlix_front_result_view_answersheet_card_header",
                                        props: {
                                            title: {
                                                component: "Box",
                                                component_name: "acadlix_front_result_view_answersheet_card_header_box",
                                                children: [
                                                    {
                                                        component: "Typography",
                                                        component_name: "acadlix_front_result_view_answersheet_card_header_box_typography",
                                                        props: {
                                                            variant: "h3",
                                                        },
                                                        value: __("AnswerSheet", "acadlix")
                                                    }
                                                ]
                                            },
                                            subheader: `${isFetching ? "" : data?.data?.quiz?.post_title}`
                                        }
                                    },
                                    {
                                        component: "CardContent",
                                        component_name: "acadlix_front_result_view_answersheet_card_content",
                                        children: [
                                            isFetching ?
                                                ({
                                                    component: "CircularProgress",
                                                    component_name: "acadlix_front_result_view_answersheet_card_content_circular_progress",
                                                    props: {
                                                        color: "inherit",
                                                        size: 20,
                                                    }
                                                })
                                                :
                                                (data?.data?.statistic_ref && !data?.data?.quiz?.rendered_metas?.quiz_settings?.hide_answer_sheet) ? ({
                                                    component: <AnswerSheet
                                                        statistic={data?.data?.statistic}
                                                        colorCode={colorCode}
                                                        quiz={data?.data?.quiz}
                                                    />,
                                                    component_name: "acadlix_front_result_view_answersheet_card_content_answer_sheet",
                                                }) :
                                                    ({
                                                        component: "Typography",
                                                        component_name: "acadlix_front_result_view_answersheet_card_content_typography",
                                                        value: __("You are not alowed to access this page.", "acadlix")
                                                    })
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

    const answerSheet_settings = window?.acadlixHooks?.applyFilters(
        "acadlix.front.result.answer_sheet",
        [defaultSetting],
        {
            statistic_ref_id: statistic_ref_id,
            isFetching: isFetching,
            statistic: data?.data?.statistic ?? {},
            quiz: data?.data?.quiz ?? {}
        }
    ) ?? [];

    return (
        <>
            {answerSheet_settings.map((field, i) => (
                <React.Fragment key={i}>
                    <DynamicMUIRenderer
                        item={field}
                        index={i}
                        formProps={{
                        }}
                    />
                </React.Fragment>
            ))}
        </>
    )
    // return (
    //     <Box>
    //         <Grid
    //             container
    //             spacing={4}
    //         >
    //             <Grid size={{ xs: 12, lg: 12 }}>
    //                 <Button
    //                     variant="contained"
    //                     startIcon={<TiArrowLeftThick />}
    //                     size="medium"
    //                     sx={{
    //                         width: "fit-content",
    //                     }}
    //                     LinkComponent={Link}
    //                     to={`/result`}
    //                 >
    //                     {__("Back", "acadlix")}
    //                 </Button>
    //             </Grid>
    //             <Grid size={{ xs: 12, lg: 12 }}>
    //                 <Card>
    //                     <CardHeader
    //                         title={__("AnswerSheet", "acadlix")}
    //                         subheader={`${isFetching ? "" : data?.data?.quiz?.post_title}`}
    //                         slotProps={{
    //                             title: {
    //                                 variant: "h3",
    //                             },
    //                         }}
    //                     />
    //                     <CardContent>
    //                         {isFetching ?
    //                             <CircularProgress color="inherit" size={20} />
    //                             : (
    //                                 (data?.data?.statistic_ref && !data?.data?.quiz?.rendered_metas?.quiz_settings?.hide_answer_sheet) ?
    //                                     <AnswerSheet
    //                                         statistic={data?.data?.statistic}
    //                                         colorCode={colorCode}
    //                                         quiz={data?.data?.quiz}
    //                                     />
    //                                     :
    //                                     __("You are not allowed to access this page.", "acadlix")
    //                             )}
    //                     </CardContent>
    //                 </Card>
    //             </Grid>
    //         </Grid>
    //     </Box>
    // )
}

export default ViewAnswersheet
