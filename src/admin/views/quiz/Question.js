import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Radio,
  Switch,
  RadioGroup,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
function Question() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Show Marks" />
            <FormControlLabel control={<Switch />} label="Number Answer" />
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
            <FormControlLabel control={<Switch />} label="Question Overview" />
            <FormControlLabel control={<Switch />} label="Report Question" />
            <FormControlLabel
              control={<Switch />}
              label="Force User to Answer Each Question"
            />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Display Subject" />
            <FormControlLabel control={<Switch />} label="Random Question" />
            <FormControlLabel control={<Switch />} label="Question Numbering" />
            <FormControlLabel control={<Switch />} label="Bookmark" />
          </GridItem1>
          <GridItem1 lg={4} xs={12}>
            <FormControlLabel control={<Switch />} label="Skip Question" />
            <FormControlLabel control={<Switch />} label="Random Option" />
            <FormControlLabel
              control={<Switch />}
              label="Do not Randomize Last Option"
            />
            <FormControlLabel control={<Switch />} label="Sort By Subject" />
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
}

export default Question;
