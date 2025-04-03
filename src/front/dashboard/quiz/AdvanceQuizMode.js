import React from "react";
import AdvancePanel from "./advanceMode/AdvancePanel";
import Gate from "./advanceMode/Gate";
import Ibps from "./advanceMode/Ibps";
import Jee from "./advanceMode/Jee";
import Railway from "./advanceMode/Railway";
import Sbi from "./advanceMode/Sbi";
import Ssc from "./advanceMode/Ssc";
import Instruction1 from "./advanceMode/advance-instruction-section/Instruction1";
import Instruction2 from "./advanceMode/advance-instruction-section/Instruction2";
import AdvanceResultSection from "./advanceMode/advance-result-section/AdvanceResultSection";
import QuizError from "./QuizError";
import NtaInstruction from "./advanceMode/nta/instruction/NtaInstruction";
import { useMediaQuery, useTheme } from "@mui/material";
import { __ } from "@wordpress/i18n";

const AdvanceQuizMode = (props) => {
  const colorCode = {
    background: "#fff",
    // logo and title
    logo_and_title_background: "#ffffff",
    top_title_color: "#050650",
    // title and instruction
    title_and_instruction_background: "#363636",
    second_title_color: "#f0d63d",
    instruction_color: "#fff",
    info_icon_background: "#5bb1fa",
    info_icon: "#fff",
    instruction_next_button_color: "#333",
    instruction_next_button_border: "#ccc",
    instruction_next_button_background: "#fff",
    instruction_next_button_hover_border: "#adadad",
    instruction_next_button_hover_background: "#e6e6e6",
    instruction_previous_button_color: "#333",
    instruction_previous_button_border: "#ccc",
    instruction_previous_button_background: "#fff",
    instruction_previous_button_hover_border: "#adadad",
    instruction_previous_button_hover_background: "#e6e6e6",
    // section
    section_background: "#eeeeee",
    top_subject_button_active_background: "#38a9eb",
    top_subject_button_active_border: "#38a9eb",
    top_subject_button_active_color: "#ffffff",
    top_subject_button_background: "#ffffff",
    top_subject_button_border: "#474747",
    top_subject_button_color: "#474747",
    //timer
    timer_background: "#ffffff",
    // Subsection
    subsection_background: "#ffffff",
    subsection_border: "#ebebea",
    subsection_button_active_background: "#4e85c5",
    subsection_button_active_color: "#ffffff",
    subsection_button_background: "#ffffff",
    subsection_button_color: "#5bb1fa",
    subsection_button_border: "#ebebea",
    // Question type and marks
    question_type_background: "#ffffff",
    // Language
    language_background: "#4e85c5",
    langauge_text_color: "#ffffff",
    language_dropdown_background: "#fff",
    language_dropdown_color: "#3c4447",
    // Marks
    points_background: "#56AB2F",
    points_color: "#ffffff",
    negative_points_background: "#FF6B6B",
    negative_points_color: "#ffffff",
    // Question Number
    question_number_background: "#ffffff",
    quesiton_number_border_bottom: "#f9f9f9",
    //Question
    question_border: "#dddddd",
    question_background: "#ffffff",
    // Button Options
    button_option_background: "#ffffff",
    button_option_border: "#dddddd",
    mark_for_review_and_next_border: "#dededd",
    mark_for_review_and_next_background: "#ffffff",
    mark_for_review_and_next_color: "black",
    mark_for_review_and_next_hover_border: "black",
    mark_for_review_and_next_hover_background: "#0c7cd5",
    mark_for_review_and_next_hover_color: "#ffffff",
    clear_response_border: "#dededd",
    clear_response_background: "#ffffff",
    clear_response_color: "black",
    clear_response_hover_border: "black",
    clear_response_hover_background: "#0c7cd5",
    clear_response_hover_color: "#ffffff",
    previous_response_border: "#dededd",
    previous_response_background: "#ffffff",
    previous_response_color: "black",
    previous_response_hover_border: "black",
    previous_response_hover_background: "#0c7cd5",
    previous_response_hover_color: "#ffffff",
    save_and_next_border: "#dededd",
    save_and_next_background: "#0c7cd5",
    save_and_next_color: "#ffffff",
    save_and_next_hover_border: "black",
    //Sidebar User
    user_background: "#f8fbff",
    user_image_background: "#ffffff",
    user_image_border: "#cacac8",
    //Sidebar Status types
    sidebar_status_background: "#ffffff",
    answered_background: "#7bc021",
    not_answered_background: "#dd4107",
    not_visited_background1: "#f0f0f0",
    not_visited_background2: "#bebdba",
    not_visited_border: "#8e8e8e",
    not_visited_color: "#474747",
    marked_for_review_background: "#674787",
    marked_for_review_color: "#ffffff",
    answered_and_marked_for_review_background: "#674787",
    // Sidebar section
    sidebar_section_background: "#4e85c5",
    sidebar_section_color: "#ffffff",
    // Sidebar Overview
    sidebar_overview_background: "#e5f6fd",
    // Sidebar Submit
    submit_background: "#e5f6fd",
    submit_button_background: "#0c7cd5",
    submit_button_border: "#0c7cd5",
    submit_button_disabled_background: "#74c5f0",
    submit_button_color: "#ffffff",
    submit_button_hover_border: "black",
    up_and_down_arrow_background: "#2980b9",
    //Popover
    popover_background: "#e5f6fd",
    popover_border: "grey",
    //Result
    correct: "#56AB2F",
    incorrect: "#FF6B6B",
    skipped: "#8f83f7",
    overview_border: "#C3D1A3",
    overview_background: "#f8faf5",
    overview_button_border: "#CFCFCF",
    overview_button_background: "#fff",
    overview_button_text: "black",
    overview_button_active_text: "white",
    overview_button_active_border: "#7DB1D3",
  };

  const ntaColorCode = {
    background: "#fff",
    instruction_general_instruction: "#012B55",
    instruction_button_color: "#fff",
    instruction_button_border: "#4cae4c",
    instruction_button_background: "#5cb85c",
    instruction_button_hover_border: "#398439",
    instruction_button_hover_background: "#449d44",
    // Top home
    top_home_background: "#286090",
    top_home_icon_color: "#ffffff",
    top_home_icon_background: "#00a651",
    top_home_text_color: "#ffffff",
    //Logo
    logo_background: "#fff",
    // User
    user_background: "#f3f3f3",
    user_icon_color: "#555555",
    user_data_color: "#f7931e",
    timer_chip_background: "#0098DA",
    timer_chip_color: "#ffffff",
    // Language
    language_background: "#4e85c5",
    langauge_text_color: "#ffffff",
    language_dropdown_background: "#fff",
    language_dropdown_color: "#3c4447",
    // Subsection
    subsection_background: "#ffffff",
    subsection_border: "#ebebea",
    subsection_button_active_background: "#4e85c5",
    subsection_button_active_color: "#ffffff",
    subsection_button_background: "#ffffff",
    subsection_button_color: "#5bb1fa",
    subsection_button_border: "#ebebea",
    //Sidebar
    sidebar_background: "#fff",
    //Sidebar Status types
    sidebar_status_background: "#fff",
    answered_background: "#2cc100",
    not_answered_background: "#e84500",
    not_visited_background1: "#f0f0f0",
    not_visited_background2: "#bebdba",
    not_visited_border: "#8e8e8e",
    not_visited_color: "#474747",
    marked_for_review_background: "#674787",
    marked_for_review_color: "#ffffff",
    answered_and_marked_for_review_background: "#674787",
    sidebar_overview_background: "#fff",
    // Question
    border_top_bottom: "#808080",
    icon_color: "#0054ff",
    // Button options
    border_top: "#808080",
    save_next_button_background: "#5cb85c",
    save_next_button_border: "#4cae4c",
    save_next_button_hover_background: "#449d44",
    save_next_button_hover_border: "#398439",
    save_next_button_color: "#fff",
    clear_back_color: "#333",
    clear_back_background: "#fff",
    clear_back_border: "#ccc",
    clear_back_hover_background: "#e6e6e6",
    clear_back_hover_border: "#adadad",
    save_review_button_background: "#f0ad4e",
    save_review_button_border: "#eea236",
    save_review_button_hover_background: "#ec971f",
    save_review_button_hover_border: "#d58512",
    save_review_button_color: "#fff",
    review_next_button_background: "#337ab7",
    review_next_button_border: "#2e6da4",
    review_next_button_hover_background: "#286090",
    review_next_button_hover_border: "#204d74",
    review_next_button_color: "#fff",
    // Submit button options
    submit_top_border: "#ddd",
    submit_background: "#f5f5f5",
    submit_button_background: "#5cb85c",
    submit_button_border: "#4cae4c",
    submit_button_hover_background: "#449d44",
    submit_button_hover_border: "#398439",
    submit_button_color: "#fff",
    next_back_color: "#333",
    next_back_background: "#fff",
    next_back_border: "#ccc",
    next_back_hover_background: "#e6e6e6",
    next_back_hover_border: "#adadad",
    // Final
    final_button_color: "#333",
    final_button_border: "#ccc",
    final_button_background: "#fff",
    final_button_hover_border: "#adadad",
    final_button_hover_background: "#e6e6e6",
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isOpen, setIsOpen] = React.useState(isMobile ? false : true);
  const [instructionIsOpen, setInstructionIsOpen] = React.useState(isMobile ? false : true);
  const sidebarWidth = 250;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const checkAdvanceMode = () => {
    switch (props?.watch("advance_mode_type")) {
      case "advance_panel":
        return (
          <AdvancePanel
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      case "gate":
        return (
          <Gate
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      case "ibps":
        return (
          <Ibps
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      case "jee":
        return (
          <Jee
            {...props}
            colorCode={ntaColorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      case "railway":
        return (
          <Railway
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      case "sbi":
        return (
          <Sbi
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      case "ssc":
        return (
          <Ssc
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
      default:
        return (
          <AdvancePanel
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />
        );
    }
  };

  const checkInstructionAdvanceMode = () => {
    switch (props?.watch("advance_mode_type")) {
      case "advance_panel":
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      case "gate":
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      case "ibps":
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      case "jee":
        return (
          <NtaInstruction
            {...props}
            colorCode={ntaColorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      case "railway":
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      case "sbi":
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      case "ssc":
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
      default:
        return (
          <Instruction1
            {...props}
            colorCode={colorCode}
            sidebarWidth={sidebarWidth}
            instructionIsOpen={instructionIsOpen}
          />
        );
    }
  };

  if (props?.watch("user_id") == 0) {
    return (
      <QuizError
        code="401"
        message={__('You are not allowed to access this page.', 'acadlix')}
      />
    );
  }

  return (
    <>
      {props?.watch("view_instruction1") && checkInstructionAdvanceMode()}
      {props?.watch("view_instruction2") && (
        <Instruction2
          {...props}
          colorCode={colorCode}
          sidebarWidth={sidebarWidth}
          instructionIsOpen={instructionIsOpen}
        />
      )}
      {props?.watch("view_question") && checkAdvanceMode()}
      {props?.watch("view_result") && (
        <AdvanceResultSection {...props} colorCode={colorCode} />
      )}
    </>
  );
};

export default AdvanceQuizMode;
