import React from "react";
import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import QuickActions from "./sections/QuickActions";
import WelcomeHeader from "./sections/WelcomeHeader";
import QuickPerformance from "./sections/QuickPerformance";
import TopEnrolledCourses from "./sections/TopEnrolledCourses";
import RevenueOverview from "./sections/RevenueOverview";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import TopSoldCourses from "./sections/TopSoldCourses";
import { hasCapability } from "@acadlix/helpers/util";

const Home = () => {
  const baseSettings = {
    'courseUrl': `${acadlixOptions?.admin_url}edit.php?post_type=acadlix_course`,
    'createCourseUrl': `${acadlixOptions?.admin_url}post-new.php?post_type=acadlix_course`,
    'courseStudentUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_course_students`,
    'quizUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_quiz`,
    'createQuizUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_quiz#/create`,
    'lessonUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_lesson`,
    'createLessonUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_lesson#/create`,
    'couponUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_coupon`,
    'createCouponUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_coupon#/create`,
    'settingsUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_settings`,
    'orderUrl': `${acadlixOptions?.admin_url}admin.php?page=acadlix_order`,
    'documentationUrl': acadlixOptions?.acadlix_documentation_url,
    'youtubeUrl': acadlixOptions?.acadlix_youtube_channel_url,
  };

  const filteredSettings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.base_settings",
    baseSettings,
    {
      acadlixOptions: acadlixOptions,
    }
  ) ?? baseSettings;

  const methods = useForm({
    defaultValues: filteredSettings,
  });

  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch());
  }

  const defaultSetting = {
    component: "Grid",
    component_name: "home_grid_container",
    props: {
      container: true,
      spacing: {
        xs: 2,
        sm: 4,
      },
      sx: {
        padding: {
          xs: 2,
          sm: 4,
        },
      },
    },
    children: [
      {
        component: "Grid",
        component_name: "home_grid_welcome_header",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <WelcomeHeader {...methods} />,
            component_name: "welcome_header_component",
          },
        ]
      },
      hasCapability('acadlix_show_quick_performance') && {
        component: "Grid",
        component_name: "home_grid_quick_performance",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <QuickPerformance {...methods} />,
            component_name: "quick_performance_component",
          },
        ]
      },
      {
        component: "Grid",
        component_name: "home_grid_quick_actions",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <QuickActions {...methods} />,
            component_name: "quick_actions_component",
          },
        ]
      },
      hasCapability('acadlix_show_top_courses_by_enrollment') && {
        component: "Grid",
        component_name: "home_grid_top_enrolled_courses",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <TopEnrolledCourses {...methods} />,
            component_name: "top_enrolled_courses_component",
          },
        ]
      },
      hasCapability('acadlix_show_top_courses_by_sales') && {
        component: "Grid",
        component_name: "home_grid_top_sold_courses",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <TopSoldCourses {...methods} />,
            component_name: "top_sold_courses_component",
          },
        ]
      },
    ]
  }

  const homeRender = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.render",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
    }
  ) ?? [];

  return (
    <>
      {homeRender.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              setValue: methods?.setValue,
              watch: methods?.watch,
              control: methods?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
};

export default Home;
