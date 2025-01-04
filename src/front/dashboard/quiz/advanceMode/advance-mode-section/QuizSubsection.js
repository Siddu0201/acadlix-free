import React from "react";
import { Box, IconButton } from "@mui/material";
import { FaCaretLeft, FaCaretRight } from "../../../../../helpers/icons";
import SubsectionButton from "../advance-mode-component/SubsectionButton";

const QuizSubsection = (props) => {

  return (
    <Box
      id="acadlix_quiz_subsection"
      sx={{
        flex: 0,
        display: "flex",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: props?.colorCode?.subsection_border,
        backgroundColor: props?.colorCode?.subsection_background,
      }}
    >
      <Box>
        <IconButton
          size="small"
          disabled
          sx={{
            marginBottom: "0px !important",
          }}
        >
          <FaCaretLeft />
        </IconButton>
      </Box>
      {props?.watch("subjects")?.length > 0 &&
        props
          ?.watch("subjects")
          ?.map((s, s_index) => (
            <SubsectionButton
              key={s_index}
              s_index={s_index}
              active={s?.selected}
              {...props}
              {...s}
            />
          ))}
      <Box
        sx={{
          marginLeft: "auto",
        }}
      >
        <IconButton
          size="small"
          disabled
          sx={{
            marginBottom: "0px !important",
          }}
        >
          <FaCaretRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default QuizSubsection;
