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
import { CiLock, FaCloudUploadAlt } from '@acadlix/helpers/icons'

const LockedAddonCard = () => {
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
                            <FaCloudUploadAlt />
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
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        marginBottom: 2,
                    }}
                >
                    {__('Bulk Question Upload', 'acadlix')}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 400,
                        color: 'text.secondary',
                    }}
                >
                    {__('This addon is used for bulk question uploads.', 'acadlix')}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default LockedAddonCard