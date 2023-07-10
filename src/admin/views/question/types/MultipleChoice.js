import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  Checkbox,
  TextareaAutosize,
  Card,
  Grid,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function MultipleChoice() {
  return (
    <div>
      <Option title="Option1" />
      <Option title="Option2" />
      <Button variant="contained" color="success" sx={{ margin: "10px" }}>
        Add More
      </Button>
    </div>
  );
}
const Option = ({ title }) => {
  return (
    <Card sx={{ margin: "10px" }}>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <FormControlLabel control={<Checkbox />} label="Correct" />
          </Grid>
          <Grid item xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
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
export default MultipleChoice;
