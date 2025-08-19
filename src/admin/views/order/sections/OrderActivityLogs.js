import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
} from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, timelineOppositeContentClasses, TimelineSeparator } from '@mui/lab';
import { getFormatDate } from '@acadlix/helpers/util';

const OrderActivityLogs = (props) => {
    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginY: 2,
                        }}
                    >
                        <Typography variant="h4">{__("Order Activity Logs", "acadlix")}</Typography>
                        <Divider />
                    </Box>
                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 4,
                        }}
                        alignItems="center"
                    >
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Timeline
                                sx={{
                                    [`& .${timelineOppositeContentClasses.root}`]: {
                                        flex: 0.2,
                                    },
                                    paddingY: 0,
                                    marginBottom: 0,
                                }}
                            >
                                {
                                    props?.watch("activity_logs")?.map((log, index) => {
                                        return (
                                            <TimelineItem key={index}>
                                                <TimelineOppositeContent color="textSecondary">
                                                    {getFormatDate(log?.created_at)}
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <TimelineDot />
                                                    {
                                                        index !== props?.watch("activity_logs")?.length - 1 && (
                                                            <TimelineConnector />
                                                        )
                                                    }
                                                </TimelineSeparator>
                                                <TimelineContent>{log?.meta_value}</TimelineContent>
                                            </TimelineItem>
                                        )
                                    })
                                }
                            </Timeline>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default OrderActivityLogs