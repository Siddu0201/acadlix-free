import * as React from "react";
import {
  Box,
  Paper,
  Grid,
  styled,
  useTheme,
  useMediaQuery,
  Dialog,
  UseState,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Container,
  TextField,
  TextareaAutosize,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
import Card1 from "../../../components/Card1";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Course() {
  const theme = useTheme();
  const showDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const {wp} = window;
  // console.log(wp);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const instructor = [
    { label: "instructor1" },
    { label: "instructor2" },
    { label: "instructor3" },
  ];

  const styling = { p: 1, mb: "15px" };
  return (
    <Box>
      <Grid container>
        <GridItem1 lg={3} md={3} sm={3} xs={0}>
          <Card
            sx={{
              height: "100%",
            }}
          >
            <CardContent>Sidebar</CardContent>
          </Card>
        </GridItem1>
        <Grid lg={9} md={9} sm={9} xs={12}>
          <FormControl sx={{ width: "100%" }}>
            <Grid container>
              <GridItem1 lg={8} md={8} sm={8} xs={12}>
                <Item sx={{ boxShadow: 0, textAlign: "left" }}>
                  <Container maxWidth="100%" sx={styling}>
                    <h3>Add Course</h3>
                    <Button variant="contained" color="success">
                      Description
                    </Button>
                    <Button variant="outlined" color="success">
                      Course Content
                    </Button>
                  </Container>
                  
                  <Container maxWidth="100%" sx={styling}>
                    <h3>Course Name</h3>
                    <TextField fullWidth id="fullWidth" />
                  </Container>
                  <Container maxWidth="100%" sx={styling}>
                    <h3>Course Tagline</h3>
                    <TextField fullWidth />
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <h3>Outcomes</h3>
                    <TextField fullWidth placeholder="Outcome1" />
                    <TextField fullWidth placeholder="Outcome2" />
                    <Button variant="contained" color="success">
                      Add More
                    </Button>
                  </Container>
                  <Container maxWidth="100%" sx={styling}>
                    <h3>Short Description</h3>
                    <TextareaAutosize minRows={4} style={{ width: "100%" }} />
                  </Container>
                  <Container maxWidth="100%" sx={styling}>
                    <h3>Long Description</h3>
                    <TextareaAutosize minRows={8} style={{ width: "100%" }} />
                  </Container>
                  <Container maxWidth="100%" sx={styling}>
                    <h3>Prerequisite</h3>
                    <TextareaAutosize minRows={4} style={{ width: "100%" }} />
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                    }}
                  >
                    <h3>This Course includes</h3>
                    <TextField fullWidth placeholder="description" />

                    <Button
                      style={{ marginTop: "5px" }}
                      variant="contained"
                      color="success"
                    >
                      Add More
                    </Button>
                  </Container>
                </Item>
              </GridItem1>
              <GridItem1 lg={4} md={4} sm={4} xs={12}>
                <Card1 variant="outlined">
                  <CardHeader title="Draft" />
                  <CardContent>
                    <TextField fullWidth placeholder="description" />
                  </CardContent>
                </Card1>

                <Card1 variant="outlined">
                  <CardHeader title="Price" />
                  <CardContent>
                    <TextField fullWidth />
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Discount"
                      />
                    </FormGroup>
                    <TextField fullWidth />
                  </CardContent>
                </Card1>

                <Card1 variant="outlined">
                  <CardHeader title="Categories" />
                  <CardContent>
                    <TextField fullWidth />
                  </CardContent>
                </Card1>

                <Card1 variant="outlined">
                  <CardHeader title="Tags" />
                  <CardContent>
                    <TextField fullWidth />

                    <Button
                      style={{ marginTop: "5px" }}
                      variant="contained"
                      color="success"
                    >
                      Add
                    </Button>
                  </CardContent>
                </Card1>

                <Card1 variant="outlined">
                  <CardHeader title="Featured Images" />
                  <CardContent>
                    <h3>Feactured Image 1</h3>
                    Select the image
                    <h3>Feactured Image 2</h3>
                    Select the image
                  </CardContent>
                </Card1>

                <Card1 variant="outlined">
                  <CardHeader title="Instructors" />
                  <CardContent>
                    <Autocomplete
                      id="combo-box-demo"
                      options={instructor}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option?.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Instructor"
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  </CardContent>
                </Card1>
              </GridItem1>
            </Grid>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
