import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  RadioGroup,
  Radio,
  Grid,
  Box,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function SingleChoice() {
  return (
    <Card>
      <CardHeader title="Single Choice"
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent>
        <RadioGroup>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <Option title="Option1" opt="opt1"></Option>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Option title="Option2" opt="opt2"></Option>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Button variant="contained" color="success">
                Add More
              </Button>
            </Grid>
          </Grid>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
const Option = ({ title, opt }) => {
  return (
    <Card>
      <CardHeader title={title}
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2}>
            <FormControlLabel control={<Radio />} label="Correct" value={opt} />
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Grid>
          <Grid item xs={12} lg={10}>
            <CustomTextField
              size="small"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default SingleChoice;
