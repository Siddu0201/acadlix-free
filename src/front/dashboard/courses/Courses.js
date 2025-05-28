import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Autocomplete,
  TextField,
  InputAdornment,
  Typography,
  LinearProgress,
  Stack,
  Pagination,
  CircularProgress,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import { GetUserOrders } from "../../../requests/front/FrontDashboardRequest";
import { FaSearch, IoMdRefresh } from "../../../helpers/icons";
import { __ } from "@wordpress/i18n";

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

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: acadlixOptions?.settings?.acadlix_no_of_courses_per_page,
    page: 0,
  });

  const { isFetching, data, isError, refetch } = GetUserOrders(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize,
    searchTerm
  );

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handlePaginationChange = (event, value) => {
    console.log(value);
    setPaginationModel((p) => {
      return { ...p, page: value - 1 };
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: "0 8px 8px -4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardContent sx={{
              padding: 4,
              ":last-child": {
                padding: 4
              }
            }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Tooltip title={__("Refresh", "acadlix")} arrow>
                    <Button variant="contained" onClick={refetch} size="large">
                      <IoMdRefresh />
                    </Button>
                  </Tooltip>
                  {/* <Grid container spacing={3}>
                    <Grid size={{ xs: 4, sm: 4 }}>
                      <Autocomplete
                        size="small"
                        options={Categories}
                        renderInput={(params) => (
                          <TextField {...params} label={__("Categories", "acadlix")} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 4, sm: 4 }}>
                      <Autocomplete
                        size="small"
                        options={Categories}
                        renderInput={(params) => (
                          <TextField {...params} label={__("Progress", "acadlix")} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 4, sm: 4 }}>
                      <Autocomplete
                        size="small"
                        options={Categories}
                        renderInput={(params) => (
                          <TextField {...params} label={__("Instructor", "acadlix")} />
                        )}
                      />
                    </Grid>
                  </Grid> */}
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
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
                    label={__("Search", "acadlix")}
                    value={searchTerm}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <FaSearch />
                          </InputAdornment>
                        ),
                      }
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
          <Grid size={{ xs: 12, lg: 12 }}>
            <CircularProgress />
          </Grid>
        ) : isError ? (
          <Grid size={{ xs: 12, lg: 12 }}>
            <Typography>{__("Something went wrong", "acadlix")}</Typography>
          </Grid>
        ) : data?.data?.order_items?.length > 0 ?
          data?.data?.order_items?.map((item, index) => (
            <React.Fragment key={index}>
              {item?.course_id && (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <CourseCard {...item} />
                </Grid>
              )}
            </React.Fragment>
          )) : (
            <Grid size={{ xs: 12, lg: 12 }}>
              <Typography>{__("No Course Found", "acadlix")}</Typography>
            </Grid>
          )}
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
            count={
              rowCount > 0 ? Math.ceil(rowCount / paginationModel?.pageSize) : 0
            }
            page={paginationModel?.page + 1}
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
      onClick={(e) => navigate(`/course/${props.id}`)}
    >
      <CardMedia
        component="img"
        sx={{
          height: "200px",
          aspectRatio: "auto 240/135",
        }}
        image={
          props?.course?.thumbnail?.url ?? acadlixOptions?.default_img_url
        }
        alt={props?.course?.thumbnail?.alt ?? props?.course?.post_title}
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
          {props?.course?.post_title?.length > 40
            ? props?.course?.post_title?.substring(0, 40) + "..."
            : props?.course?.post_title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props?.course?.users?.length > 0
            ? props?.course?.users
              ?.map((u) => u?.display_name)
              ?.join(", ")
            : props?.course?.author?.display_name}
        </Typography>
        <Box sx={{ mt: 5 }}>
          <LinearProgress variant="determinate" value={props?.course_completion_percentage} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {props?.course_completion_percentage}% {__("Complete", "acadlix")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
