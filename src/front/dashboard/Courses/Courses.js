import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActionArea,
  Container,
  Grid,
  Autocomplete,
  TextField,
  Button,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import GridItem1 from "../../../components/GridItem1";
import Card1 from "../../../components/Card1";
import Row from "../../../components/Row";
import SearchIcon from "@mui/icons-material/Search";
import User from "../profile/User.png";
const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const Categories = [
    { label: "category1" },
    { label: "category2" },
    { label: "category3" },
  ];

  return (
    <div>
      <Box>
        <Card>
          <CardHeader title="My Courses"></CardHeader>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Autocomplete
                    sx={{ width: "250px", ml: "10px" }}
                    size="small"
                    options={Categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Recently Added" />
                    )}
                  />
                  <Autocomplete
                    sx={{ width: "250px", ml: "10px" }}
                    size="small"
                    options={Categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Categories" />
                    )}
                  />
                  <Autocomplete
                    sx={{ width: "250px", ml: "10px" }}
                    size="small"
                    options={Categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Progress" />
                    )}
                  />
                  <Autocomplete
                    sx={{ width: "250px", ml: "10px" }}
                    size="small"
                    options={Categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Instructor" />
                    )}
                  />
                </div>
              </Grid>
              <Grid item lg={6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <TextField
                    size="small"
                    id="search"
                    type="search"
                    label="Search"
                    value={searchTerm}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button>
                            <SearchIcon />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Card
              sx={{
                marginTop: "10px",
                height: "50%",
                width: "25%",
              }}
            >
              <CardActionArea component={Link} to="/content">
                <CardMedia component="img" image={User} alt="User" />
                <CardContent>
                  <Typography>Course 1</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Courses;
