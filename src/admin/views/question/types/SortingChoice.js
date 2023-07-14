import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  TextareaAutosize,
  Grid,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function SortingChoice() {
  return (
    <Card>
      <CardHeader title="Sorting Choice"
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <Option title="Option1"></Option>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Option title="Option2"></Option>
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
      }}></CardHeader>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button variant="contained" color="error">
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default SortingChoice;
