import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Typography, Card, CardContent, Box } from "@mui/material";
import menus from "../menu/dashboardMenu";

const DashboardHeader = () => {
  const { pathname } = useLocation();
  return (
    <Card
      sx={{
        borderRadius: 0,
        bgcolor: "#2d2f31",
      }}
    >
      <CardContent
        sx={{
          paddingX: {
            xs: 4,
            md: 40,
          },
          paddingY: 0,
          "&:last-child": {
            paddingBottom: 0,
          },
        }}
      >
        <Box
          sx={{
            paddingY: {
              xs: 4,
              md: 8,
            },
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: {
                xs: 26,
                md: 34,
              },
              fontWeight: 700,
            }}
          >
            My learning
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridAutoColumns: "max-content",
            gridAutoFlow: "column",
            gridGap: "1.6rem",
          }}
        >
          {menus.length > 0 &&
            menus.map((menu, index) => (
              <Box
                key={index}
                sx={{
                  height: {
                    xs: "1.6rem",
                    md: "2rem",
                  },
                  minWidth: "fit-content",
                  marginY: 2,
                  marginBottom: 0,
                  borderBottom: {
                    xs: menu?.path === pathname ? `0.3rem solid white` : "none",
                    md: menu?.path === pathname ? `0.5rem solid white` : "none",
                  },
                  textDecoration: "none",
                }}
                component={Link}
                to={menu?.path}
              >
                <Typography
                  sx={{
                    color: menu?.path === pathname ? "white" : "#d1d7dc",
                    fontSize: {
                      xs: "0.8rem",
                      md: "1rem",
                    },
                    fontWeight: 500,
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  {menu.name}
                </Typography>
              </Box>
            ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
