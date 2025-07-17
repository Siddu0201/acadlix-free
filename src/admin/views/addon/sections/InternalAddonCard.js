import React from 'react'
import { 
    Avatar, 
    Box, 
    Card, 
    CardContent, 
    CardHeader, 
    CircularProgress, 
    FormControlLabel, 
    Typography 
} from '@mui/material'
import { __ } from '@wordpress/i18n'
import { iconMap } from '@acadlix/helpers/icons'
import CustomSwitch from '@acadlix/components/CustomSwitch'
import { PostUpdateInternalAddon } from '@acadlix/requests/admin/AdminAddonRequest'

const InternalAddonCard = (props) => {
    const Icon = iconMap[props?.icon] || iconMap['FaCloudUploadAlt'];
    const updateMutation = PostUpdateInternalAddon();
    const handleChange = (e) => {
        if (e?.target?.checked !== undefined) {
            const data = {
                key: props?.option_name,
                value: e?.target?.checked ? e?.target?.value : "no"
            };
            updateMutation.mutate(data, {
                onSuccess: () => {
                    window.location.reload();
                }
            });
        }
    };
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
                        {
                            updateMutation?.isPending ? (
                                <CircularProgress size={20} />
                            ) : (
                                <FormControlLabel
                                    control={
                                        <CustomSwitch
                                            checked={props?.active}
                                            onChange={handleChange}
                                            name="checked"
                                            color="primary"
                                            value="yes"
                                        />
                                    }
                                />
                            )
                        }
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

export default InternalAddonCard