import React from 'react'
import { Avatar, Box, Card, CardContent, CardHeader, Button, Typography } from '@mui/material'
import { __ } from '@wordpress/i18n'
import { FaCloudUploadAlt, iconMap } from '@acadlix/helpers/icons'

const ExternalAddonCard = (props) => {
    const Icon = iconMap[props?.icon] || iconMap['FaLock'];
    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                title={
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Avatar sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: 'primary.main',
                        }}>
                            {Icon}
                        </Avatar>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{
                                textTransform: 'none',
                            }}
                        >
                            {__('Activate', 'acadlix')}
                        </Button>
                    </Box>
                }
            />
            <CardContent>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        marginBottom: 2,
                    }}
                >
                    {props?.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 400,
                        color: 'text.secondary',
                    }}
                >
                    {props?.description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ExternalAddonCard