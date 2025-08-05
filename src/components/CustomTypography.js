import { Typography } from '@mui/material'
import React from 'react'

const CustomTypography = (props) => {
    return (
        <Typography
            variant="body2"
            {...props}
            sx={{
                fontWeight: {
                    xs: 600,
                    sm: 600,
                    md: 600,
                },
                ...props?.sx,
            }}
        >
            {props?.children}
        </Typography>
    )
}

export default CustomTypography
