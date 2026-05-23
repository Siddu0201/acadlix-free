import CustomTypography from '@acadlix/components/CustomTypography'
import { CourseIcon, FaChartLine, FaClipboardQuestion, FaMoneyBillTransfer, FaQuora, FaUser, FaVideo } from '@acadlix/helpers/icons'
import { currencyPosition } from '@acadlix/helpers/util'
import { GetQuickPerformanceData } from '@acadlix/requests/admin/AdminHomeRequest'
import { Avatar, Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'

const QuickPerformance = (props) => {
  const methods = useForm({
    defaultValues: {
      'quizes': 0,
      'courses': 0,
      'lessons': 0,
      'questions': 0,
      'today_sale': 0,
      'total_sale': 0,
    }
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

  return (
    <Grid container spacing={{
      xs: 2,
      sm: 4,
    }}>
      <SinglePerformance
        icon={<FaMoneyBillTransfer />}
        iconColor="primary"
        title="Today's Sale"
        value={currencyPosition(methods.watch('today_sale'))}
        isFetching={isFetching}
      />
      <SinglePerformance
        icon={<FaChartLine />}
        iconColor="info"
        title="Total Sale"
        value={currencyPosition(methods.watch('total_sale'))}
        isFetching={isFetching}
      />
      <SinglePerformance
        icon={<CourseIcon />}
        iconColor="warning"
        title="Total Courses"
        value={methods.watch('courses')}
        isFetching={isFetching}
      />
      <SinglePerformance
        icon={<FaVideo />}
        iconColor="success"
        title="Total Lessons"
        value={methods.watch('lessons')}
        isFetching={isFetching}
      />
      <SinglePerformance
        icon={<FaClipboardQuestion />}
        iconColor="error"
        title="Total Quizzes"
        value={methods.watch('quizes')}
        isFetching={isFetching}
      />
      <SinglePerformance
        icon={<FaQuora />}
        iconColor="secondary"
        title="Total Questions"
        value={methods.watch('questions')}
        isFetching={isFetching}
      />
    </Grid>
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
              color={(theme) => theme.palette.text.secondary}
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