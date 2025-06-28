import { Box } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import AddSection from "./sections/AddSection";
import ViewSection from "./sections/ViewSection";
import TestingViewSection from "./testing/TestingViewSection";
import { hasCapability } from "@acadlix/helpers/util";

const CourseBuilder = (props) => {
  const methods = useForm({
    defaultValues: {
      courseId: props?.course?.ID,
      post_status: props?.course?.post_status,
      post_author: props?.user_id,
      sections:
        props?.course?.sections?.length > 0
          ? props?.course?.sections?.map((s) => {
            return {
              id: s?.ID,
              post_title: s?.post_title,
              post_content: s?.post_content,
              show: false,
              open: false,
              menu_order: s?.menu_order,
              contents:
                s?.contents?.length > 0
                  ? s?.contents?.map((c) => {
                    return {
                      id: c?.ID,
                      sort: c?.menu_order,
                      preview: Boolean(Number(c?.rendered_metas?.preview)),
                      type: c?.contentable?.type,
                      title: c?.contentable?.title,
                      contentable_id: c?.contentable?.id,
                      course_section_id: c?.post_parent,
                    };
                  })
                  : [],
            };
          })
          : [],
    },
  });

  const colorCode = {
    modal_background: "#dddfe6",
    view_section_background: "#f8f8f8",
    view_section_border: "black",
  };

  return (
    <Box
      sx={{
        marginTop: 3,
      }}
    >
      <ViewSection {...methods} colorCode={colorCode} />
      {/* <TestingViewSection {...methods} colorCode={colorCode} /> */}
      {
        hasCapability("acadlix_add_course_section") &&
        <AddSection {...methods} colorCode={colorCode} />
      }
    </Box>
  );
};

export default CourseBuilder;
