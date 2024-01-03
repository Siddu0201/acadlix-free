import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";

const CategoryTemplateSection = () => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Used to select category */}
            <Grid item xs={12} sm={3}>
              <Autocomplete
                size="small"
                options={[
                  { label: "category1" },
                  { label: "category2" },
                  { label: "category3" },
                ]}
                renderInput={(params) => (
                  <TextField {...params} label="Select Quiz Categories" />
                )}
              />
            </Grid>

            {/* Used to load quiz data from template  */}
            <Grid item xs={12} sm={9}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Autocomplete
                  sx={{
                    minWidth: {
                      xs: "200px",
                      sm: "300px",
                    },
                    marginRight: 3,
                  }}
                  size="small"
                  options={[
                    { label: "tempelate1" },
                    { label: "tempelate2" },
                    { label: "tempelate3" },
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Template" />
                  )}
                />
                <Button variant="contained" color="success" size="small">
                  Load Template
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryTemplateSection;
