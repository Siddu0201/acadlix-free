import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { useForm } from "react-hook-form";
import CategoryTemplateSection from "./sections/CategoryTemplateSection";
import TitleDescriptionSection from "./sections/TitleDescriptionSection";
import QuizModeSection from "./sections/QuizModeSection";
import QuizSettingSection from "./sections/QuizSettingSection";
import { TiArrowLeftThick } from "@acadlix/helpers/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  PostCreateQuiz,
  UpdateQuizById,
} from "@acadlix/requests/admin/AdminQuizRequest";
import SaveTemplateSection from "./sections/SaveTemplateSection";
import LanguageSection from "./sections/LanguageSection";
import { __ } from "@wordpress/i18n";

const QuizContent = (props) => {
  const methods = useForm({
    defaultValues: {
      id: props?.quiz_id,
      post_title: props?.quiz?.post_title ?? "",
      post_content: props?.quiz?.post_content ?? "",
      post_author: props?.quiz?.post_author ?? acadlixOptions?.user_id,
      quiz_section: "1",
      category_id: props?.quiz?.category?.term_id ?? null,
      templates: props?.templates ?? [],
      load_template_id: null,
      languages: props?.quiz?.languages?.map(l => l?.term_id) ?? [],
      quizzes: props?.quizzes ?? [],
      prerequisite: props?.prerequisites
        ? props?.prerequisites?.map(p => ({ID: p?.prerequisite_id, post_title: p?.quiz_title}))
       : [],
      meta: {
        mode: props?.quiz?.rendered_metas?.mode ?? "normal", // normal/check_and_continue/question_below_each_other/advance_mode
        advance_mode_type: props?.quiz?.rendered_metas?.advance_mode_type ?? "advance_panel", // advance_panel/ibps/ssc/gate/sbi/jee/railway
        start_date: props?.quiz?.rendered_metas?.start_date ?? "",
        end_date: props?.quiz?.rendered_metas?.end_date ?? "",
        multi_language: Boolean(Number(props?.quiz?.rendered_metas?.multi_language)),
        quiz_settings: {
          // Mode settings
          enable_back_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_back_button)),
          enable_check_on_option_selected: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_check_on_option_selected)
          ),
          skip_question: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.skip_question)),
          question_per_page: props?.quiz?.rendered_metas?.quiz_settings?.question_per_page ?? 10, // 0 => all question
          // General settings
          hide_quiz_title: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_quiz_title)),
          hide_restart_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_restart_button)),
          show_clear_response_button: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.show_clear_response_button)
          ),
          enable_check_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_check_button)),
          quiz_timing_type: props?.quiz?.rendered_metas?.quiz_settings?.quiz_timing_type ?? "full_quiz_time", // full_quiz_time/per_question_time/subject_wise_time
          quiz_time: props?.quiz?.rendered_metas?.quiz_settings?.quiz_time ?? 0, // 0 => Infinity (no limit)
          show_review_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_review_button)),
          start_button_text: props?.quiz?.rendered_metas?.quiz_settings?.start_button_text ?? "Start Quiz",
          enable_login_register: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_login_register)
          ),
          per_user_allowed_attempt: props?.quiz?.rendered_metas?.quiz_settings?.per_user_allowed_attempt ?? 0, // 0 => infinity
          save_statistic: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.save_statistic)) ?? 0,
          statistic_ip_lock: props?.quiz?.rendered_metas?.quiz_settings?.statistic_ip_lock ?? 0,
          save_statistic_number_of_times:
            props?.quiz?.rendered_metas?.quiz_settings?.save_statistic_number_of_times ?? 0, // 0 =>  infinity
          show_only_specific_number_of_questions: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.show_only_specific_number_of_questions)
          ),
          specific_number_of_questions:
            props?.quiz?.rendered_metas?.quiz_settings?.specific_number_of_questions ?? 0, // 0 => all
          result_feedback_by_ai: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.result_feedback_by_ai)),  
          result_feedback_additional_prompt: props?.quiz?.rendered_metas?.quiz_settings?.result_feedback_additional_prompt ?? "",
          scientific_calculator: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.scientific_calculator)),
          enable_selectable_questions_rule: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_selectable_questions_rule)),
          // Question settings
          show_marks: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_marks)),
          display_subject: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.display_subject)),
          answer_bullet: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.answer_bullet)),
          answer_bullet_type: props?.quiz?.rendered_metas?.quiz_settings?.answer_bullet_type ?? "numeric", // numeric/alphabet
          random_question: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.random_question)),
          random_option: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.random_option)),
          do_not_randomize_last_option: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.do_not_randomize_last_option)
          ),
          question_overview: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.question_overview)),
          hide_question_numbering: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_question_numbering)
          ),
          sort_by_subject: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.sort_by_subject)),
          attempt_and_move_forward: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.attempt_and_move_forward)
          ),
          force_user_to_answer_each_question: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.force_user_to_answer_each_question)
          ),
          // Result settings
          hide_result: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_result)),
          hide_negative_marks: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_negative_marks)),
          hide_quiz_time: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_quiz_time)),
          show_speed: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_speed)),
          show_percentile: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_percentile)),
          show_accuracy: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_accuracy)),
          show_average_score: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_average_score)),
          show_subject_wise_analysis: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.show_subject_wise_analysis)
          ),
          show_marks_distribution: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.show_marks_distribution)
          ),
          show_status_based_on_min_percent: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.show_status_based_on_min_percent)
          ),
          minimum_percent_to_pass: props?.quiz?.rendered_metas?.quiz_settings?.minimum_percent_to_pass ?? 0, // above 0 => pass
          hide_answer_sheet: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_answer_sheet)),
          show_per_question_time: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.show_per_question_time)
          ),
          leaderboard: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.leaderboard)),
          show_rank: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_rank)),
          result_comparision_with_topper: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.result_comparision_with_topper)
          ),
          leaderboard_total_number_of_entries:
            props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_total_number_of_entries ?? 10, // 0 => all,
          leaderboard_user_can_apply_multiple_times: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_user_can_apply_multiple_times)
          ),
          leaderboard_apply_multiple_number_of_times: props?.quiz
            ?.leaderboard_apply_multiple_number_of_times
            ? Number(props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_apply_multiple_number_of_times)
            : 0,
          display_leaderboard_in_quiz_result:
            props?.quiz?.rendered_metas?.quiz_settings?.display_leaderboard_in_quiz_result ?? "do_not_display", // do_not_display/below_the_result/in_the_button
          percent_based_result_text: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.percent_based_result_text)
          ),
          result_text: props?.quiz?.rendered_metas?.quiz_settings?.result_text ?? "", // ""/[{percent: number, text: ""}]
          // Notification settings
          admin_email_notification: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.admin_email_notification)
          ),
          admin_to: props?.quiz?.rendered_metas?.quiz_settings?.admin_to ?? "",
          admin_from: props?.quiz?.rendered_metas?.quiz_settings?.admin_from ?? "",
          admin_subject: props?.quiz?.rendered_metas?.quiz_settings?.admin_subject ?? "Acadlix: One user completed a quiz",
          admin_message: props?.quiz?.rendered_metas?.quiz_settings?.admin_message
            ?? __(
              'Acadlix <br/><br/>You have completed the quiz "$quizname".<br/><br/>Points: $points<br/>Result: $result',
              'acadlix'
            ),
          student_email_notification: Boolean(
            Number(props?.quiz?.rendered_metas?.quiz_settings?.student_email_notification)
          ),
          student_to: props?.quiz?.rendered_metas?.quiz_settings?.student_to ?? "",
          student_from: props?.quiz?.rendered_metas?.quiz_settings?.student_from ?? "",
          student_subject: props?.quiz?.rendered_metas?.quiz_settings?.student_subject ?? "Acadlix: One user completed a quiz",
          student_message: props?.quiz?.rendered_metas?.quiz_settings?.student_message
            ?? __(
              'Acadlix <br/><br/>You have completed the quiz "$quizname".<br/><br/>Points: $points<br/>Result: $result',
              'acadlix'
            ),
          enable_prerequisite: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_prerequisite)),
          subject_wise_question: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.subject_wise_question)),
        },
        default_language_id: props?.quiz?.rendered_metas?.default_language_id
          ? Number(props?.quiz?.rendered_metas?.default_language_id)
          : null,
        language_data: props?.quiz?.rendered_metas?.language_data ?? [
          {
            language_id: null,
            default: true,
            selected: true,
            instruction1: "",
            instruction2: "",
            term_and_condition_text: "",
            term_and_condition_warning_text: "",
          }],
      },
    },
  });

  // console?.log(props?.quiz);
  if (process?.env?.REACT_APP_MODE === 'development') {
    console?.log(methods?.watch());
  }

  const navigate = useNavigate();
  const createMutation = PostCreateQuiz();
  const updateMutation = UpdateQuizById(props?.quiz_id);
  const onSubmit = (data) => {
    // Set default category if not set
    if (!methods?.watch("category_id")) {
      const category_id = props?.categories?.find(c => c?.default)?.term_id;
      methods?.setValue("category_id", category_id);
    }
    // Set default langauge if not set
    if (!methods?.watch("meta.default_language_id") && methods?.watch("languages")?.length === 0) {
      const langauge_id = props?.languages?.find(l => l?.default)?.term_id;
      methods.setValue("meta.default_language_id", langauge_id);
      methods?.setValue("meta.language_data.0.language_id", langauge_id);
      methods?.setValue("languages", [langauge_id]);
    }
    if (props?.create) {
      createMutation.mutate(methods?.watch(), {
        onSuccess: (data) => {
          navigate("/");
        }
      });
    } else {
      updateMutation.mutate(methods?.watch(), {
        onSuccess: (data) => {
          navigate("/");
        }
      });
    }
  };

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        plugins:
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern wpview",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons",
        toolbar2:
          "styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
        textarea_rows: 20,
        setup: function (editor) {
          editor.on("input change", function (e) {
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
          spacing={{
            xs: 2,
            sm: 4,
          }}
          sx={{
            padding: {
              xs: 2,
              sm: 4,
            },
          }}
        >
          <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
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
                to="/"
              >
                {__('Back', 'acadlix')}
              </Button>
              <Typography variant="h3">
                {props?.create ? __('Create Quiz', 'acadlix') : __('Edit Quiz', 'acadlix')}
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

          {/* Fourth section contain quiz language */}
          {/* <LanguageSection {...methods} {...props} /> */}

          {/* Fifth section contain question settings */}
          <QuizSettingSection
            {...methods}
            {...props}
            loadEditor={loadEditor}
            removeEditor={removeEditor}
          />

          <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
              <CardContent>
                <Grid container spacing={{ xs: 1, sm: 3 }}>
                  <Grid size={{ xs: 5, sm: 3 }}>
                    <Button variant="contained" size="medium" type="submit">
                      {createMutation?.isPending ||
                        updateMutation?.isPending ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        __('Save Changes', 'acadlix')
                      )}
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 7, sm: 9 }}>
                    <SaveTemplateSection {...methods} {...props} />
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
