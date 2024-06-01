import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import CategoryTemplateSection from "./sections/CategoryTemplateSection";
import TitleDescriptionSection from "./sections/TitleDescriptionSection";
import QuizModeSection from "./sections/QuizModeSection";
import QuizSettingSection from "./sections/QuizSettingSection";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import { PostCreateQuiz, UpdateQuizById } from "../../../requests/admin/AdminQuizRequest";

const QuizContent = (props) => {
  const methods = useForm({
    defaultValues: {
      id: null,
      quiz_section: "1",
      category_id: props?.quiz?.category_id ?? null,
      load_template_id: null,
      title: props?.quiz?.title ?? "",
      description: props?.quiz?.description ?? "",
      // Mode settings
      mode: props?.quiz?.mode ?? "normal", // normal/check_and_continue/question_below_each_other/advance_mode
      enable_back_button: Boolean(props?.quiz?.enable_back_button) ?? false,
      enable_check_button: Boolean(props?.quiz?.enable_check_button) ?? false,
      enable_check_on_option_selected:
        Boolean(props?.quiz?.enable_check_on_option_selected) ?? false,
      question_per_page: props?.quiz?.question_per_page ?? 10, // 0 => all question
      advance_mode_type: props?.quiz?.advance_mode_type ?? "advance_panel", // advance_panel/ibps/ssc/gate/sbi/jee/railway
      // General settings
      hide_quiz_title: Boolean(props?.quiz?.hide_quiz_title) ?? false,
      hide_restart_button: Boolean(props?.quiz?.hide_restart_button) ?? false,
      show_clear_response_button:
        Boolean(props?.quiz?.show_clear_response_button) ?? false,
      quiz_timing_type: props?.quiz?.quiz_timing_type ?? "full_quiz_time", // full_quiz_time/per_question_time
      quiz_time: props?.quiz?.quiz_time ?? 0, // 0 => Infinity (no limit)
      pause_quiz: Boolean(props?.quiz?.pause_quiz) ?? false,
      set_start_date: Boolean(props?.quiz?.set_start_date) ?? false,
      start_date: props?.quiz?.start_date ?? null, // null => indefinite
      set_end_date: Boolean(props?.quiz?.set_end_date) ?? false,
      end_date: props?.quiz?.end_date ?? null, // null => indefinite
      prerequisite: Boolean(props?.quiz?.prerequisite) ?? false,
      prerequisite_data: [],
      enable_login_register:
        Boolean(props?.quiz?.enable_login_register) ?? false,
      login_register_type:
        props?.quiz?.login_register_type ?? "at_start_of_quiz", // at_start_of_quiz/at_finish_of_quiz
      per_user_allowed_attempt: props?.quiz?.per_user_allowed_attempt ?? 0, // 0 => infinity
      save_statistic: Boolean(props?.quiz?.save_statistic) ?? false,
      save_statistic_number_of_times:
        props?.quiz?.save_statistic_number_of_times ?? 0, // 0 =>  infinity
      on_screen_calculator: Boolean(props?.quiz?.on_screen_calculator) ?? false,
      quiz_certificate: Boolean(props?.quiz?.quiz_certificate) ?? false,
      resume_unfinished_quiz:
        Boolean(props?.quiz?.resume_unfinished_quiz) ?? false,
      show_only_specific_number_of_questions:
        Boolean(props?.quiz?.show_only_specific_number_of_questions) ?? false,
      specific_number_of_questions:
        props?.quiz?.specific_number_of_questions ?? 0, // 0 => all
      rate_quiz: Boolean(props?.quiz?.rate_quiz) ?? false,
      quiz_feedback: Boolean(props?.quiz?.quiz_feedback) ?? false,
      proctoring: Boolean(props?.quiz?.proctoring) ?? false,
      proctoring_max_number_of_time_allowed:
        props?.quiz?.proctoring_max_number_of_time_allowed ?? 3, // min 1
      // Question settings
      show_marks: Boolean(props?.quiz?.show_marks) ?? false,
      display_subject: Boolean(props?.quiz?.display_subject) ?? false,
      skip_question: Boolean(props?.quiz?.skip_question) ?? false,
      answer_bullet: Boolean(props?.quiz?.answer_bullet) ?? false,
      answer_bullet_type: props?.quiz?.answer_bullet_type ?? "numeric", // numeric/alphabet
      random_question: Boolean(props?.quiz?.random_question) ?? false,
      random_option: Boolean(props?.quiz?.random_option) ?? false,
      do_not_randomize_last_option:
        Boolean(props?.quiz?.do_not_randomize_last_option) ?? false,
      question_overview: Boolean(props?.quiz?.question_overview) ?? false,
      hide_question_numbering: Boolean(props?.quiz?.hide_question_numbering) ?? false,
      sort_by_subject: Boolean(props?.quiz?.sort_by_subject) ?? false,
      attempt_and_move_forward:
        Boolean(props?.quiz?.attempt_and_move_forward) ?? false,
      force_user_to_answer_each_question:
        Boolean(props?.quiz?.force_user_to_answer_each_question) ?? false,
      // Result settings
      hide_result: Boolean(props?.quiz?.hide_result) ?? false,
      hide_negative_marks: Boolean(props?.quiz?.hide_negative_marks) ?? false,
      hide_quiz_time: Boolean(props?.quiz?.hide_quiz_time) ?? false,
      show_speed: Boolean(props?.quiz?.show_speed) ?? false,
      show_percentile: Boolean(props?.quiz?.show_percentile) ?? false,
      show_accuracy: Boolean(props?.quiz?.show_accuracy) ?? false,
      show_rank: Boolean(props?.quiz?.show_rank) ?? false,
      show_average_score: Boolean(props?.quiz?.show_average_score) ?? false,
      show_subject_wise_analysis:
        Boolean(props?.quiz?.show_subject_wise_analysis) ?? false,
      show_marks_distribution:
        Boolean(props?.quiz?.show_marks_distribution) ?? false,
      show_status_based_on_min_percent:
        Boolean(props?.quiz?.show_status_based_on_min_percent) ?? false,
      minimum_percent_to_pass: props?.quiz?.minimum_percent_to_pass ?? 0, // above 0 => pass
      result_comparision_with_top_five_student:
        Boolean(props?.quiz?.result_comparision_with_top_five_student) ?? false,
      hide_answer_sheet: Boolean(props?.quiz?.hide_answer_sheet) ?? false,
      show_per_question_time:
        Boolean(props?.quiz?.show_per_question_time) ?? false,
      was_the_solution_helpful:
        Boolean(props?.quiz?.was_the_solution_helpful) ?? false,
      bookmark: Boolean(props?.quiz?.bookmark) ?? false,
      report_question_answer:
        Boolean(props?.quiz?.report_question_answer) ?? false,
      leaderboard: Boolean(props?.quiz?.leaderboard) ?? false,
      leaderboard_total_number_of_entries:
        props?.quiz?.leaderboard_total_number_of_entries ?? 10, // 0 => all,
      leaderboard_user_can_apply_multiple_times:
        props?.quiz?.leaderboard_user_can_apply_multiple_times ?? false,
      leaderboard_apply_multiple_number_of_times:
        Boolean(props?.quiz?.leaderboard_apply_multiple_number_of_times) ?? 0, // 0 => infinite
      display_leaderboard_in_quiz_result:
        props?.quiz?.display_leaderboard_in_quiz_result ?? "do_not_display", // do_not_display/below_the_result/in_the_button
      percent_based_result_text:
        Boolean(props?.quiz?.percent_based_result_text) ?? false,
      result_text: props?.quiz?.result_text ?? "", // ""/[{percent: number, text: ""}]
      // Notification settings
      admin_email_notification:
        Boolean(props?.quiz?.admin_email_notification) ?? false,
      admin_to: props?.quiz?.admin_to ?? "",
      admin_from: props?.quiz?.admin_from ?? "",
      admin_subject: props?.quiz?.admin_subject ?? "",
      admin_message: props?.quiz?.admin_message ?? "",
      student_email_notification:
        Boolean(props?.quiz?.student_email_notification) ?? false,
      student_to: props?.quiz?.student_to ?? "",
      student_from: props?.quiz?.student_from ?? "",
      student_subject: props?.quiz?.student_subject ?? "",
      student_message: props?.quiz?.student_message ?? "",
      instructor_email_notification:
        Boolean(props?.quiz?.instructor_email_notification) ?? false,
      instructor_to: props?.quiz?.instructor_to ?? "",
      instructor_from: props?.quiz?.instructor_from ?? "",
      instructor_subject: props?.quiz?.instructor_subject ?? "",
      instructor_message: props?.quiz?.instructor_message ?? "",
      // Language settings
      multi_language: Boolean(props?.quiz?.multi_language) ?? false,
      language_data: props?.create ? 
        props?.languages?.filter(val => val?.default)?.map((val) => {
            let newData = {};
            newData['language_id'] = val?.id;
            newData['language_name'] = val?.language_name;
            newData['default'] = Boolean(val?.default);
            return newData;
        })
      :
        props?.quiz?.quiz_languages?.map((val) => {
          let newData= {};
          newData['language_id'] = val?.language_id;
          newData['language_name'] = val?.language?.language_name;
          newData['default'] = Boolean(val?.default);
          return newData;
        })
      , // [{language_id: 1, language_name: "", default: false}]
      // Instruction settings
      instruction1: props?.quiz?.instruction1 ?? "",
      instruction2: props?.quiz?.instruction2 ?? "",
    },
  });
    // console.log(props?.quiz);
    // console.log(methods?.watch());

  const navigate = useNavigate();  
  const createMutation = PostCreateQuiz();
  const updateMutation = UpdateQuizById(props?.quiz_id);
  const onSubmit = (data) => {
    if(props?.create){
      createMutation.mutate(data, {
        onSuccess: (data) => {
          navigate('/quiz');
        }
      });
    }else{
      updateMutation.mutate(data, {
        onSuccess: (data) => {
          navigate('/quiz');
        }
      });
    }
  }

  // console.log(methods);

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
            methods.setValue(name, window.wp.editor.getContent(key), {
              shouldDirty: true,
            });
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

  return (
    <Box>
      <form onSubmit={methods?.handleSubmit(onSubmit)}>
      <Grid
        container
        rowSpacing={3}
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        <Grid item xs={12} sm={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<TiArrowLeftThick />}
              size="medium"
              sx={{
                width: "fit-content",
              }}
              LinkComponent={Link}
              to="/quiz"
            >
              Back
            </Button>
            <Typography variant="h6">
              {props?.create ? "Create Quiz" : "Edit Quiz"}
            </Typography>
          </Box>
        </Grid>
        {/* Top section containing category and template load */}
        <CategoryTemplateSection {...methods} {...props} />

        {/* Second section contain title and Description */}
        <TitleDescriptionSection
          {...methods}
          loadEditor={loadEditor}
          removeEditor={removeEditor}
        />

        {/* Third section contain quiz mode */}
        <QuizModeSection {...methods} {...props} />

        {/* Fourth section contain quiz settings */}
        <QuizSettingSection
          {...methods}
          {...props}
          loadEditor={loadEditor}
          removeEditor={removeEditor}
        />

        <Grid item xs={12} sm={12}>
          <Box>
            <Button
              variant="contained"
              size="medium"
              type="submit"
            >
              Save Change
            </Button>
          </Box>
        </Grid>
      </Grid>
      </form>
    </Box>
  );
};

export default QuizContent;
