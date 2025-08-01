import { Typography } from '@mui/material'
import React from 'react'

const CustomTypography = (props) => {
    return (
        <Typography
            variant="body2"
            {...props}
            sx={{
                fontWeight: 500,
                ...props?.sx,
            }}
        >
            {props?.children}
        </Typography>
    )
}

export default CustomTypography
