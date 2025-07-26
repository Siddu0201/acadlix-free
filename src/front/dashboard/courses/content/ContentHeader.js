import { Box, Button, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "@acadlix/helpers/icons";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { __ } from "@wordpress/i18n";

const ContentHeader = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  return (
    <Box
      id="acadlix_course_content_header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: {
          xs: "45px",
          sm: "52px",
        },
        paddingRight: 3,
        backgroundColor: (theme) => theme.palette?.primary?.main,
        color: (theme) => theme?.palette?.primary?.contrastText,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          {props?.open ? (
            <IconButton
              onClick={props?.handleOpen}
              sx={{
                borderRadius: 0,
                paddingX: 1,
                paddingY: 2,
                boxShadow: "none",
                color: "white",
                backgroundColor: "transparent",
                ":hover, :focus": {
                  boxShadow: "none",
                  color: "white",
                  backgroundColor: "transparent",
                  outline: "none",
                },
              }}
            >
              <FaAngleLeft />
            </IconButton>
          ) : (
            <IconButton
              onClick={props?.handleOpen}
              sx={{
                borderRadius: 0,
                paddingX: 1,
                paddingY: 2,
                boxShadow: "none",
                color: "white",
                backgroundColor: "transparent",
                ":hover, :focus": {
                  boxShadow: "none",
                  color: "white",
                  backgroundColor: "transparent",
                  outline: "none",
                },
              }}
            >
              <FaAngleRight />
            </IconButton>
          )}
        </Box>
        <Box
          sx={{
            paddingLeft: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 14,
                md: 18,
              },
              lineHeight: {
                xs: 1.25,
                md: 1.5
              },
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {isMobile
              ? props?.watch("course_title")?.length > 40
                ? <Tooltip title={props?.watch("course_title")} arrow>
                  {`${props?.watch("course_title").slice(0, 40)}...`}
                </Tooltip>
                : props?.watch("course_title")
              : props?.watch("course_title")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          paddingX: 2,
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={props?.watch("course_completion_percentage")}
            size={35}
            sx={{
              color: "white",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" component="div" color="white">
              {`${props?.watch("course_completion_percentage")}%`}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/courses");
            }}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              ":hover, :focus": {
                color: "#fff",
                borderColor: "#fff",
              },
            }}
          >
            {__('Dashboard', 'acadlix')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentHeader;
