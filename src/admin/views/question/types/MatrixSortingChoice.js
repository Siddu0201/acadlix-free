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
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
function MatrixSortingChoice() {
  return (
    <Card>
      <CardHeader title="Matrix Sorting Choice"
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
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={6}>
            <Typography variant="body1" sx={{
              fontWeight: 500,
              marginY: 2
            }}>
              Criteria
            </Typography>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <Typography variant="body1" sx={{
              fontWeight: 500,
              marginY: 2
            }}>
              Sort Element
            </Typography>
            <CustomTextField
              fullWidth
              size="small"
              multiline
              rows={4}
            />
          </Grid>
          <GridItem1 lg={12} xs={12}>
            <Button variant="contained" color="error">
              Delete
            </Button>
          </GridItem1>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MatrixSortingChoice;
