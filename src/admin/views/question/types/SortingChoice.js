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
    <div>
      <Option title="Option1"></Option>
      <Option title="Option2"></Option>
    </div>
  );
}
const Option = ({ title }) => {
  return (
    <Card sx={{ margin: "10px" }}>
      <CardHeader title={title}></CardHeader>
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
