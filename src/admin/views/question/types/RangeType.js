import React from "react";
import {
  CardHeader,
  CardContent,
  Grid,
  Card,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
function RangeType() {
  return (
    <Card>
      <CardHeader title="Range Type"
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Range From"
              type="Number"
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Range To"
              type="number"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default RangeType;
