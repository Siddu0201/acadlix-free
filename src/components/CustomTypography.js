import { Typography } from '@mui/material'
import React from 'react'

const CustomTypography = (props) => {
    return (
        <Typography
            {...props}
            variant="body2"
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
