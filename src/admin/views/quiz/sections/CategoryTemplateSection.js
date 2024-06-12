import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";
import { PostCreateCategory } from "../../../../requests/admin/AdminCategoryRequest";

const CategoryTemplateSection = (props) => {
  const [input, setInput] = React.useState("");
  const [categories, setCategories] = React.useState(props?.categories);
  const updateMutation = PostCreateCategory();

  const createCategory = () => {
    updateMutation.mutate({category: input}, {
      onSuccess: (data)=> {
        setCategories(data?.data?.categories);
        props?.setValue("category_id", data?.data?.category_id ??  null, {
          shouldDirty: true,
        });
      }
    })
  }

  
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Used to select category */}
            <Grid item xs={12} sm={3}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("category_id") !== null
                    ? categories?.filter(
                        (option) => props?.watch("category_id") === option?.id
                      )?.[0]
                    : null
                }
                options={categories ? categories : []}
                getOptionLabel={(option) => option?.category_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "spoc_gender",
                    }}
                    label="Select Quiz Category"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {updateMutation?.isPending ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    onChange={(e) => setInput(e.target.value)}
                  />
                )}
                onChange={(_, newValue) => {
                  props?.setValue("category_id", newValue?.id ??  null, {
                    shouldDirty: true,
                  });
                }}
                PaperComponent={(data) => {
                  return (
                    <Paper>
                      {data?.children}
                      <Button
                        color="primary"
                        fullWidth
                        sx={{ justifyContent: "flex-start", pl: 2 }}
                        onMouseDown={createCategory}
                      >
                        + Add New
                      </Button>
                    </Paper>
                  );
                }}
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
