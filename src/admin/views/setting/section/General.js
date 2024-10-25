import React from "react";
import {
  Grid,
  Box,
  FormControlLabel,
  Button,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  CircularProgress,
  Paper,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSwitch from "../../../../components/CustomSwitch";
import { MediaUpload } from "@wordpress/media-utils";
import parse from "html-react-parser";
import { PostCreatePage } from "../../../../requests/admin/AdminSettingRequest";
import toast from "react-hot-toast";

function General(props) {
  const [courseInput, setCourseInput] = React.useState("");
  const [dashboardInput, setDashboardInput] = React.useState("");
  const [quizInput, setQuizInput] = React.useState("");
  const [cartInput, setCartInput] = React.useState("");
  const [checkoutInput, setCheckoutInput] = React.useState("");
  const [thankyouInput, setThankyouInput] = React.useState("");

  const createPageMutation = PostCreatePage();
  return (
    <Box sx={{ color: "black" }}>
      {/* Page Setup  */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Page Setup</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            All courses page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_all_courses_page_id") !== null
                ? props?.pages?.find(
                    (p) =>
                      p?.ID ===
                      Number(props?.watch("acadlix_all_courses_page_id"))
                  )
                : null
            }
            options={props?.pages?.length > 0 ? props?.pages : []}
            getOptionLabel={(option) =>
              `${option?.post_title} (#${option?.ID})` || ""
            }
            isOptionEqualToValue={(option, value) => {
              return option?.ID === value?.ID;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "spoc_gender",
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {courseInput !== "" && createPageMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={(e) => setCourseInput(e.target.value)}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_all_courses_page_id",
                newValue?.ID ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
            PaperComponent={(data) => {
              return (
                <Paper>
                  {data?.children}
                  <Button
                    color="primary"
                    fullWidth
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (courseInput === "") {
                        toast.error("Title cannot be empty.");
                        return;
                      }
                      createPageMutation?.mutate(
                        {
                          title: courseInput,
                          user_id: acadlixOptions?.user_id,
                        },
                        {
                          onSuccess: (data) => {
                            props?.setPages(data?.data?.all_pages);
                            props?.setValue(
                              "acadlix_all_courses_page_id",
                              data?.data?.page_id,
                              { shouldDirty: true }
                            );
                          },
                        }
                      );
                    }}
                  >
                    + Add New
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Student dashboard page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_dashboard_page_id") !== null
                ? props?.pages?.find(
                    (p) =>
                      p?.ID ===
                      Number(props?.watch("acadlix_dashboard_page_id"))
                  )
                : null
            }
            options={props?.pages?.length > 0 ? props?.pages : []}
            getOptionLabel={(option) =>
              `${option?.post_title} (#${option?.ID})` || ""
            }
            isOptionEqualToValue={(option, value) => {
              return option?.ID === value?.ID;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "spoc_gender",
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {dashboardInput !== "" &&
                      createPageMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={(e) => setDashboardInput(e.target.value)}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_dashboard_page_id",
                newValue?.ID ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
            PaperComponent={(data) => {
              return (
                <Paper>
                  {data?.children}
                  <Button
                    color="primary"
                    fullWidth
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (dashboardInput === "") {
                        toast.error("Title cannot be empty.");
                        return;
                      }
                      createPageMutation?.mutate(
                        {
                          title: dashboardInput,
                          user_id: acadlixOptions?.user_id,
                        },
                        {
                          onSuccess: (data) => {
                            props?.setPages(data?.data?.all_pages);
                            props?.setValue(
                              "acadlix_dashboard_page_id",
                              data?.data?.page_id,
                              { shouldDirty: true }
                            );
                          },
                        }
                      );
                    }}
                  >
                    + Add New
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Advance quiz page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_advance_quiz_page_id") !== null
                ? props?.pages?.find(
                    (p) =>
                      p?.ID ===
                      Number(props?.watch("acadlix_advance_quiz_page_id"))
                  )
                : null
            }
            options={props?.pages?.length > 0 ? props?.pages : []}
            getOptionLabel={(option) =>
              `${option?.post_title} (#${option?.ID})` || ""
            }
            isOptionEqualToValue={(option, value) => {
              return option?.ID === value?.ID;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "spoc_gender",
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {quizInput !== "" && createPageMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={(e) => setQuizInput(e.target.value)}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_advance_quiz_page_id",
                newValue?.ID ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
            PaperComponent={(data) => {
              return (
                <Paper>
                  {data?.children}
                  <Button
                    color="primary"
                    fullWidth
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (quizInput === "") {
                        toast.error("Title cannot be empty.");
                        return;
                      }
                      createPageMutation?.mutate(
                        {
                          title: quizInput,
                          user_id: acadlixOptions?.user_id,
                        },
                        {
                          onSuccess: (data) => {
                            props?.setPages(data?.data?.all_pages);
                            props?.setValue(
                              "acadlix_advance_quiz_page_id",
                              data?.data?.page_id,
                              { shouldDirty: true }
                            );
                          },
                        }
                      );
                    }}
                  >
                    + Add New
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Cart page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_cart_page_id") !== null
                ? props?.pages?.find(
                    (p) =>
                      p?.ID ===
                      Number(props?.watch("acadlix_cart_page_id"))
                  )
                : null
            }
            options={props?.pages?.length > 0 ? props?.pages : []}
            getOptionLabel={(option) =>
              `${option?.post_title} (#${option?.ID})` || ""
            }
            isOptionEqualToValue={(option, value) => {
              return option?.ID === value?.ID;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "spoc_gender",
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {cartInput !== "" && createPageMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={(e) => setCartInput(e.target.value)}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_cart_page_id",
                newValue?.ID ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
            PaperComponent={(data) => {
              return (
                <Paper>
                  {data?.children}
                  <Button
                    color="primary"
                    fullWidth
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (cartInput === "") {
                        toast.error("Title cannot be empty.");
                        return;
                      }
                      createPageMutation?.mutate(
                        {
                          title: cartInput,
                          user_id: acadlixOptions?.user_id,
                        },
                        {
                          onSuccess: (data) => {
                            props?.setPages(data?.data?.all_pages);
                            props?.setValue(
                              "acadlix_cart_page_id",
                              data?.data?.page_id,
                              { shouldDirty: true }
                            );
                          },
                        }
                      );
                    }}
                  >
                    + Add New
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Checkout page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_checkout_page_id") !== null
                ? props?.pages?.find(
                    (p) =>
                      p?.ID ===
                      Number(props?.watch("acadlix_checkout_page_id"))
                  )
                : null
            }
            options={props?.pages?.length > 0 ? props?.pages : []}
            getOptionLabel={(option) =>
              `${option?.post_title} (#${option?.ID})` || ""
            }
            isOptionEqualToValue={(option, value) => {
              return option?.ID === value?.ID;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "spoc_gender",
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {checkoutInput !== "" && createPageMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={(e) => setCheckoutInput(e.target.value)}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_checkout_page_id",
                newValue?.ID ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
            PaperComponent={(data) => {
              return (
                <Paper>
                  {data?.children}
                  <Button
                    color="primary"
                    fullWidth
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (checkoutInput === "") {
                        toast.error("Title cannot be empty.");
                        return;
                      }
                      createPageMutation?.mutate(
                        {
                          title: checkoutInput,
                          user_id: acadlixOptions?.user_id,
                        },
                        {
                          onSuccess: (data) => {
                            props?.setPages(data?.data?.all_pages);
                            props?.setValue(
                              "acadlix_checkout_page_id",
                              data?.data?.page_id,
                              { shouldDirty: true }
                            );
                          },
                        }
                      );
                    }}
                  >
                    + Add New
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Thankyou page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_thankyou_page_id") !== null
                ? props?.pages?.find(
                    (p) =>
                      p?.ID ===
                      Number(props?.watch("acadlix_thankyou_page_id"))
                  )
                : null
            }
            options={props?.pages?.length > 0 ? props?.pages : []}
            getOptionLabel={(option) =>
              `${option?.post_title} (#${option?.ID})` || ""
            }
            isOptionEqualToValue={(option, value) => {
              return option?.ID === value?.ID;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "spoc_gender",
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {thankyouInput !== "" && createPageMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                onChange={(e) => setThankyouInput(e.target.value)}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_thankyou_page_id",
                newValue?.ID ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
            PaperComponent={(data) => {
              return (
                <Paper>
                  {data?.children}
                  <Button
                    color="primary"
                    fullWidth
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (thankyouInput === "") {
                        toast.error("Title cannot be empty.");
                        return;
                      }
                      createPageMutation?.mutate(
                        {
                          title: thankyouInput,
                          user_id: acadlixOptions?.user_id,
                        },
                        {
                          onSuccess: (data) => {
                            props?.setPages(data?.data?.all_pages);
                            props?.setValue(
                              "acadlix_thankyou_page_id",
                              data?.data?.page_id,
                              { shouldDirty: true }
                            );
                          },
                        }
                      );
                    }}
                  >
                    + Add New
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
      </Grid>
      {/* Course options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Course Options</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            No. of courses per page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            value={props?.watch("acadlix_no_of_courses_per_page")}
            onChange={(e) => {
              props?.setValue(
                "acadlix_no_of_courses_per_page",
                Number(e?.target?.value),
                { shouldDirty: true }
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            One Click Checkout
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControlLabel
            label="Activate"
            control={<CustomSwitch />}
            value="yes"
            checked={props?.watch("acadlix_one_click_checkout") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_one_click_checkout",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Admin Auto Registration To Courses
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Activate"
            value="yes"
            checked={props?.watch("acadlix_admin_auto_registration_to_courses") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_admin_auto_registration_to_courses",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Admin Can Assign Courses To Student
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Activate"
            value="yes"
            checked={props?.watch(
              "acadlix_admin_can_assign_courses_to_student"
            ) === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_admin_can_assign_courses_to_student",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Admin Can Remove Student From Course
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControlLabel
            control={<CustomSwitch />}
            label="Activate"
            value="yes"
            checked={props?.watch(
              "acadlix_admin_can_remove_student_from_course"
            ) === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_admin_can_remove_student_from_course",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
      </Grid>
      {/* Currency options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Currency Options</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Currency
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={
              props?.watch("acadlix_curreny") !== ""
                ? props?.currencies?.find(
                    (c) => c?.short_name === props?.watch("acadlix_currency")
                  )
                : null
            }
            options={props?.currencies ?? []}
            getOptionLabel={(option) =>
              `${option?.name} (${parse(option?.symbol)})` || ""
            }
            isOptionEqualToValue={(option, value) =>
              option?.name === value?.name
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue(
                "acadlix_currency",
                newValue?.short_name ?? null,
                {
                  shouldDirty: true,
                }
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Currency position
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Autocomplete
            size="small"
            value={props?.watch("acadlix_currency_position")}
            options={[
              "Left ( $99.99 )",
              "Right ( 99.99$ )",
              "Left with space ( $ 99.99 )",
              "Right with space ( 99.99 $ )",
            ]}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(_, newValue) => {
              props?.setValue("acadlix_currency_position", newValue, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Thousand separator
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            value={props?.watch("acadlix_thousand_separator")}
            onChange={(e) => {
              props?.setValue("acadlix_thousand_separator", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Decimal separator
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            value={props?.watch("acadlix_decimal_seprator")}
            onChange={(e) => {
              props?.setValue("acadlix_decimal_seprator", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            The number of decimals
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CustomTextField
            fullWidth
            size="small"
            type="number"
            value={props?.watch("acadlix_number_of_decimals")}
            onChange={(e) => {
              props?.setValue(
                "acadlix_number_of_decimals",
                Number(e?.target?.value),
                {
                  shouldDirty: true,
                }
              );
            }}
          />
        </Grid>
      </Grid>
      {/* Other options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Other Options</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Upload Logo
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {/* Site logo */}
          <MediaUpload
            onSelect={(e) => {
              props?.setValue("acadlix_upload_logo_url", e?.url, {
                shouldDirty: true,
              });
            }}
            render={({ open }) => (
              <Button variant="contained" onClick={open}>
                Upload Logo
              </Button>
            )}
          />
          {props?.watch("acadlix_upload_logo_url") && (
            <>
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                Selected file:{" "}
                <a href={props?.watch("acadlix_upload_logo_url")} target="_blank">
                  {props?.watch("acadlix_upload_logo_url")?.split('/')?.pop()}
                </a>
              </Typography>
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            Upload Mini Logo
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {/* Short logo */}
          <MediaUpload
            onSelect={(e) => {
              props?.setValue("acadlix_upload_mini_logo_url", e?.url, {
                shouldDirty: true,
              });
            }}
            render={({ open }) => (
              <Button variant="contained" onClick={open}>
                Upload Mini Logo
              </Button>
            )}
          />
          {props?.watch("acadlix_upload_mini_logo_url") && (
            <>
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                Selected file:{" "}
                <a href={props?.watch("acadlix_upload_mini_logo_url")} target="_blank">
                  {props?.watch("acadlix_upload_mini_logo_url")?.split('/')?.pop()}
                </a>
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default General;
