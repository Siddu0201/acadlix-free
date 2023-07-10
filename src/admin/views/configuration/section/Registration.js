import React from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Stack,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";

function Registration() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <Grid container>
          <GridItem1 lg={4}>
            <Stack spacing={2}>
              <h3>Enable</h3>

              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
            </Stack>
          </GridItem1>
          <GridItem1 lg={4}>
            <Stack spacing={2}>
              <h3>Required</h3>

              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
              <FormControlLabel control={<Switch />} />
            </Stack>
          </GridItem1>
          <GridItem1 lg={4}>
            <Stack spacing={3.5}>
              <h3>Label</h3>

              <FormControlLabel
                control={<TextField placeholder="First Name" />}
              />
              <FormControlLabel
                control={<TextField placeholder="Last Name" />}
              />
              <FormControlLabel
                control={<TextField placeholder="Email ID" />}
              />
              <FormControlLabel
                control={<TextField placeholder="Choose Username" />}
              />
              <FormControlLabel
                control={<TextField placeholder="Mobile Number" />}
              />
              <FormControlLabel
                control={<TextField placeholder="Highest Qualification" />}
              />
            </Stack>
          </GridItem1>
        </Grid>
      </Box>
    </div>
  );
}

export default Registration;
