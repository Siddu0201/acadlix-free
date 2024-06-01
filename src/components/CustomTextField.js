import { TextField } from '@mui/material'
import React from 'react'

const CustomTextField = (props) => {
  return (
    <TextField
        {...props}
        sx={{
            '.MuiInputBase-inputSizeSmall':{
                padding: '8.5px 14px'
            },
            '.MuiInputBase-inputMultiline':{
                padding: 0
            },
            ...props.sx
        }}
    />
  )
}

export default CustomTextField
