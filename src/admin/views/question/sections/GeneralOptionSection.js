import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";

const GeneralOptionSection = (props) => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="General Options"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <CustomTextField fullWidth size="small" label="Question Title" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="+ Point"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="- Point"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                fullWidth
                size="small"
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Subject" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                fullWidth
                size="small"
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Topic" />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GeneralOptionSection;
