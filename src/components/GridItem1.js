import { Grid } from '@mui/material'
import React from 'react'

const GridItem1 = (props) => {
  return (
    <Grid item {...props} sx={{
        paddingLeft: 4,
        paddingTop: 4,
        ...props.sx
    }}></Grid>
  )
}

export default GridItem1
