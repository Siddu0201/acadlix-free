import React from "react";
import {
  Box,
  FormControlLabel,
  Button,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import parse from "html-react-parser";
import { PostCreatePage } from "@acadlix/requests/admin/AdminSettingRequest";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer, renderMUIComponent } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import { hasCapability } from "@acadlix/helpers/util";

const AdvanceQuizOption = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import("@acadlix/pro/admin/setting/general/AdvanceQuizOption") :
    import("@acadlix/free/admin/setting/general/AdvanceQuizOption")
);

function General(props) {
  const [courseInput, setCourseInput] = React.useState("");
  const [dashboardInput, setDashboardInput] = React.useState("");
  const [cartInput, setCartInput] = React.useState("");
  const [checkoutInput, setCheckoutInput] = React.useState("");
  const [thankyouInput, setThankyouInput] = React.useState("");

  const createPageMutation = PostCreatePage();
  const general_page_setup_after = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.general.page_setup.after",
    [],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <Box>
      {/* Page Setup  */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Page Setup", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Student dashboard page", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
                    disabled={!hasCapability("acadlix_create_page_setting")}
                    sx={{ justifyContent: "flex-start", pl: 2 }}
                    onMouseDown={(e) => {
                      if (dashboardInput === "") {
                        toast.error(__("Title cannot be empty.", "acadlix"));
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
                    + {__("Add New", "acadlix")}
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>

        {/* Advance Quiz Page Setting  */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Advance quiz page", "acadlix")}
          </Typography>
        </Grid>
        <React.Suspense fallback={null}>
          <AdvanceQuizOption {...props} />
        </React.Suspense>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Cart page", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
                    disabled={!hasCapability("acadlix_create_page_setting")}
                    onMouseDown={(e) => {
                      if (cartInput === "") {
                        toast.error(__("Title cannot be empty.", "acadlix"));
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
                    + {__("Add New", "acadlix")}
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Checkout page", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
                    disabled={!hasCapability("acadlix_create_page_setting")}
                    onMouseDown={(e) => {
                      if (checkoutInput === "") {
                        toast.error(__("Title cannot be empty.", "acadlix"));
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
                    + {__("Add New", "acadlix")}
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Thankyou page", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
                    disabled={!hasCapability("acadlix_create_page_setting")}
                    onMouseDown={(e) => {
                      if (thankyouInput === "") {
                        toast.error(__("Title cannot be empty.", "acadlix"));
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
                    + {__("Add New", "acadlix")}
                  </Button>
                </Paper>
              );
            }}
          />
        </Grid>

        {/* {general_page_setup_after.map((field, i) => {
          try {
            return (
              <React.Fragment key={`field-${i}`}>
                {renderMUIComponent(
                  field, 
                  { register: props?.register, 
                    setValue: props?.setValue, 
                    watch: props.watch 
                  }
                )
                }
              </React.Fragment>
            );
          } catch (error) {
            console.error(`Error rendering field at index ${i}:`, error);
            return null;
          }
        })} */}
        {general_page_setup_after.map((field, i) => (
          <React.Fragment key={`field-${i}`}>
            <DynamicMUIRenderer
              item={field}
              index={i}
              formProps={{
                register: props?.register,
                setValue: props?.setValue,
                watch: props?.watch,
                control: props?.control,
              }}
            />
          </React.Fragment>
        ))}
      </Grid>
      {/* Course options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Course Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("No. of courses per page", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Disable wishlist", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            label={__("Activate", "acadlix")}
            control={<CustomSwitch />}
            value="yes"
            checked={props?.watch("acadlix_disable_wishlist") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_disable_wishlist",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
        {/* 
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("One Click Checkout", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            label={__("Activate", "acadlix")}
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Admin Auto Registration To Courses", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={<CustomSwitch />}
            label={__("Activate", "acadlix")}
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Admin Can Assign Courses To Student", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={<CustomSwitch />}
            label={__("Activate", "acadlix")}
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Admin Can Remove Student From Course", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            control={<CustomSwitch />}
            label={__("Activate", "acadlix")}
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
        </Grid> */}
      </Grid>
      {/* Currency options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Currency Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Currency", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Currency position", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Thousand separator", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Decimal separator", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("The number of decimals", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
      {/* Admin Options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Admin Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Default rows per page", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Select
            fullWidth
            size="small"
            value={props?.watch("acadlix_default_rows_per_page")}
            onChange={(e) => {
              props?.setValue(
                "acadlix_default_rows_per_page",
                Number(e?.target?.value),
                {
                  shouldDirty: true,
                }
              );
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Grid>
      </Grid>
      {/* Student Dashboard options */}
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Student Dashboard Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Logout redirect url", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 9 }}>
          <CustomTextField
            fullWidth
            size="small"
            type="text"
            value={props?.watch("acadlix_logout_redirect_url") !== "" ? props?.watch("acadlix_logout_redirect_url") : acadlixOptions?.home_url}
            onChange={(e) => {
              props?.setValue("acadlix_logout_redirect_url", e?.target?.value, {
                shouldDirty: true,
              });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Disable home in menu", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            label={__("Activate", "acadlix")}
            control={<CustomSwitch />}
            value="yes"
            checked={props?.watch("acadlix_disable_home_menu") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_disable_home_menu",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Enable site logo in header", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            label={__("Activate", "acadlix")}
            control={<CustomSwitch />}
            value="yes"
            checked={props?.watch("acadlix_enable_site_logo_in_header") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_enable_site_logo_in_header",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">{__("Data Management", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {__("Delete Data on Plugin Uninstall", "acadlix")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FormControlLabel
            label={__("Activate", "acadlix")}
            control={<CustomSwitch />}
            value="yes"
            checked={props?.watch("acadlix_delete_data_on_plugin_uninstall") === "yes"}
            onClick={(e) => {
              if (e?.target?.checked !== undefined) {
                props?.setValue(
                  "acadlix_delete_data_on_plugin_uninstall",
                  e?.target?.checked ? e?.target?.value : "no",
                  { shouldDirty: true }
                );
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default General;
