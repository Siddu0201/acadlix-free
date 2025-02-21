import React from "react";
import {
  Tab,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import General from "./section/General";
import Payment from "./section/Payment";
import Notification from "./section/Notification";
import License from "./section/License";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Permalink from "./section/Permalink";
import { useForm } from "react-hook-form";
import { PostUpdateSetting } from "../../../requests/admin/AdminSettingRequest";
import toast from "react-hot-toast";
import QuizSettings from "./section/QuizSettings";
import { __ } from "@wordpress/i18n";

function Setting() {
  const [value, setValue] = React.useState("1");
  const [pages, setPages] = React.useState(acadlixOptions?.all_pages ?? []);
  const [currencies, setCurrency] = React.useState(
    acadlixOptions?.currecies_with_symbol ?? []
  );
  const methods = useForm({
    defaultValues: {
      // General Options
      acadlix_all_courses_page_id:
        acadlixOptions?.options?.acadlix_all_courses_page_id ?? null,
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
      acadlix_no_of_courses_per_page:
        acadlixOptions?.options?.acadlix_no_of_courses_per_page ?? 10,
      acadlix_one_click_checkout:
        acadlixOptions?.options?.acadlix_one_click_checkout ?? "no",
      acadlix_admin_auto_registration_to_courses:
        acadlixOptions?.options?.acadlix_admin_auto_registration_to_courses ??
        "no",
      acadlix_admin_can_assign_courses_to_student:
        acadlixOptions?.options?.acadlix_admin_can_assign_courses_to_student ??
        "no",
      acadlix_admin_can_remove_student_from_course:
        acadlixOptions?.options?.acadlix_admin_can_remove_student_from_course ??
        "no",
      acadlix_currency: acadlixOptions?.options?.acadlix_currency ?? "USD",
      acadlix_currency_position:
        acadlixOptions?.options?.acadlix_currency_position ?? "Left ( $99.99 )",
      acadlix_thousand_separator:
        acadlixOptions?.options?.acadlix_thousand_separator ?? ",",
      acadlix_decimal_seprator:
        acadlixOptions?.options?.acadlix_decimal_seprator ?? ".",
      acadlix_number_of_decimals:
        acadlixOptions?.options?.acadlix_number_of_decimals ?? 2,
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
      // License option
      acadlix_license_email_id:
        acadlixOptions?.options?.acadlix_license_email_id ?? "",
      acadlix_license_key: acadlixOptions?.options?.acadlix_license_key ?? "",
    },
  });


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateMutation = PostUpdateSetting();
  const onSubmit = (data) => {
    updateMutation?.mutate(data, {
      onSuccess: (data) => {
        toast.success(__('Settings saved successfully.', 'acadlix'));
      },
    });
  };

  return (
    <Box>
      <form onSubmit={methods?.handleSubmit(onSubmit)}>
        <Grid
          container
          rowSpacing={3}
          spacing={4}
          sx={{
            padding: 4,
          }}
        >
          <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <Card>
              <CardContent>
                <Box sx={{ width: "100%" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable prevent tabs example"
                      >
                        <Tab label={__("General", "acadlix")} value="1" />
                        <Tab label={__("Payment", "acadlix")} value="2" />
                        <Tab label={__("Notification", "acadlix")} value="3" />
                        <Tab label={__("Permalink", "acadlix")} value="4" />
                        <Tab label={__("Quiz", "acadlix")} value="5" />
                        <Tab label={__("License", "acadlix")} value="6" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <General
                        {...methods}
                        pages={pages}
                        currencies={currencies}
                        setPages={setPages}
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <Payment {...methods} />
                    </TabPanel>
                    <TabPanel value="3">
                      <Notification {...methods} />
                    </TabPanel>
                    <TabPanel value="4">
                      <Permalink {...methods} />
                    </TabPanel>
                    <TabPanel value="5">
                      <QuizSettings {...methods} />
                    </TabPanel>
                    <TabPanel value="6">
                      <License {...methods} />
                    </TabPanel>
                  </TabContext>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            marginX: 4,
          }}
        >
          {updateMutation?.isPending ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            __("Save", "acadlix")
          )}
        </Button>
      </form>
    </Box>
  );
}

export default Setting;
