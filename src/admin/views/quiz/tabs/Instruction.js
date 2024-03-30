import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import GridItem1 from '../../../../components/GridItem1'

const Instruction = (props) => {
  const loadPage = () => {
    props?.loadEditor("instruction1", "instruction1");
    props?.loadEditor("instruction2", "instruction2");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("instruction1");
      props?.removeEditor("instruction2");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={12}>
          <Typography variant='h6'>Instruction 1</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <textarea
            id="instruction1"
            style={{
              width: '100%'
            }}
          />
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <Typography variant='h6'>Instruction 2</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <textarea
            id="instruction2"
            style={{
              width: '100%'
            }}
          />
        </GridItem1>
      </Grid>
    </Box>
  )
}

export default Instruction
