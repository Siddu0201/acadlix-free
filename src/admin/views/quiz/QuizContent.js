import {
  Box,
  Grid,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import CategoryTemplateSection from "./sections/CategoryTemplateSection";
import TitleDescriptionSection from "./sections/TitleDescriptionSection";
import QuizModeSection from "./sections/QuizModeSection";
import QuizSettingSection from "./sections/QuizSettingSection";

const QuizContent = () => {
  const methods = useForm();
  const { reset } = methods;

  React.useEffect(() => {
    reset({
      id: null,
      category_id: null,
      load_template_id: null,
      title: "",
      description: "",
      // Mode settings 
      mode: "normal", // normal/check_and_continue/question_below_each_other/advance_mode
      enable_back_button: false,
      enable_check_button: false,
      enable_check_on_option_selected: false,
      question_per_page: 10, // 0 => all question
      advance_mode_type: "advance_panel", // advance_panel/ibps/ssc/gate/sbi/jee/railway 
      // General settings 
      hide_quiz_title: false,
      hide_restart_button: false,
      show_clear_response_button: false,
      quiz_timing_type: "full_quiz_time", // full_quiz_time/per_question_time 
      quiz_time: 0, // 0 => Infinity (no limit)
      pause_quiz: false,
      start_date: null, // null => indefinite
      end_date: null, // null => indefinite
      prerequisite: false,
      enable_login_register: false,
      login_register_type: "at_start_of_quiz", // at_start_of_quiz/at_finish_of_quiz 
      per_user_allowed_attempt: 0, // 0 => infinity
      save_statistic: false,
      save_statistic_number_of_times: 0, // 0 =>  infinity
      on_screen_calculator: false,
      quiz_certificate: false,
      show_only_specific_number_of_questions: false,
      specific_number_of_questions: 0, // 0 => all
      resume_unfinished_quiz: false,
      rate_quiz: false,
      quiz_feedback: false,
      proctoring: false,
      proctoring_max_number_of_time_allowed: 3, // min 1
      // Question settings
      show_marks: false,
      display_subject: false,
      skip_question: false,
      answer_bullet: false,
      answer_bullet_type: "numeric", // numeric/alphabet 
      random_question: false,
      random_option: false,
      do_not_randomize_last_option: false,
      question_overview: false,
      hide_question_numbering: false,
      sort_by_subject: false,
      attempt_and_move_forward: false,
      force_user_to_answer_each_question: false,
      // Result settings
      hide_result: false,
      hide_negative_marks: false,
      hide_quiz_time: false,
      show_speed: false,
      show_percentile: false,
      show_accuracy: false,
      show_rank: false,
      show_average_score: false,
      show_subject_wise_analysis: false,
      show_marks_distribution: false,
      show_status_based_on_min_percent: false,
      result_comparision_with_top_five_student: false,
      minimum_percent_to_pass: 0, // above 0 => pass
      hide_answer_sheet: false,
      show_per_question_time: false,
      was_the_solution_helpful: false,
      bookmark: false,
      report_question_answer: false,
      leaderboard: false,
      leaderboard_total_number_of_entries: 10, // 0 => all,
      leaderboard_user_can_apply_multiple_times: false,
      leaderboard_apply_multiple_number_of_times: 0, // 0 => infinite
      display_leaderboard_in_quiz_result: "do_not_display", // do_not_display/below_the_result/in_the_button
      percent_based_result_text: false,
      result_text: "", // ""/[{percent: number, text: ""}]
      // Notification settings
      admin_email_notification: false,
      admin_to: "",
      admin_from: "",
      admin_subject: "",
      admin_message: "",
      student_email_notification: false,
      student_to: "",
      student_from: "",
      student_subject: "",
      student_message: "",
      instructor_email_notification: false,
      instructor_to: "",
      instructor_from: "",
      instructor_subject: "",
      instructor_message: "",
    });
  }, [reset]);

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        plugins:
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv,listbuttons",
        toolbar2:
          "styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
        textarea_rows: 20,
        setup: function (editor) {
          editor.on("input change", function () {
            methods.setValue(name, window.wp.editor.getContent(key), { shouldDirty: true });
          });
        },
      },
      quicktags: true,
      mediaButtons: true,
    });
  };

  const removeEditor = (key) => {
    window.wp.editor.remove(key);
  };

  console.log(methods?.watch());

  return (
    <Box>
      <Grid
        container
        rowSpacing={3}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        {/* Top section containing category and template load */}
        <CategoryTemplateSection 
          {...methods}
        />

        {/* Second section contain title and Description */}
        <TitleDescriptionSection 
          {...methods}
          loadEditor={loadEditor} 
          removeEditor={removeEditor} 
        />

        {/* Third section contain quiz mode */}
        <QuizModeSection 
          {...methods}
        />

        {/* Fourth section contain quiz settings */}
        <QuizSettingSection 
          {...methods}
          loadEditor={loadEditor} 
          removeEditor={removeEditor} 
        />
      </Grid>
    </Box>
  );
};

export default QuizContent;
