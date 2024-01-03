import React from "react";
import {
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomSwitch from "../../../../components/CustomSwitch";
function Question() {
  return (
    <div>
      <Box sx={{ color: 'black'}}>
        <Grid container>
          <GridItem1 xs={12} lg={12}>
              <Typography variant="h6">Question Options</Typography>
          </GridItem1>

          {/* Used to show morks - +points & -points in question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Show Marks" />
            <FormHelperText>(Show +point & -point)</FormHelperText>
          </GridItem1>

          {/* Display subject in question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Display Subject" />
          </GridItem1>

          {/* Show skip button in question to skip question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Skip Question" />
          </GridItem1>

          {/* Show bullets in answer option- only for single and multiple choice */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Answer Bullet" />
          </GridItem1>

          {/* Type of bullets to show Numeric/Alphabatic */}
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

          {/* Used to randomize question */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Random Question" />
          </GridItem1>

          {/* Used to randomize answer options - only for single and multiple choice */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Random Option" />
            <FormHelperText>(Only for single and mulitple choice)</FormHelperText>
          </GridItem1>

          {/* Used to stop randomization of last option */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel
              control={<CustomSwitch />}
              label="Do not randomize last option"
            />
          </GridItem1>

          {/* Used to show question overview in top of quiz */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Question Overview" />
          </GridItem1>

          {/* Used to hide question numbering  */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Hide Question Numbering" />
          </GridItem1>

          {/* Sort question according to subject */}
          <GridItem1 xs={12} lg={4}>
            <FormControlLabel control={<CustomSwitch />} label="Sort By Subject" />
          </GridItem1>

          {/* Attempt question and move forward automatically- only for single choice */}
          <GridItem1 xs={12} lg={6}>
            <FormControlLabel
              control={<CustomSwitch />}
              label="Attempt & more forward automatically"
            />
            <FormHelperText>(only for single choice)</FormHelperText>
          </GridItem1>

          {/* Force user to answer each question */}
          <GridItem1 xs={12} lg={6}>
            <FormControlLabel
              control={<CustomSwitch />}
              label="Force User to Answer Each Question"
            />
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
}

export default Question;
