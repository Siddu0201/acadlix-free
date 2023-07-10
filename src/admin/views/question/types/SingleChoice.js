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
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function SingleChoice() {
  return (
    <div>
      <RadioGroup>
        <Option title="Option1" opt="opt1"></Option>
        <Option title="Option2" opt="opt2"></Option>
      </RadioGroup>
    </div>
  );
}
const Option = ({ title, opt }) => {
  return (
    <Card sx={{ margin: "10px" }}>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <FormControlLabel control={<Radio />} label="Correct" value={opt} />
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              size="small"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default SingleChoice;
