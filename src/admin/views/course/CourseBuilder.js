import { Box } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import AddSection from "./sections/AddSection";
import ViewSection from "./sections/ViewSection";

const CourseBuilder = (props) => {
  const methods = useForm({
    defaultValues: {
      id: props?.course?.ID,
      post_status: props?.course?.post_status,
      logged_in_user_id: props?.logged_in_user_id,
      sections:
        props?.course_setting?.sections?.length > 0
          ? props?.course_setting?.sections?.map((s) => {
            return {
              id: s?.id,
              title: s?.title,
              description: s?.description,
              show: false,
              open: false,
              sort: s?.sort,
              contents:
                s?.contents?.length > 0
                  ? s?.contents?.map((c) => {
                    return {
                      id: c?.id,
                      sort: c?.sort,
                      preview: Boolean(Number(c?.preview)),
                      type:
                        c?.contentable_type ===
                          `Yuvayana\\Acadlix\\Models\\Quiz`
                          ? "quiz"
                          : "lesson",
                      title: c?.contentable?.title,
                      contentable_id: c?.contentable_id,
                      course_section_id: c?.course_section_id,
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
      <AddSection {...methods} colorCode={colorCode} />
    </Box>
  );
};

export default CourseBuilder;
