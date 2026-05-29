import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Typography,
  LinearProgress,
  Stack,
  Pagination,
  CircularProgress,
  PaginationItem,
  CardHeader,
  TextField,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { useNavigate, useOutletContext } from "react-router-dom";
import { GetUserCourses } from "@acadlix/requests/front/FrontDashboardRequest";
import { FaSearch } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomRefresh from "@acadlix/components/CustomRefresh";
import { useForm } from "react-hook-form";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const methods = useForm({
    defaultValues: {
      rows: [],
    },
  });

  const { open } = useOutletContext();

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('frontCoursePage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('frontCoursePageSize') || acadlixOptions?.settings?.acadlix_no_of_courses_per_page, 10),
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: defaultPaginationModel.pageSize,
    page: defaultPaginationModel.page,
  });

  const { isFetching, data, isError, refetch } = GetUserCourses(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize,
    searchTerm,
    categoryId
  );

  React.useEffect(() => {
    const courses = data?.data?.courses;

    if (data?.data?.total && paginationModel?.page > 0 && data?.data?.total <= paginationModel?.page * paginationModel?.pageSize) {
      handlePaginationChange({ ...paginationModel, page: 0 });
    }

    if (Array.isArray(courses)) {
      methods.setValue("rows", courses, { shouldDirty: true });
      return;
    }

    if (courses && typeof courses === "object") {
      const normalizedCourses = Object.entries(courses).map(([id, course]) => ({
        ...course,
      }));
      methods.setValue("rows", normalizedCourses, { shouldDirty: true });
      return;
    }

    methods.setValue("rows", [], { shouldDirty: true });
  }, [data]);

  if (process.env.REACT_APP_MODE === "development") {
    console.log(methods?.watch("rows"));
  }
  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('frontCoursePage', model.page);
    localStorage.setItem('frontCoursePageSize', model.pageSize);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: "none",
            }}
          >
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    component="div"
                    variant="h3"
                  >
                    {__("My Courses", "acadlix")}
                  </Typography>
                  <CustomRefresh
                    refetch={refetch}
                    sx={{
                      paddingY: 1.5,
                    }}
                  />
                </Box>
              }
            />
            <CardContent sx={{
              padding: 4,
              ":last-child": {
                padding: 4
              }
            }}>
              <Box
                sx={{
                  width: "100%",
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{
                  display: "flex",
                  flexDirection: {
                    xs: 'column',
                    md: 'row',
                  },
                  alignItems: {
                    xs: 'stretch',
                    md: 'flex-start',
                  },
                  justifyContent: "space-between",
                  gap: 2,
                  marginBottom: 2,
                }}>
                  <Autocomplete
                    id="category-select"
                    options={data?.data?.categories ?? []}
                    getOptionLabel={(option) => option?.term?.name ?? ""}
                    onChange={(event, newValue) => {
                      setCategoryId(newValue?.term_id);
                    }}
                    slotProps={{
                      popupIndicator: {
                        className: "acadlix-icon-btn",
                      },
                      clearIndicator: {
                        className: "acadlix-icon-btn",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={__("Filter by Category", "acadlix")}
                        placeholder={__("Select categories", "acadlix")}
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            height: "auto",
                          },
                        }}
                      />
                    )}
                    sx={{
                      minWidth: {
                        xs: '100%',
                        md: '300px',
                      },
                    }}
                  />
                  <CustomTextField
                    size="small"
                    label={__("Search", "acadlix")}
                    helperText={__("Search by title", "acadlix")}
                    type="search"
                    name="search"
                    value={searchTerm ?? ""}
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
                </Box>
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
                      <Typography variant="h3" component="div">{__("Something went wrong", "acadlix")}</Typography>
                    </Grid>
                  ) : methods?.watch('rows')?.length > 0 ?
                    methods?.watch('rows')?.map((course, index) => (
                      <React.Fragment key={index}>
                        <Grid size={{
                          xs: 12,
                          sm: 6,
                          md: 4,
                          lg: open ? 4 : 3
                        }}>
                          <CourseCard course={course} />
                        </Grid>
                      </React.Fragment>
                    )) : (
                      <Grid size={{ xs: 12, lg: 12 }}>
                        <Typography variant="h4" component="div">{__("No Course Found", "acadlix")}</Typography>
                      </Grid>
                    )}
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 1,
                  }}
                >
                  <TablePagination
                    component="div"
                    count={rowCount}
                    page={paginationModel?.page}
                    onPageChange={(_, newPage) => handlePaginationChange({ ...paginationModel, page: newPage })}
                    rowsPerPage={paginationModel?.pageSize}
                    onRowsPerPageChange={(e) => {
                      const pageSize = parseInt(e?.target?.value);
                      const page = Math.min(paginationModel?.page, Math.floor(methods?.watch('rows')?.length / pageSize)); // Ensure page does not exceed limit
                      handlePaginationChange({
                        pageSize: pageSize,
                        page: page,
                      });
                    }}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    slotProps={{
                      selectLabel: {
                        component: "div",
                      },
                      displayedRows: {
                        component: "div",
                      },
                      actions: {
                        nextButton: {
                          className: "acadlix-icon-btn",
                        },
                        previousButton: {
                          className: "acadlix-icon-btn",
                        }
                      },
                    }}
                    sx={{
                      '& .MuiToolbar-root': {
                        paddingLeft: 0,
                        paddingRight: 0,
                      },
                      '& .MuiTablePagination-selectLabel': {
                        margin: 0,
                      },
                      '& .MuiTablePagination-displayedRows': {
                        margin: 0,
                      },
                      '& .MuiInputBase-root': {
                        marginX: 0,
                      },
                    }}
                  />

                  {/* <Stack spacing={2} >
                    <Pagination
                      count={
                        rowCount > 0 ? Math.ceil(rowCount / paginationModel?.pageSize) : 0
                      }
                      page={paginationModel?.page + 1}
                      onChange={handlePaginationChange}
                      renderItem={(item) => (
                        <PaginationItem
                          {...item}
                          className="acadlix-icon-btn"
                        />
                      )}
                    />
                  </Stack> */}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box >
  );
};

export default Courses;

const CourseCard = (props) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",               // Make Card a flex container
        flexDirection: "column",       // Stack children vertically
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[2], // Add background shadow
        backgroundColor: "white",
        cursor: "pointer",
        "&:hover": {
          boxShadow: (theme) => theme.shadows[6], // Optional: darker shadow on hover
        },
      }}
      onClick={(e) => navigate(`/course/${props.course?.ID}/content/${props?.course?.current_content_id || 0}`) }
    >
      <CardMedia
        component="img"
        sx={{
          objectFit: {
            xs: "cover",
            sm: "cover",
            md: "inherit",
            lg: "inherit",
          },
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
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            component="div"
          >
            {props?.course?.post_title?.length > 40
              ? props?.course?.post_title?.substring(0, 40) + "..."
              : props?.course?.post_title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
          >
            {props?.course?.users?.length > 0
              ? props?.course?.users
                ?.map((u) => u?.display_name)
                ?.join(", ")
              : props?.course?.author?.display_name}
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: "auto"
          }}
        >
          <LinearProgress variant="determinate" value={props?.course?.completion_percentage} />
          <Typography
            component="div"
            variant="body2"
            color="text.secondary"
            sx={{
              marginTop: 1
            }}
          >
            {props?.course?.completion_percentage}% {__("Complete", "acadlix")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
