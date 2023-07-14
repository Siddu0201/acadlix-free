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
    <Card>
      <CardHeader title="Multiple Choice"
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <Option title="Option1" />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Option title="Option2" />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Button variant="contained" color="success">
              Add More
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
const Option = ({ title }) => {
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
            <FormControlLabel control={<Checkbox />} label="Correct" />
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Grid>
          <Grid item xs={12} lg={10}>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MultipleChoice;
