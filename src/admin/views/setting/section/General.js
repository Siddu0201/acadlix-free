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
  CardActions,
  Card,
  CardContent,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { PostCreatePage } from "@acadlix/requests/admin/AdminSettingRequest";
import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import { getStripHtml, hasCapability } from "@acadlix/helpers/util";
import CustomTypography from "@acadlix/components/CustomTypography";
import { useForm } from "react-hook-form";
import CustomFeatureTooltip from "@acadlix/components/CustomFeatureTooltip";
import CustomFeatureElement from "@acadlix/components/CustomFeatureElement";
import CourseOptions from "./general/CourseOptions";

const AdvanceQuizOption = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true' ?
    import(
      /* webpackChunkName: "admin_setting_general_advance_quiz_option" */
      "@acadlix/pro/admin/setting/general/AdvanceQuizOption") :
    import(
      /* webpackChunkName: "admin_setting_general_advance_quiz_option" */
      "@acadlix/free/admin/setting/general/AdvanceQuizOption")
);

function General(props) {
  const methods = useForm({
    defaultValues: window?.acadlixHooks?.applyFilters?.(
      "acadlix.admin.settings.general.default_values",
      {
        all_pages: props?.all_pages ?? [],
        dashboardInput: "",
        cartInput: "",
        checkoutInput: "",
        thankyouInput: "",
      }
    )
  })

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
    <Card>
      <CardContent>
        <Box>
          {/* Page Setup  */}
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Page Setup", "acadlix")}
              <CustomFeatureTooltip
                plan={"open"}
                msg={__("Set and manage core Acadlix pages used for student access and navigation.", "acadlix")}
                placement="right-start"
                redirectTo={`${acadlixOptions?.acadlix_docs_url}settings/general/#page-setup`}
              />
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Student dashboard page", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("acadlix_dashboard_page_id") !== null
                    ? methods?.watch("all_pages")?.find(
                      (p) =>
                        p?.ID ===
                        Number(props?.watch("acadlix_dashboard_page_id"))
                    ) || null
                    : null
                }
                options={methods?.watch("all_pages") || []}
                getOptionLabel={(option) =>
                  `${option?.post_title} (#${option?.ID})` || ""
                }
                isOptionEqualToValue={(option, value) => {
                  return option?.ID === value?.ID;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {methods?.watch("dashboardInput") !== "" &&
                              createPageMutation?.isPending ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }
                    }}
                    onChange={(e) => methods?.setValue("dashboardInput", e.target.value)}
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
                slots={{
                  paper: (data) => {
                    return (
                      <Paper>
                        {data?.children}
                        <Button
                          color="primary"
                          fullWidth
                          disabled={!hasCapability("acadlix_create_page_setting")}
                          sx={{ justifyContent: "flex-start", pl: 2 }}
                          onMouseDown={(e) => {
                            if (methods?.watch("dashboardInput") === "") {
                              toast.error(__("Title cannot be empty.", "acadlix"));
                              return;
                            }
                            createPageMutation?.mutate(
                              {
                                title: methods?.watch("dashboardInput"),
                                user_id: acadlixOptions?.user_id,
                              },
                              {
                                onSuccess: (data) => {
                                  console.log(data?.data);
                                  methods?.setValue(
                                    "dashboardInput",
                                    "",
                                    { shouldDirty: true }
                                  );
                                  methods?.setValue(
                                    "all_pages",
                                    data?.data?.all_pages,
                                    { shouldDirty: true }
                                  );
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
                  }
                }}
              />
            </Grid>

            {/* Advance Quiz Page Setting  */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {
                  acadlixOptions?.isActive ? (
                    __("Advance quiz page", "acadlix")
                  ) : (
                    <CustomFeatureElement
                      element="text"
                      label={__("Advance quiz page", "acadlix")}
                      iconsx={{ color: '#fff' }}
                    />
                  )
                }
              </CustomTypography>
            </Grid>
            <React.Suspense fallback={null}>
              <AdvanceQuizOption {...props} methods={methods} />
            </React.Suspense>
            {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Cart page", "acadlix")}
              </CustomTypography>
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
            </Grid> */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Checkout page", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("acadlix_checkout_page_id") !== null
                    ? methods?.watch("all_pages")?.find(
                      (p) =>
                        p?.ID ===
                        Number(props?.watch("acadlix_checkout_page_id"))
                    ) || null
                    : null
                }
                options={methods?.watch("all_pages") || []}
                getOptionLabel={(option) =>
                  `${option?.post_title} (#${option?.ID})` || ""
                }
                isOptionEqualToValue={(option, value) => {
                  return option?.ID === value?.ID;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {methods?.watch("checkoutInput") !== "" && createPageMutation?.isPending ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }
                    }}
                    onChange={(e) => methods?.setValue("checkoutInput", e.target.value)}
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

                slots={{
                  paper: (data) => {
                    return (
                      <Paper>
                        {data?.children}
                        <Button
                          color="primary"
                          fullWidth
                          sx={{ justifyContent: "flex-start", pl: 2 }}
                          disabled={!hasCapability("acadlix_create_page_setting")}
                          onMouseDown={(e) => {
                            if (methods?.watch("checkoutInput") === "") {
                              toast.error(__("Title cannot be empty.", "acadlix"));
                              return;
                            }
                            createPageMutation?.mutate(
                              {
                                title: methods?.watch("checkoutInput"),
                                user_id: acadlixOptions?.user_id,
                              },
                              {
                                onSuccess: (data) => {
                                  methods?.setValue("checkoutInput", "", { shouldDirty: true });
                                  methods?.setValue(
                                    "all_pages",
                                    data?.data?.all_pages,
                                    { shouldDirty: true }
                                  );
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
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Thankyou page", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Autocomplete
                size="small"
                value={
                  props?.watch("acadlix_thankyou_page_id") !== null
                    ? methods?.watch("all_pages")?.find(
                      (p) =>
                        p?.ID ===
                        Number(props?.watch("acadlix_thankyou_page_id"))
                    ) || null
                    : null
                }
                options={methods?.watch("all_pages") || []}
                getOptionLabel={(option) =>
                  `${option?.post_title} (#${option?.ID})` || ""
                }
                isOptionEqualToValue={(option, value) => {
                  return option?.ID === value?.ID;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {methods?.watch("thankyouInput") !== "" && createPageMutation?.isPending ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      },
                    }}
                    onChange={(e) => methods?.setValue("thankyouInput", e.target.value)}
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
                slots={{
                  paper: (data) => {
                    return (
                      <Paper>
                        {data?.children}
                        <Button
                          color="primary"
                          fullWidth
                          sx={{ justifyContent: "flex-start", pl: 2 }}
                          disabled={!hasCapability("acadlix_create_page_setting")}
                          onMouseDown={(e) => {
                            if (methods?.watch("thankyouInput") === "") {
                              toast.error(__("Title cannot be empty.", "acadlix"));
                              return;
                            }
                            createPageMutation?.mutate(
                              {
                                title: methods?.watch("thankyouInput"),
                                user_id: acadlixOptions?.user_id,
                              },
                              {
                                onSuccess: (data) => {
                                  methods?.setValue("thankyouInput", "", { shouldDirty: true });
                                  methods?.setValue(
                                    "all_pages",
                                    data?.data?.all_pages,
                                    { shouldDirty: true }
                                  );
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
                  }
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
          <CourseOptions {...props} />
          {/* Currency options */}
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Currency Options", "acadlix")}
              <CustomFeatureTooltip
                plan={"open"}
                msg={__("Configure the currency, symbol, symbol position, thousand and decimal separators, and the number of decimal places used for displaying prices to students.", "acadlix")}
                placement="right-start"
                redirectTo={`${acadlixOptions?.acadlix_docs_url}settings/general/#currency-options`}
              />
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Currency", "acadlix")}
              </CustomTypography>
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
                  `(${getStripHtml(option?.symbol)} ${option?.short_name}) ${option?.name}` || ""
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
              <CustomTypography>
                {__("Currency position", "acadlix")}
              </CustomTypography>
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
              <CustomTypography>
                {__("Thousand separator", "acadlix")}
              </CustomTypography>
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
              <CustomTypography>
                {__("Decimal separator", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                size="small"
                type="text"
                value={props?.watch("acadlix_decimal_separator")}
                onChange={(e) => {
                  props?.setValue("acadlix_decimal_separator", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("The number of decimals", "acadlix")}
              </CustomTypography>
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
            <Typography variant="h4">{__("Admin Options", "acadlix")}
              <CustomFeatureTooltip
                plan={"open"}
                msg={__("Set how many rows per page will be displayed in the admin panel.", "acadlix")}
                placement="right-start"
                redirectTo={`${acadlixOptions?.acadlix_docs_url}settings/general/#admin-options`}
              />
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Default rows per page", "acadlix")}
              </CustomTypography>
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
          {/* Frontend Options */}
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Frontend Options", "acadlix")}
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Disable Admin Toolbar", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                control={<CustomSwitch />}
                value="yes"
                checked={props?.watch("acadlix_disable_admin_toolbar") === "yes"}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue(
                      "acadlix_disable_admin_toolbar",
                      e?.target?.checked ? e?.target?.value : "no",
                      { shouldDirty: true }
                    );
                  }
                }}
              />
            </Grid>
          </Grid>
          {/* Student Dashboard options */}
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Student Dashboard Options", "acadlix")}
              <CustomFeatureTooltip
                plan={"open"}
                msg={__("Configure dashboard settings such as the logout redirect URL, enable a full-width dashboard layout, and display the site logo in the header.", "acadlix")}
                placement="right-start"
                redirectTo={`${acadlixOptions?.acadlix_docs_url}settings/general/#student-dashboard-options`}
              />
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Logout redirect url", "acadlix")}
              </CustomTypography>
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
              <CustomTypography>
                {__("Enable dashboard fullwidth", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                control={<CustomSwitch />}
                value="yes"
                checked={props?.watch("acadlix_enable_dashboard_fullwidth") === "yes"}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue(
                      "acadlix_enable_dashboard_fullwidth",
                      e?.target?.checked ? e?.target?.value : "no",
                      { shouldDirty: true }
                    );
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Enable site logo in header", "acadlix")}
              </CustomTypography>
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
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Enable course content scroll button", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                control={<CustomSwitch />}
                value="yes"
                checked={props?.watch("acadlix_enable_course_content_scroll_button") === "yes"}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue(
                      "acadlix_enable_course_content_scroll_button",
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
            <Typography variant="h4">{__("Checkout Options", "acadlix")}
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Enable Coupon Code", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <FormControlLabel
                label={__("Activate", "acadlix")}
                control={<CustomSwitch />}
                value="yes"
                checked={props?.watch("acadlix_enable_coupon_code") === "yes"}
                onClick={(e) => {
                  if (e?.target?.checked !== undefined) {
                    props?.setValue(
                      "acadlix_enable_coupon_code",
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
            <Typography variant="h4">{__("Data Management", "acadlix")}
              <CustomFeatureTooltip
                plan={"open"}
                msg={__("Enabling this option will delete all the associated data with the Acadlix LMS when you delete it from your site. If you want to keep the data stored in your database even when you delete the Acadlix LMS from your site, then keep it disabled.", "acadlix")}
                placement="right-start"
                redirectTo={`${acadlixOptions?.acadlix_docs_url}settings/general/#data-management`}
              />
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={{
              xs: 2,
              sm: 4,
            }}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Delete Data on Plugin Uninstall", "acadlix")}
              </CustomTypography>
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
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          loading={props?.isPending}
        >
          {__("Save", "acadlix")}
        </Button>
      </CardActions>
    </Card >
  );
}

export default General;
