import Grid from '@mui/material/Grid';
import React from 'react'

const GridItem1 = (props) => {
  return (
    <Grid {...props} sx={{
      // paddingLeft: 4,
      // paddingTop: 4,
      ...props.sx
    }}></Grid>
  )
}

export default GridItem1
