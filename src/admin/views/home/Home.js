import React from "react";
import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import QuickActions from "./sections/QuickActions";
import WelcomeHeader from "./sections/WelcomeHeader";
import QuickPerformance from "./sections/QuickPerformance";
import CourseOverview from "./sections/CourseOverview";
import RevenueOverview from "./sections/RevenueOverview";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';

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
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <WelcomeHeader {...methods} />,
          },
        ]
      },
      {
        component: "Grid",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <QuickPerformance {...methods} />,
          },
        ]
      },
      {
        component: "Grid",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <QuickActions {...methods} />,
          },
        ]
      },
      {
        component: "Grid",
        props: {
          size: {
            xs: 12,
            md: 12,
          },
        },
        children: [
          {
            component: <CourseOverview {...methods} />,
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
