import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import CategoryTemplateSection from "./sections/CategoryTemplateSection";
import TitleDescriptionSection from "./sections/TitleDescriptionSection";
import QuizModeSection from "./sections/QuizModeSection";
import QuizSettingSection from "./sections/QuizSettingSection";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import {
  PostCreateQuiz,
  UpdateQuizById,
} from "../../../requests/admin/AdminQuizRequest";
import SaveTemplateSection from "./sections/SaveTemplateSection";

const QuizContent = (props) => {
  const methods = useForm({
    defaultValues: {
      id: null,
      quiz_section: "1",
      category_id: props?.quiz?.category_id ?? null,
      templates: props?.templates ?? [],
      load_template_id: null,
      title: props?.quiz?.title ?? "",
      description: props?.quiz?.description ?? "",
      // Mode settings
      mode: props?.quiz?.mode ?? "normal", // normal/check_and_continue/question_below_each_other/advance_mode
      enable_back_button: Boolean(Number(props?.quiz?.enable_back_button)),
      enable_check_on_option_selected: Boolean(
        Number(props?.quiz?.enable_check_on_option_selected)
      ),
      skip_question: Boolean(Number(props?.quiz?.skip_question)),
      question_per_page: props?.quiz?.question_per_page ?? 10, // 0 => all question
      advance_mode_type: props?.quiz?.advance_mode_type ?? "advance_panel", // advance_panel/ibps/ssc/gate/sbi/jee/railway
      // General settings
      hide_quiz_title: Boolean(Number(props?.quiz?.hide_quiz_title)),
      hide_restart_button: Boolean(Number(props?.quiz?.hide_restart_button)),
      show_clear_response_button: Boolean(
        Number(props?.quiz?.show_clear_response_button)
      ),
      enable_check_button: Boolean(Number(props?.quiz?.enable_check_button)),
      quiz_timing_type: props?.quiz?.quiz_timing_type ?? "full_quiz_time", // full_quiz_time/per_question_time
      quiz_time: props?.quiz?.quiz_time ?? 0, // 0 => Infinity (no limit)
      pause_quiz: Boolean(Number(props?.quiz?.pause_quiz)),
      set_start_date: Boolean(Number(props?.quiz?.set_start_date)),
      start_date: props?.quiz?.start_date ?? null, // null => indefinite
      set_end_date: Boolean(Number(props?.quiz?.set_end_date)),
      end_date: props?.quiz?.end_date ?? null, // null => indefinite
      prerequisite: Boolean(Number(props?.quiz?.prerequisite)),
      non_prerequisite_quiz: props?.non_prerquisites
        ? props?.non_prerquisites?.map((d) => {
            return {
              id: d?.id,
              title: d?.title,
              show: props?.quiz?.prerequisites?.find(
                (p) => p?.prerequisite_quiz_id === d?.id
              )
                ? false
                : true,
            };
          })
        : [],
      prerequisite_data: props?.quiz?.prerequisites
        ? props?.quiz?.prerequisites?.map((d) => {
            return {
              prerequisite_quiz_id: d?.prerequisite_quiz_id,
              min_percentage: d?.min_percentage,
            };
          })
        : [],
      enable_login_register: Boolean(
        Number(props?.quiz?.enable_login_register)
      ),
      login_register_type:
        props?.quiz?.login_register_type ?? "at_start_of_quiz", // at_start_of_quiz/at_finish_of_quiz
      per_user_allowed_attempt: props?.quiz?.per_user_allowed_attempt ?? 0, // 0 => infinity
      save_statistic: Boolean(Number(props?.quiz?.save_statistic)) ?? 0,
      statistic_ip_lock: props?.quiz?.statistic_ip_lock ? Number(props?.quiz?.statistic_ip_lock) : 0,
      save_statistic_number_of_times:
        props?.quiz?.save_statistic_number_of_times ?? 0, // 0 =>  infinity
      on_screen_calculator: Boolean(Number(props?.quiz?.on_screen_calculator)),
      quiz_certificate: Boolean(Number(props?.quiz?.quiz_certificate)),
      resume_unfinished_quiz: Boolean(
        Number(props?.quiz?.resume_unfinished_quiz)
      ),
      show_only_specific_number_of_questions: Boolean(
        Number(props?.quiz?.show_only_specific_number_of_questions)
      ),
      specific_number_of_questions:
        props?.quiz?.specific_number_of_questions ?? 0, // 0 => all
      rate_quiz: Boolean(Number(props?.quiz?.rate_quiz)),
      quiz_feedback: Boolean(Number(props?.quiz?.quiz_feedback)),
      proctoring: Boolean(Number(props?.quiz?.proctoring)),
      proctoring_max_number_of_time_allowed:
        props?.quiz?.proctoring_max_number_of_time_allowed ?? 3, // min 1
      // Question settings
      show_marks: Boolean(Number(props?.quiz?.show_marks)),
      display_subject: Boolean(Number(props?.quiz?.display_subject)),
      answer_bullet: Boolean(Number(props?.quiz?.answer_bullet)),
      answer_bullet_type: props?.quiz?.answer_bullet_type ?? "numeric", // numeric/alphabet
      random_question: Boolean(Number(props?.quiz?.random_question)),
      random_option: Boolean(Number(props?.quiz?.random_option)),
      do_not_randomize_last_option: Boolean(
        Number(props?.quiz?.do_not_randomize_last_option)
      ),
      question_overview: Boolean(Number(props?.quiz?.question_overview)),
      hide_question_numbering: Boolean(
        Number(props?.quiz?.hide_question_numbering)
      ),
      sort_by_subject: Boolean(Number(props?.quiz?.sort_by_subject)),
      attempt_and_move_forward: Boolean(
        Number(props?.quiz?.attempt_and_move_forward)
      ),
      force_user_to_answer_each_question: Boolean(
        Number(props?.quiz?.force_user_to_answer_each_question)
      ),
      // Result settings
      hide_result: Boolean(Number(props?.quiz?.hide_result)),
      hide_negative_marks: Boolean(Number(props?.quiz?.hide_negative_marks)),
      hide_quiz_time: Boolean(Number(props?.quiz?.hide_quiz_time)),
      show_speed: Boolean(Number(props?.quiz?.show_speed)),
      show_percentile: Boolean(Number(props?.quiz?.show_percentile)),
      show_accuracy: Boolean(Number(props?.quiz?.show_accuracy)),
      show_average_score: Boolean(Number(props?.quiz?.show_average_score)),
      show_subject_wise_analysis: Boolean(
        Number(props?.quiz?.show_subject_wise_analysis)
      ),
      show_marks_distribution: Boolean(
        Number(props?.quiz?.show_marks_distribution)
      ),
      show_status_based_on_min_percent: Boolean(
        Number(props?.quiz?.show_status_based_on_min_percent)
      ),
      minimum_percent_to_pass: props?.quiz?.minimum_percent_to_pass ?? 0, // above 0 => pass
      hide_answer_sheet: Boolean(Number(props?.quiz?.hide_answer_sheet)),
      show_per_question_time: Boolean(
        Number(props?.quiz?.show_per_question_time)
      ),
      was_the_solution_helpful: Boolean(
        Number(props?.quiz?.was_the_solution_helpful)
      ),
      bookmark: Boolean(Number(props?.quiz?.bookmark)),
      report_question_answer: Boolean(
        Number(props?.quiz?.report_question_answer)
      ),
      leaderboard: Boolean(Number(props?.quiz?.leaderboard)),
      show_rank: Boolean(Number(props?.quiz?.show_rank)),
      result_comparision_with_topper: Boolean(
        Number(props?.quiz?.result_comparision_with_topper)
      ),
      leaderboard_total_number_of_entries:
        props?.quiz?.leaderboard_total_number_of_entries ?? 10, // 0 => all,
      leaderboard_user_can_apply_multiple_times: Boolean(
        Number(props?.quiz?.leaderboard_user_can_apply_multiple_times)
      ),
      leaderboard_apply_multiple_number_of_times: props?.quiz
        ?.leaderboard_apply_multiple_number_of_times
        ? Number(props?.quiz?.leaderboard_apply_multiple_number_of_times)
        : 0,
      display_leaderboard_in_quiz_result:
        props?.quiz?.display_leaderboard_in_quiz_result ?? "do_not_display", // do_not_display/below_the_result/in_the_button
      percent_based_result_text: Boolean(
        Number(props?.quiz?.percent_based_result_text)
      ),
      result_text: Boolean(Number(props?.quiz?.percent_based_result_text))
        ? JSON.parse(props?.quiz?.result_text)
        : props?.quiz?.result_text, // ""/[{percent: number, text: ""}]
      // Notification settings
      admin_email_notification: Boolean(
        Number(props?.quiz?.admin_email_notification)
      ),
      admin_to: props?.quiz?.admin_to ?? "",
      admin_from: props?.quiz?.admin_from ?? "",
      admin_subject: props?.quiz?.admin_subject ?? "",
      admin_message: props?.quiz?.admin_message ?? "",
      student_email_notification: Boolean(
        Number(props?.quiz?.student_email_notification)
      ),
      student_to: props?.quiz?.student_to ?? "",
      student_from: props?.quiz?.student_from ?? "",
      student_subject: props?.quiz?.student_subject ?? "",
      student_message: props?.quiz?.student_message ?? "",
      instructor_email_notification: Boolean(
        Number(props?.quiz?.instructor_email_notification)
      ),
      instructor_to: props?.quiz?.instructor_to ?? "",
      instructor_from: props?.quiz?.instructor_from ?? "",
      instructor_subject: props?.quiz?.instructor_subject ?? "",
      instructor_message: props?.quiz?.instructor_message ?? "",
      // Language settings
      multi_language: Boolean(Number(props?.quiz?.multi_language)),
      language_data: props?.create
        ? props?.languages
            ?.filter((val) => val?.default)
            ?.map((val) => {
              let newData = {};
              newData["language_id"] = val?.id;
              newData["language_name"] = val?.language_name;
              newData["default"] = Boolean(val?.default);
              return newData;
            })
        : props?.quiz?.quiz_languages?.map((val) => {
            let newData = {};
            newData["language_id"] = val?.language_id;
            newData["language_name"] = val?.language?.language_name;
            newData["default"] = Boolean(val?.default);
            return newData;
          }), // [{language_id: 1, language_name: "", default: false}]
      // Instruction settings
      instruction1: props?.quiz?.instruction1 ?? "",
      instruction2: props?.quiz?.instruction2 ?? "",
    },
  });


  const navigate = useNavigate();
  const createMutation = PostCreateQuiz();
  const updateMutation = UpdateQuizById(props?.quiz_id);
  const onSubmit = (data) => {
    if(data?.percent_based_result_text){
      data.result_text = JSON.stringify(data.result_text);
    }
    if (props?.create) {
      createMutation.mutate(data, {
        onSuccess: (data) => {
          navigate("/quiz");
        },
      });
    } else {
      updateMutation.mutate(data, {
        onSuccess: (data) => {
          navigate("/quiz");
        },
      });
    }
  };

  // console.log(methods.watch());

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
            <Card>
              <CardContent>
                <Grid container spacing={{xs: 1, sm: 3}}>
                  <Grid item xs={5} sm={3}>
                    <Button variant="contained" size="medium" type="submit">
                      Save Change
                    </Button>
                  </Grid>
                  <Grid item xs={7} sm={9}>
                    <SaveTemplateSection
                      {...methods}
                      {...props}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default QuizContent;
