import React from "react";
import { Typography, Box, styled } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Picture1 from "../images/dashboard.svg";
import Picture2 from "../images/blob-4-light-teal.svg";
import Picture3 from "../images/blob-5-blue.svg";
import Picture4 from "../images/blob-4-safrron.svg";
import { useTheme } from "@mui/material/styles";
import { dateI18n } from "@wordpress/date";
import { __ } from "@wordpress/i18n";

const DashboardHeader = () => {
  const HeaderContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1.5),
    position: "relative",
    boxShadow: "0 8px 8px -4px rgba(0, 0, 0, 0.2)",
    borderRadius: "16px",
    backgroundColor: "white",
    height: "168px",
    [theme.breakpoints.down("sm")]: {
      height: "150px",
    },
  }));

  const StyledImage1 = styled("img")(({ theme }) => ({
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(1),
    height: "160px",
    maxWidth: "100%",
    zIndex: 1,
  }));

  const StyledImage2 = styled("img")(({ theme }) => ({
    position: "absolute",
    height: "60px",
    maxWidth: "100%",
    zIndex: 0,
  }));

  const theme = useTheme();

  return (
    <HeaderContainer sx={{ mt: 3, mx: { lg: 0, md: 0, sm: 0, xs: 2 } }}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: "100%",
        }}
      >
        <Grid
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              ml: {
                sm: 8,
                xs: 4,
              },
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: {
                    sm: 15,
                    xs: 1,
                  },
                  color: "black",
                  fontWeight: 500,
                  fontSize: {
                    sm: "1rem",
                    xs: "0.875rem",
                  },
                }}
              >
                {dateI18n(acadlixOptions?.date_time_format)}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1.3rem",
                    sm: "2rem",
                  },
                }}
              >
                {__("Welcome Back,", 'acadlix')}{" "}
                <Box
                  component="span"
                  sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
                >
                  {acadlixOptions?.user?.display_name}!
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                  },
                }}
              >
                {__("Unlock your potential and track your progress to success!", 'acadlix')}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              mt: 2,
              display: {
                lg: "block",
                xs: "none",
              },
            }}
          >
            <StyledImage2
              src={Picture2}
              alt={__("Header Image 2", 'acadlix')}
              sx={{
                position: "absolute",
                right: "30%",
                bottom: "65px",
              }}
            />
            <StyledImage2
              src={Picture3}
              alt={__("Header Image 3", 'acadlix')}
              sx={{
                position: "absolute",
                right: "75%",
                bottom: "60px",
              }}
            />
            <StyledImage2
              src={Picture4}
              alt={__("Header Image 4", 'acadlix')}
              sx={{
                position: "absolute",
                right: "50%",
                bottom: "0px",
              }}
            />
          </Box>
        </Grid>

        <Grid
          sx={{
            display: {
              sm: "block",
              xs: "none",
            }
          }}
        >
          <StyledImage1 src={Picture1} alt={__("Header Image 1", 'acadlix')} />
        </Grid>
      </Grid>
    </HeaderContainer>
  );
};

export default DashboardHeader;
