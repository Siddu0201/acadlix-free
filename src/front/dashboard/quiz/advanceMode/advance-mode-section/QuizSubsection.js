import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { FaCaretLeft, FaCaretRight } from "../../../../../helpers/icons";
import SubsectionButton from "../advance-mode-component/SubsectionButton";

const QuizSubsection = (props) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollStep = 50; // Amount to scroll

  const updateArrowStates = () => {
    const scrollContainer = props?.scrollContainerRef.current;
    if (scrollContainer) {
      setCanScrollLeft(scrollContainer.scrollLeft > 0);
      setCanScrollRight(
        scrollContainer.scrollLeft + scrollContainer.offsetWidth <
        scrollContainer.scrollWidth
      );
    }
  };

  const handleScrollLeft = () => {
    const scrollContainer = props?.scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: -scrollStep,
        behavior: "smooth",
      });
    }
  };

  // Scroll right
  const handleScrollRight = () => {
    const scrollContainer = props?.scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: scrollStep,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      id="acadlix_quiz_subsection"
      sx={{
        flex: 0,
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: props?.colorCode?.subsection_border,
        backgroundColor: props?.colorCode?.subsection_background,
      }}
    >
      <Box>
        <IconButton
          size="small"
          sx={{
            marginBottom: "0px !important",
          }}
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
        >
          <FaCaretLeft />
        </IconButton>
      </Box>
      <Box
        ref={props?.scrollContainerRef}
        onScroll={updateArrowStates}
        sx={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          width: "100%",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
        }}>
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
      </Box>
      <Box
        sx={{
          marginLeft: "auto",
        }}
      >
        <IconButton
          size="small"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
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
