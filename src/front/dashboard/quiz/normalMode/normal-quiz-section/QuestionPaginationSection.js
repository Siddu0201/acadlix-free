import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import React from "react";

const QuestionPaginationSection = (props) => {
  const handlePaginationChange = (_, page) => {
    let perPage = props?.watch("question_per_page");
    props?.setValue(
      "questions",
      props.watch("questions")?.map((question, index) => {
        if (index >= (page - 1) * perPage && index < page * perPage) {
          question.selected = true;
        } else {
          question.selected = false;
        }
        return question;
      }),
      { shouldDirty: true }
    );
    props?.setValue("pagination_page", page, {shouldDirty: true});

    props?.scrollToQuestion((page - 1) * perPage);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Pagination
        count={Math.ceil(
          props?.watch("questions")?.length / props?.watch("question_per_page")
        )}
        page={props?.watch("pagination_page")}
        onChange={handlePaginationChange}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: () => <Typography>Previous</Typography>,
              next: () => <Typography>Next</Typography>,
            }}
            {...item}
          />
        )}
        sx={{
          '& .MuiPaginationItem-root:hover,.MuiPaginationItem-root:focus':{
            color: "rgba(0, 0, 0, 0.87)"
          },
        }}
      />
    </Box>
  );
};

export default QuestionPaginationSection;
