import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Autocomplete,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import User from "../profile/User.png";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const Categories = [
    { label: "category1" },
    { label: "category2" },
    { label: "category3" },
  ];

  return (
    <Box sx={{
      marginTop: 4
    }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Grid container spacing={3}>
            <Grid item xs={4} sm={4}>
              <Autocomplete
                size="small"
                options={Categories}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" />
                )}
              />
            </Grid> 
            <Grid item xs={4} sm={4}>
              <Autocomplete
                size="small"
                options={Categories}
                renderInput={(params) => (
                  <TextField {...params} label="Progress" />
                )}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <Autocomplete
                size="small"
                options={Categories}
                renderInput={(params) => (
                  <TextField {...params} label="Instructor" />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5} sx={{
          display: 'flex',
          justifyContent: 'end'
        }}>
            <TextField
              sx={{
                width: {
                  xs: '100%',
                  md: '70%',
                }
              }}
              size="small"
              id="search"
              type="search"
              label="Search"
              value={searchTerm}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                      <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card onClick={() => navigate("/content")} sx={{
            cursor: 'pointer'
          }}>
            <CardMedia component="img" image={User} alt="User" />
            <CardContent>
              <Box>
                <Typography>
                  Course 1
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
    </Box>
  );
};

export default Courses;
