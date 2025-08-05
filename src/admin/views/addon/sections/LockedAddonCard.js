import React from 'react'
import { 
    Avatar, 
    Box, 
    Card, 
    CardContent, 
    CardHeader, 
    IconButton, 
    Tooltip, 
    Typography 
} from '@mui/material'
import { __ } from '@wordpress/i18n'
import { CiLock, iconMap } from '@acadlix/helpers/icons'

const LockedAddonCard = (props) => {
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
                            backgroundColor: `${props?.icon_color || 'primary.main'}`,
                        }}>
                           {Icon}
                        </Avatar>
                        <Tooltip title={__('Available in Pro', "acadlix")} arrow placement='top'>
                            <IconButton>
                                <CiLock />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
            />
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        marginBottom: 2,
                    }}
                >
                    {props?.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {props?.description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default LockedAddonCard