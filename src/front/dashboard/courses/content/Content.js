import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import parse from "html-react-parser";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AppFront from "../../../AppFront";

const Content = (props) => {
  const navigate = useNavigate();
  const content = props
    ?.watch("sections")
    ?.find((s) => s?.active)
    ?.content?.find((c) => c?.id == props?.courseSectionContentId);

  return (
    <>
      {props?.watch("sections")?.length > 0 &&
        props?.watch("sections")?.map((element, index, arr) =>
          element?.content?.map((c, c_index, c_arr) => (
            <React.Fragment key={c_index}>
              <Box
                sx={{
                  display: content?.i - 1 === c?.i ? "" : "none",
                  position: "absolute",
                  top: "50%",
                  left: 0,
                }}
              >
                <Tooltip title={c?.title} placement="right" arrow>
                  <IconButton
                    onClick={props?.handleNavigate.bind(this, c?.id)}
                    sx={{
                      borderRadius: 0,
                      paddingX: 1,
                      paddingY: 3,
                      color: "white",
                      backgroundColor: "black",
                      opacity: "0.2",
                      ":hover, :focus": {
                        color: "white",
                        backgroundColor: "black",
                        opacity: "1",
                      },
                    }}
                  >
                    <FaAngleLeft />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: content?.i + 1 === c?.i ? "" : "none",
                  position: "absolute",
                  top: "50%",
                  right: 0,
                }}
              >
                <Tooltip title={c?.title} placement="left" arrow>
                  <IconButton
                    onClick={props?.handleNavigate.bind(this, c?.id)}
                    sx={{
                      borderRadius: 0,
                      paddingX: 1,
                      paddingY: 3,
                      color: "white",
                      backgroundColor: "black",
                      opacity: "0.2",
                      opacity: "0.2",
                      ":hover, :focus": {
                        color: "white",
                        backgroundColor: "black",
                        opacity: "1",
                      },
                    }}
                  >
                    <FaAngleRight />
                  </IconButton>
                </Tooltip>
              </Box>
            </React.Fragment>
          ))
        )}
      <Box
        sx={{
          paddingX: {
            xs: 1,
            sm: 20,
          },
          paddingY: 2,
          height: "100%",
        }}
      >
        {content?.type === "lesson" ? (
          parse(content?.content)
        ) : (
          <AppFront
            quiz_id={content?.content_type_id}
            start={false}
            advance={false}
          />
        )}
      </Box>
    </>
  );
};

export default Content;
