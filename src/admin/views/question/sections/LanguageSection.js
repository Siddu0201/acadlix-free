import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
  } from "@mui/material";
  import React from "react";
  
  const LanguageSection = () => {
    return (
      <Grid item xs={12} sm={12}>
        <Card>
          <CardHeader
            title="Language"
            titleTypographyProps={{
              sx: {
                fontWeight: 500,
                color: "black",
              },
            }}
          />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  multiple
                  fullWidth
                  size="small"
                  options={["English", "Hindi"]}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Add Language" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <FormControl
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FormLabel
                    sx={{
                      marginRight: 3,
                      color: "black",
                      fontWeight: 400,
                      fontSize: "1.05rem",
                    }}
                  >
                    Change Language:
                  </FormLabel>
                  <RadioGroup row>
                    <FormControlLabel
                      control={<Radio />}
                      value="English"
                      label={
                        <>
                          English
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              marginX: 2,
                            }}
                          >
                            Make Default
                          </Button>
                        </>
                      }
                    />
                    <FormControlLabel
                      control={<Radio />}
                      value="Hindi"
                      label={
                        <>
                          Hindi
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              marginX: 2,
                            }}
                          >
                            Make Default
                          </Button>
                        </>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };
  
  export default LanguageSection;
  