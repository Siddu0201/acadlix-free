import React from "react";
import {
  Box,
  Card,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import General from "./section/General";
import Payment from "./section/Payment";
import Notification from "./section/Notification";
import Permalink from "./section/Permalink";
import { useForm } from "react-hook-form";
import { PostUpdateSetting } from "@acadlix/requests/admin/AdminSettingRequest";
import toast from "react-hot-toast";
import QuizSettings from "./section/QuizSettings";
import { __ } from "@wordpress/i18n";
import Integration from "./section/Integration";
import { IoMenu } from "@acadlix/helpers/icons";
import { useNavigate } from "react-router-dom";
import { filteredSettingRoutes } from "@acadlix/admin/AdminSetting";

const Setting = ({ selected = 'general' }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [pages, setPages] = React.useState(acadlixOptions?.all_pages ?? []);
  const [currencies, setCurrency] = React.useState(
    acadlixOptions?.currecies_with_symbol ?? []
  );

  const baseDefaults = {
    // General Options
    // Page Setup
    acadlix_dashboard_page_id:
      acadlixOptions?.options?.acadlix_dashboard_page_id ?? null,
    acadlix_advance_quiz_page_id:
      acadlixOptions?.options?.acadlix_advance_quiz_page_id ?? null,
    acadlix_cart_page_id:
      acadlixOptions?.options?.acadlix_cart_page_id ?? null,
    acadlix_checkout_page_id:
      acadlixOptions?.options?.acadlix_checkout_page_id ?? null,
    acadlix_thankyou_page_id:
      acadlixOptions?.options?.acadlix_thankyou_page_id ?? null,
    // Course Options
    acadlix_no_of_courses_per_page:
      acadlixOptions?.options?.acadlix_no_of_courses_per_page ?? 10,
    acadlix_disable_wishlist:
      acadlixOptions?.options?.acadlix_disable_wishlist ?? "no",
    acadlix_one_click_checkout:
      acadlixOptions?.options?.acadlix_one_click_checkout ?? "no",
    // Currency Options
    acadlix_currency: acadlixOptions?.options?.acadlix_currency ?? "USD",
    acadlix_currency_position:
      acadlixOptions?.options?.acadlix_currency_position ?? "Left ( $99.99 )",
    acadlix_thousand_separator:
      acadlixOptions?.options?.acadlix_thousand_separator ?? ",",
    acadlix_decimal_seprator:
      acadlixOptions?.options?.acadlix_decimal_seprator ?? ".",
    acadlix_number_of_decimals:
      acadlixOptions?.options?.acadlix_number_of_decimals ?? 2,
    // Admin Options
    acadlix_admin_auto_registration_to_courses:
      acadlixOptions?.options?.acadlix_admin_auto_registration_to_courses ??
      "no",
    acadlix_admin_can_assign_courses_to_student:
      acadlixOptions?.options?.acadlix_admin_can_assign_courses_to_student ??
      "no",
    acadlix_admin_can_remove_student_from_course:
      acadlixOptions?.options?.acadlix_admin_can_remove_student_from_course ??
      "no",
    acadlix_default_rows_per_page:
      acadlixOptions?.options?.acadlix_default_rows_per_page ?? 20,
    // Student Dashboard Options
    acadlix_logout_redirect_url:
      acadlixOptions?.options?.acadlix_logout_redirect_url ?? "",
    acadlix_disable_home_menu:
      acadlixOptions?.options?.acadlix_disable_home_menu ?? "no",
    acadlix_enable_site_logo_in_header:
      acadlixOptions?.options?.acadlix_enable_site_logo_in_header ?? "no",
    // Data management
    acadlix_delete_data_on_plugin_uninstall:
      acadlixOptions?.options?.acadlix_delete_data_on_plugin_uninstall ?? "no",
    // Payment option
    acadlix_razorpay_active:
      acadlixOptions?.options?.acadlix_razorpay_active ?? "no",
    acadlix_razorpay_client_id:
      acadlixOptions?.options?.acadlix_razorpay_client_id ?? "",
    acadlix_razorpay_secret_key:
      acadlixOptions?.options?.acadlix_razorpay_secret_key ?? "",
    acadlix_paypal_active:
      acadlixOptions?.options?.acadlix_paypal_active ?? "no",
    acadlix_paypal_client_id:
      acadlixOptions?.options?.acadlix_paypal_client_id ?? "",
    acadlix_paypal_secret_key:
      acadlixOptions?.options?.acadlix_paypal_secret_key ?? "",
    acadlix_paypal_sandbox:
      acadlixOptions?.options?.acadlix_paypal_sandbox ?? "no",
    acadlix_payu_active:
      acadlixOptions?.options?.acadlix_payu_active ?? "no",
    acadlix_payu_merchant_key:
      acadlixOptions?.options?.acadlix_payu_merchant_key ?? "",
    acadlix_payu_salt:
      acadlixOptions?.options?.acadlix_payu_salt ?? "",
    acadlix_payu_sandbox:
      acadlixOptions?.options?.acadlix_payu_sandbox ?? "no",
    acadlix_offline_payment:
      acadlixOptions?.options?.acadlix_offline_payment ?? "no",
    // Notification option
    acadlix_notify_course_purchase_to_student:
      acadlixOptions?.options?.acadlix_notify_course_purchase_to_student ??
      "no",
    acadlix_notify_course_purchase_to_admin:
      acadlixOptions?.options?.acadlix_notify_course_purchase_to_admin ??
      "no",
    acadlix_notify_course_completion_to_student:
      acadlixOptions?.options?.acadlix_notify_course_completion_to_student ??
      "no",
    acadlix_notify_course_completion_to_admin:
      acadlixOptions?.options?.acadlix_notify_course_completion_to_admin ??
      "no",
    acadlix_notify_failed_transation_to_student:
      acadlixOptions?.options?.acadlix_notify_failed_transation_to_student ??
      "no",
    acadlix_notify_failed_transation_to_admin:
      acadlixOptions?.options?.acadlix_notify_failed_transation_to_admin ??
      "no",
    // Permalink option
    acadlix_course_base:
      acadlixOptions?.options?.acadlix_course_base ?? "courses",
    acadlix_course_category_base:
      acadlixOptions?.options?.acadlix_course_category_base ??
      "course-category",
    acadlix_course_tag_base:
      acadlixOptions?.options?.acadlix_course_tag_base ?? "course-tag",
    // Integration option
    acadlix_openai_api_key:
      acadlixOptions?.options?.acadlix_openai_api_key ?? "",
  }

  const filteredDefaults = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.defaultValues",
    baseDefaults,
    acadlixOptions?.options ?? {}
  ) ?? baseDefaults;

  const methods = useForm({
    defaultValues: filteredDefaults,
  });

  const [open, setOpen] = React.useState(isDesktop ? true : false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  if (process?.env?.REACT_APP_MODE === 'development') {
    console.log(methods.watch());
  }

  const updateMutation = PostUpdateSetting();
  const onSubmit = (data) => {
    updateMutation?.mutate(data, {
      onSuccess: (data) => {
        toast.success(__('Settings saved successfully.', 'acadlix'));
        // window.location.reload();
      },
    });
  };

  return (
    <Box>
      <form onSubmit={methods?.handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={{ xs: 2, sm: 4 }}
          sx={{
            padding: {
              xs: 2,
              sm: 4,
            },
          }}
        >
          <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <AppBar
              position="static"
            >
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleDrawerToggle}
                >
                  <IoMenu />
                </IconButton>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    color: 'primary.contrastText',
                  }}
                >
                  {__('Settings', 'acadlix')}
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <DesktopSidebar
            selected={selected}
            isDesktop={isDesktop}
            open={open}
          />
          <MobileSidebar
            selected={selected}
            isDesktop={isDesktop}
            open={open}
            setOpen={setOpen}
          />

          <Grid size={{
            lg: open ? 9 : 12,
            md: open ? 9 : 12,
            sm: open ? 8 : 12,
            xs: 12
          }}>
            {
              selected === "general" && (
                <General
                  {...methods}
                  pages={pages}
                  currencies={currencies}
                  setPages={setPages}
                  isPending={updateMutation?.isPending}
                />
              )
            }
            {
              selected === "payment" && (
                <Payment
                  {...methods}
                  isPending={updateMutation?.isPending}
                />
              )
            }
            {
              selected === "notification" && (
                <Notification
                  {...methods}
                  isPending={updateMutation?.isPending}
                />
              )
            }
            {
              selected === "permalink" && (
                <Permalink
                  {...methods}
                  isPending={updateMutation?.isPending}
                />
              )
            }
            {
              selected === "quiz" && (
                <QuizSettings
                  {...methods}
                  isPending={updateMutation?.isPending}
                />
              )
            }
            {
              selected === "integration" && (
                <Integration
                  {...methods}
                  isPending={updateMutation?.isPending}
                />
              )
            }
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Setting;

const DesktopSidebar = ({ selected, isDesktop, open }) => {
  const navigate = useNavigate();
  if (!isDesktop) return null;
  return (
    <Grid
      size={{
        lg: open ? 3 : 0,
        md: open ? 3 : 0,
        sm: open ? 4 : 0,
        xs: 12
      }}
      sx={{
        display: {
          lg: open ? 'block' : 'none',
          md: open ? 'block' : 'none',
          sm: open ? 'block' : 'none',
          xs: 'none',
        },
      }}
    >
      <Card sx={{ height: '100%' }}>
        <List component="nav">
          {
            filteredSettingRoutes.map((route, index) => (
              <ListItemButton
                key={index}
                selected={selected === route.name}
                onClick={() => navigate(route.path)}
              >
                <ListItemText
                  primary={route.label}
                  slotProps={{
                    primary: {
                      sx: {
                        color: selected === route.name ? 'primary.main' : 'text.primary',
                      }
                    }
                  }}
                />
              </ListItemButton>
            ))
          }
        </List>
      </Card>
    </Grid>
  )
}

const MobileSidebar = ({ selected, isDesktop, open, setOpen }) => {
  const navigate = useNavigate();
  if (isDesktop) return null;
  return (
    <Box>
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '200px',
            top: "46px"
          },
        }}
      >
        <List component="nav">
          {
            filteredSettingRoutes.map((route, index) => (
              <ListItemButton
                key={index}
                selected={selected === route.name}
                onClick={() => {
                  navigate(route.path);
                  setOpen(false);
                }}
              >
                <ListItemText
                  primary={route.label}
                  slotProps={{
                    primary: {
                      sx: {
                        color: selected === route.name ? 'primary.main' : 'text.primary',
                      }
                    }
                  }}
                />
              </ListItemButton>
            ))
          }
        </List>
      </Drawer>
    </Box>
  )

}
