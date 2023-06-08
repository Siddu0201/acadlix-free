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
  FormGroup,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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
      <Grid container spacing={1}>
        <Grid lg={3} md={3} sm={3} xs={1}>
          <Paper style={{ height: "100%" }}>
            {!showDesktop && (
              <MenuIcon onClick={handleClickOpen} style={{ margin: "15px" }} />
            )}
            <Dialog
              fullScreen
              open={open}
              onClose={handleClose}
              TransitionComponent={Transition}
            >
              <AppBar sx={{ position: "relative", mt: "40px" }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
            </Dialog>
          </Paper>
        </Grid>
        <Grid lg={9} md={9} sm={9} xs={11}>
          <Item>
            <Grid container spacing={1}>
              <Grid lg={8} md={8} sm={8} xs={12}>
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
              </Grid>
              <Grid lg={4} md={4} sm={4} xs={12}>
                <Item sx={{ boxShadow: 0 }}>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                    }}
                  >
                    <h3>Draft</h3>
                    <TextField fullWidth placeholder="description" />

                    <Button
                      style={{ marginTop: "5px" }}
                      variant="contained"
                      color="success"
                    >
                      Publish
                    </Button>
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                    }}
                  >
                    <h3>Price</h3>
                    <TextField fullWidth />
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Discount"
                      />
                    </FormGroup>
                    <TextField fullWidth />
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                      textAlign: "left",
                    }}
                  >
                    <h3>Categories</h3>
                    <TextField fullWidth />
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                      textAlign: "left",
                    }}
                  >
                    <h3>Tags</h3>
                    <TextField fullWidth />

                    <Button
                      style={{ marginTop: "5px" }}
                      variant="contained"
                      color="success"
                    >
                      Add
                    </Button>
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                    }}
                  >
                    <h3>Feactured Image 1</h3>
                    Select the image
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                    }}
                  >
                    <h3>Featured Image 2</h3>
                    Select the Image
                  </Container>
                  <Container
                    maxWidth="100%"
                    sx={{
                      p: 1,
                      mb: "15px",
                      border: "1px solid black",
                      textAlign: "left",
                    }}
                  >
                    <h3>Instructor</h3>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={instructor}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Instructor" />
                      )}
                    />
                  </Container>
                </Item>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
