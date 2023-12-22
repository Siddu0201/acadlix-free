import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Radio,
  Switch,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
function Question() {
  return (
    <div>
      <Grid container>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel control={<Switch />} label="Show Marks" />
          <FormHelperText>(Show +point & -point)</FormHelperText>
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
        <GridItem1 xs={12} lg={8}>
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
          <FormHelperText>(Only for single and mulitple choice)</FormHelperText>
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Do not randomize last option"
          />
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
        <GridItem1 xs={12} lg={6}>
          <FormControlLabel
            control={<Switch />}
            label="Attempt & more forward automatically"
          />
          <FormHelperText>(only for single choice)</FormHelperText>
        </GridItem1>
        <GridItem1 xs={12} lg={4}>
          <FormControlLabel
            control={<Switch />}
            label="Force User to Answer Each Question"
          />
        </GridItem1>
      </Grid>
    </div>
  );
}

export default Question;
