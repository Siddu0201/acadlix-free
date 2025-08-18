import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import AcadlixLogo from "@acadlix/images/acadlix_logo.png";
import {
  AiOutlineFileSearch,
  FaCog,
  MdOutlineSupportAgent
} from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { RawHTML } from "@wordpress/element";
import { useForm } from "react-hook-form";
import { GetHomeData } from "@acadlix/requests/admin/AdminHomeRequest";
import Loader from "@acadlix/components/Loader";
import { currencyPosition } from "../../../helpers/util";

const Home = () => {
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

  const { data, isFetching } = GetHomeData();

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

  if(process.env.REACT_APP_MODE === 'development'){
    console.log(methods?.watch());
  }

  if (isFetching) {
    return (
      <Loader />
    )
  }
  return (
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 4,
      }}
      sx={{
        padding: {
          xs: 2,
          sm: 4,
        },
      }}
    >
      <Grid size={{ xs: 12, md: 12 }}>
        <Card>
          <CardContent
            sx={{
              padding: 6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    paddingY: 3,
                  }}
                >
                  <RawHTML>
                    {__("Welcome to <b>Acadlix</b>", "acadlix")}
                  </RawHTML>
                </Typography>
                <Typography variant="body1">{__("The Next-Gen LMS For WordPress.", "acadlix")}</Typography>
              </Box>
              <Box
                component="img"
                sx={{
                  height: {
                    md: 50,
                    xs: 40,
                  },
                }}
                alt="Acadlix logo."
                src={AcadlixLogo}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <Grid container spacing={4} rowSpacing={3} sx={{ height: "100%" }}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={__("Today's Sale", "acadlix")} />
              <CardContent>
                <Box>
                  <Typography>{currencyPosition(methods?.watch("today_sale"))}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={__("Total Sale", "acadlix")} />
              <CardContent>
                <Box>
                  <Typography>{currencyPosition(methods?.watch("total_sale"))}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={__("Courses", "acadlix")} />
              <CardContent>
                <Box>
                  <Typography>{methods?.watch("courses")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={__("Lessons", "acadlix")} />
              <CardContent>
                <Box>
                  <Typography>{methods?.watch("lessons")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={__("Quizzes", "acadlix")} />
              <CardContent>
                <Box>
                  <Typography>{methods?.watch("quizes")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={__("Questions", "acadlix")} />
              <CardContent>
                <Box>
                  <Typography>{methods?.watch("questions")}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>


      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            height: "100%",
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
                <FaCog />
                <Typography
                  variant="h6"
                >
                  {__("Need any custom feature?", "acadlix")}
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
              >
                {__("Have unique requirements? We support custom development for specific LMS needs", "acadlix")}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              LinkComponent="a"
              target="__blank"
              href={acadlixOptions?.acadlix_contact_us_url}
            >
              {__("Let's Discuss", "acadlix")}
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <MdOutlineSupportAgent />
                <Typography
                  variant="h6"
                >
                  {__("Need Help?", "acadlix")}
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
              >
                {__("Get expert support when you need it. Fast, reliable, and human.", "acadlix")}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              LinkComponent="a"
              target="__blank"
              href={acadlixOptions?.acadlix_contact_us_url}
            >
              {__("Get Help Now", "acadlix")}
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <AiOutlineFileSearch />
                <Typography
                  variant="h6"
                >
                  {__("Documentation", "acadlix")}
                </Typography>
              </Box>
            }
          />
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": {
                paddingBottom: 4,
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
              >
                {__("New to Acadlix? Our detailed docs will guide you through every step of setup and beyond.", "acadlix")}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              LinkComponent="a"
              target="__blank"
              href={acadlixOptions?.acadlix_documentation_url}
            >
              {__("Explore Docs", "acadlix")}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
