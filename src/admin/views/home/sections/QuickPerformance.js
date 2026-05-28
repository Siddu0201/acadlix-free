import CustomTypography from '@acadlix/components/CustomTypography'
import { CourseIcon, FaChartLine, FaClipboardQuestion, FaMoneyBillTransfer, FaQuora, FaUser, FaVideo } from '@acadlix/helpers/icons'
import { currencyPosition } from '@acadlix/helpers/util'
import { GetQuickPerformanceData } from '@acadlix/requests/admin/AdminHomeRequest'
import { Avatar, Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer'

const QuickPerformance = (props) => {
  const baseSettings = {
    'quizes': 0,
    'courses': 0,
    'lessons': 0,
    'questions': 0,
    'today_sale': 0,
    'total_sale': 0,
  };
  const filteredSettings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.quick_performance.base_settings",
    baseSettings,
    {
      acadlixOptions: acadlixOptions,
    }
  ) ?? baseSettings;

  const methods = useForm({
    defaultValues: filteredSettings,
  });

  const { data, isFetching } = GetQuickPerformanceData();

  React.useEffect(() => {
    if (data?.data) {
      methods.setValue('quizes', data.data.quizes);
      methods.setValue('courses', data.data.courses);
      methods.setValue('lessons', data.data.lessons);
      methods.setValue('questions', data.data.questions);
      methods.setValue('today_sale', data.data.today_sale);
      methods.setValue('total_sale', data.data.total_sale);
    }
  }, [data]);

  const defaultSetting = {
    component: "Grid",
    component_name: "quick_performance_grid",
    props: {
      container: true,
      spacing: {
        xs: 2,
        sm: 4,
      },
    },
    children: [
      {
        component: <SinglePerformance
          icon={<FaMoneyBillTransfer />}
          iconColor="primary"
          title={__("Today's Sale", "acadlix")}
          value={currencyPosition(methods.watch('today_sale'))}
          isFetching={isFetching}
        />,
        component_name: "quick_performance_today_sale",
      },
      {
        component: <SinglePerformance
          icon={<FaChartLine />}
          iconColor="info"
          title={__("Total Sale", "acadlix")}
          value={currencyPosition(methods.watch('total_sale'))}
          isFetching={isFetching}
        />,
        component_name: "quick_performance_total_sale",
      },
      {
        component: <SinglePerformance
          icon={<CourseIcon />}
          iconColor="warning"
          title={__("Total Courses", "acadlix")}
          value={methods.watch('courses')}
          isFetching={isFetching}
        />,
        component_name: "quick_performance_total_courses",
      },
      {
        component: <SinglePerformance
          icon={<FaVideo />}
          iconColor="success"
          title={__("Total Lessons", "acadlix")}
          value={methods.watch('lessons')}
          isFetching={isFetching}
        />,
        component_name: "quick_performance_total_lessons",
      },
      {
        component: <SinglePerformance
          icon={<FaClipboardQuestion />}
          iconColor="error"
          title={__("Total Quizzes", "acadlix")}
          value={methods.watch('quizes')}
          isFetching={isFetching}
        />,
        component_name: "quick_performance_total_quizzes",
      },
      {
        component: <SinglePerformance
          icon={<FaQuora />}
          iconColor="secondary"
          title={__("Total Questions", "acadlix")}
          value={methods.watch('questions')}
          isFetching={isFetching}
        />,
        component_name: "quick_performance_total_questions",
      },
    ]
  }

  const quick_performace = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.home.quick_performance",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      props: props,
    }
  );

  return (
    <>
      {quick_performace.map((field, i) => (
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
}

export default QuickPerformance

const SinglePerformance = (props) => {
  return (
    <Grid size={{ xs: 6, sm: 4, md: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}>
            <Avatar
              variant="rounded"
              sx={{
                height: 50,
                width: 50,
                backgroundColor: (theme) => theme.palette[props.iconColor].light,
                color: (theme) => theme.palette[props.iconColor].main,
              }}
            >
              {props.icon}
            </Avatar>
            <Typography
              variant="caption"
              sx={{
                color: (theme) => `${theme.palette.text.secondary}`
              }}
            >
              {props.title}
            </Typography>
            <CustomTypography
              variant="h3"
            >
              {
                props.isFetching ? (
                  <Skeleton />
                ) :
                  props.value
              }
            </CustomTypography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}