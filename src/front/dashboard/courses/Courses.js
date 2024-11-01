import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Autocomplete,
  TextField,
  InputAdornment,
  Typography,
  LinearProgress,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { GetUserCourses } from "../../../requests/front/FrontDashboardRequest";

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

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: acadlixOptions?.settings?.acadlix_no_of_courses_per_page,
    page: 0,
  });

  const { isFetching, data } = GetUserCourses(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const courses = [
    {
      title: "Complete Digital Marketing ",
      instructors: "John Doe, Angela uniliver ",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course",
      instructors: "John Doe",
      progress: 65,
    },
    {
      title: " Zero to One",
      instructors: "Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
    {
      title: "Complete Digital Marketing Course: Zero to One",
      instructors: "John Doe, Angela Yu",
      progress: 65,
    },
  ];

  const count = Math.ceil(courses.length / itemsPerPage);
  const paginatedCourses = courses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: "0 8px 8px -4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardContent>
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
                <Grid
                  item
                  xs={12}
                  sm={5}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <TextField
                    sx={{
                      width: {
                        xs: "100%",
                        md: "70%",
                      },
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        sx={{ borderBottom: "1px solid #D3D3D3", pb: 5 }}
      >
        {isFetching ? (
          <Grid item xs={12} lg={12}>
            <CircularProgress />
          </Grid>
        ) : data?.data?.order_items?.length > 0 ? (
          data?.data?.order_items?.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <CourseCard {...item} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} lg={12}>
            <Typography>No Course Found</Typography>
          </Grid>
        )}
        {/* {paginatedCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
            <CourseCard
              title={course.title}
              instructors={course.instructors}
              progress={course.progress}
            />
          </Grid>
        ))} */}
      </Grid>
      <Box
        sx={{
          my: 5,
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        <Stack spacing={2}>
          <Pagination
            count={count}
            page={page}
            onChange={handlePaginationChange}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default Courses;

const CourseCard = (props) => {
  const navigate = useNavigate();
  console.log(props);
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 8px 8px -4px rgba(0, 0, 0, 0.2)", // Add background shadow
        backgroundColor: "white",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 8px 8px -4px rgba(0, 0, 0, 0.2)", // Optional: darker shadow on hover
        },
      }}
      onClick={(e) => navigate(`/course/content/${props?.course?.id}`)}
    >
      <CardMedia
        component="img"
        height="140"
        image={props?.course?.post?.thumbnail_url}
        alt={props?.course?.post?.post_title}
      />
      <CardContent
        sx={{
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            lineHeight: "1.4",
          }}
        >
          {props?.course?.post?.post_title?.length > 40
            ? props?.course?.post?.post_title?.substring(0, 40) + "..."
            : props?.course?.post?.post_title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {
            props?.course?.users?.length > 0 ? 
              props?.course?.users?.map(u => u?.author?.display_name)?.join(", ")
            : props?.course?.post?.author?.display_name
          }
        </Typography>
        <Box sx={{ mt: 5 }}>
          <LinearProgress variant="determinate" value={0} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {0}% Complete
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
