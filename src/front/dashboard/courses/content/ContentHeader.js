import { Box, Button, IconButton, Typography } from "@mui/material";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "../../../../helpers/icons";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

const ContentHeader = (props) => {
  const total = props
    ?.watch("sections")
    ?.reduce((total, obj) => total + obj.content.length, 0);
  const completed = props
    ?.watch("sections")
    ?.reduce(
      (total, obj) =>
        total + obj.content.filter((c) => c?.is_completed)?.length,
      0
    );

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
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
              fontSize: 19,
              fontWeight: 600,
            }}
          >
            {props?.watch("course_title")}
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
            value={percent}
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
              {`${percent}%`}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            component={Link}
            to={"/courses"}
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              ":hover, :focus": {
                color: "#fff",
                borderColor: "#fff",
              },
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentHeader;
