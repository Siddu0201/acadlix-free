import { Alert, Box } from "@mui/material";
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

const AdvanceQuizMode = (props) => {
  const colorCode = {
    // logo and title
    logo_and_title_background: "#ffffff",
    top_title_color: "#050650",
    // title and instruction
    title_and_instruction_background: "#363636",
    second_title_color: "#f0d63d",
    instruction_color: "#fff",
    info_icon_background: "#5bb1fa",
    info_icon: "#fff",
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

  const [isOpen, setIsOpen] = React.useState(true);
  const [instructionIsOpen, setInstructionIsOpen] = React.useState(true);
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
            colorCode={colorCode}
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
  const current_date = new Date();
  const ExpireDate = () => <Alert severity="error">Quiz has expired</Alert>;
  const NonLoggedIn = () => <Alert severity="error">You are not allowed to access this page</Alert>;

  if (
    props?.watch("set_start_date") &&
    current_date < props?.watch("start_date")
  ) {
    return <NotStarted {...props} />;
  }

  if (props?.watch("set_end_date") && current_date > props?.watch("end_date")) {
    return <ExpireDate />;
  }

  if(props?.watch("user_id") == 0){
    return <NonLoggedIn />;
  }

  return (
    <>
      {props?.watch("view_instruction1") && (
        <Instruction1
          {...props}
          colorCode={colorCode}
          sidebarWidth={sidebarWidth}
          instructionIsOpen={instructionIsOpen}
        />
      )}
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

const NotStarted = (props) => {
  return (
    <Alert severity="error">{`Quiz will start on ${props?.watch(
      "start_date"
    )} `}</Alert>
  );
};

export default AdvanceQuizMode;
