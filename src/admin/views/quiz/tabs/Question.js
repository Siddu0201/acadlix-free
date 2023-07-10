import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Radio,
  Switch,
  RadioGroup,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
function Question() {
  return (
    <div>
        <Grid container>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Show Marks" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Display Subject" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Skip Question" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Number Answer" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="normal"
                control={<Radio />}
                label="Numeric"
              />
              <FormControlLabel
                value="normal"
                control={<Radio />}
                label="Albhabet"
              />
            </RadioGroup>
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Random Question" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Random Option" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
           <FormControlLabel control={<Switch />} label="Do not Randomize Last Option" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Question Overview" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Question Numbering" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Sort By Subject" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Report Question" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Bookmark" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Solution" />
          </GridItem1>
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<Switch />} label="Force User to Answer Each Question" />
          </GridItem1>
        </Grid>
    </div>
  );
}

export default Question;
