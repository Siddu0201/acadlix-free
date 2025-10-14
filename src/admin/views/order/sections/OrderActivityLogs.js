import React from 'react'
import { __ } from '@wordpress/i18n';
import { timelineOppositeContentClasses } from '@mui/lab';
import { getFormatDate } from '@acadlix/helpers/util';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

const OrderActivityLogs = (props) => {
    const defaultSetting = {
        component: "Grid",
        component_name: "order_activity_logs_grid",
        props: {
            size: { xs: 12, sm: 12 },
        },
        children: [
            {
                component: "Card",
                component_name: "order_activity_logs_card",
                children: [
                    {
                        component: "CardContent",
                        component_name: "order_activity_logs_card_content",
                        children: [
                            {
                                component: "Box",
                                component_name: "order_activity_logs_box",
                                props: {
                                    sx: {
                                        marginY: 2,
                                    },
                                },
                                children: [
                                    {
                                        component: "Typography",
                                        component_name: "order_activity_logs_typography",
                                        props: { variant: "h4" },
                                        value: __("Order Activity Logs", "acadlix"),
                                    },
                                    {
                                        component: "Divider",
                                        component_name: "order_activity_logs_divider",
                                    },
                                ],
                            },
                            {
                                component: "Grid",
                                component_name: "order_activity_logs_grid_container",
                                props: {
                                    container: true,
                                    spacing: { xs: 2, sm: 4 },
                                    alignItems: "center",
                                },
                                children: [
                                    {
                                        component: "Grid",
                                        component_name: "order_activity_logs_grid_item",
                                        props: {
                                            size: { xs: 12, sm: 12 },
                                        },
                                        children: [
                                            {
                                                component: "Timeline",
                                                component_name: "order_activity_logs_timeline",
                                                props: {
                                                    sx: {
                                                        [`& .${timelineOppositeContentClasses.root}`]: {
                                                            flex: 0.2,
                                                        },
                                                        paddingY: 0,
                                                        marginBottom: 0,
                                                    },
                                                },
                                                children: props?.watch("activity_logs")?.map(
                                                    (log, index) => ({
                                                        component: "TimelineItem",
                                                        component_name: "order_activity_logs_timeline_item",
                                                        index: index,
                                                        children: [
                                                            {
                                                                component: "TimelineOppositeContent",
                                                                component_name: "order_activity_logs_timeline_opposite_content",
                                                                props: { color: "textSecondary" },
                                                                value: getFormatDate(log?.created_at),
                                                            },
                                                            {
                                                                component: "TimelineSeparator",
                                                                component_name: "order_activity_logs_timeline_separator",
                                                                children: [
                                                                    {
                                                                        component: "TimelineDot",
                                                                        component_name: "order_activity_logs_timeline_dot",
                                                                    },
                                                                    index !==
                                                                    props?.watch("activity_logs")?.length - 1 && {
                                                                        component: "TimelineConnector",
                                                                        component_name: "order_activity_logs_timeline_connector",
                                                                    },
                                                                ],
                                                            },
                                                            {
                                                                component: "TimelineContent",
                                                                component_name: "order_activity_logs_timeline_content",
                                                                value: log?.meta_value,
                                                            },
                                                        ],
                                                    })
                                                ),
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const order_activity_logs = window?.acadlixHooks?.applyFilters?.(
        "acadlix.admin.order.order_activity_logs",
        [defaultSetting],
        {
            register: props?.register,
            control: props?.control,
            watch: props?.watch,
            setValue: props?.setValue,
        }
    ) ?? [];

    return (
        <>
            {order_activity_logs.map((field, i) => (
                <React.Fragment key={i}>
                    <DynamicMUIRenderer
                        item={field}
                        index={i}
                        formProps={{
                            register: props?.register,
                            setValue: props?.setValue,
                            watch: props?.watch,
                            control: props?.control,
                        }}
                    />
                </React.Fragment>
            ))}
        </>
    )
}

export default OrderActivityLogs