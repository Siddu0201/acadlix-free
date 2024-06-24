import { Box } from "@mui/material";
import React from "react";
import NormalQuizMode from "./NormalQuizMode";
import AdvanceQuizMode from "./AdvanceQuizMode";
import { set, useForm } from "react-hook-form";
import DescriptionSection from "./normalMode/normal-quiz-section/DescriptionSection";
import {
  arrayRandomize,
  randomizePosition,
  updateAnswer,
  updateQuestions,
} from "../../../helpers/util";
import { PostSaveResultById } from "../../../requests/front/FrontQuizRequest";

const QuizContent = (props) => {
  const methods = useForm({
    defaultValues: {
      start: false,
      view_question: false,
      finsih: false,
      view_result: false,
      view_answer: false,
      view_leaderboard: false,
      user_id: Number(acadlixOptions?.user?.ID),
      name: acadlixOptions?.user?.display_name,
      email: acadlixOptions?.user?.user_email,
      id: props?.quiz?.id,
      category: props?.quiz?.category?.category_name ?? "Uncategorized",
      title: props?.quiz?.title,
      description: props?.quiz?.description,
      // Mode settings
      mode: props?.quiz?.mode, // normal/check_and_continue/question_below_each_other/advance_mode
      enable_back_button: Boolean(Number(props?.quiz?.enable_back_button)),
      enable_check_button: Boolean(Number(props?.quiz?.enable_check_button)),
      enable_check_on_option_selected: Boolean(
        Number(props?.quiz?.enable_check_on_option_selected)
      ),
      skip_question: Boolean(Number(props?.quiz?.skip_question)),
      question_per_page: props?.quiz?.question_per_page, // 0 => all question
      advance_mode_type: props?.quiz?.advance_mode_type, // advance_panel/ibps/ssc/gate/sbi/jee/railway
      // General settings
      hide_quiz_title: Boolean(Number(props?.quiz?.hide_quiz_title)),
      hide_restart_button: Boolean(Number(props?.quiz?.hide_restart_button)),
      show_clear_response_button: Boolean(
        Number(props?.quiz?.show_clear_response_button)
      ),
      quiz_timing_type: props?.quiz?.quiz_timing_type, // full_quiz_time/per_question_time
      quiz_time: props?.quiz?.quiz_time * 1000, // 0 => Infinity (no limit)
      pause_quiz: Boolean(Number(props?.quiz?.pause_quiz)),
      set_start_date: Boolean(Number(props?.quiz?.set_start_date)),
      start_date: props?.quiz?.start_date
        ? new Date(props?.quiz?.start_date)
        : null, // null => indefinite
      set_end_date: Boolean(Number(props?.quiz?.set_end_date)),
      end_date: props?.quiz?.end_date ? new Date(props?.quiz?.end_date) : null, // null => indefinite
      prerequisite: Boolean(Number(props?.quiz?.prerequisite)),
      prerequisite_data: [],
      enable_login_register: Boolean(
        Number(props?.quiz?.enable_login_register)
      ),
      login_register_type: props?.quiz?.login_register_type, // at_start_of_quiz/at_finish_of_quiz
      per_user_allowed_attempt: Number(props?.quiz?.per_user_allowed_attempt), // 0 => infinity
      save_statistic: Boolean(Number(props?.quiz?.save_statistic)),
      statistic_ip_lock: Number(props?.quiz?.statistic_ip_lock),
      save_statistic_number_of_times:
        props?.quiz?.save_statistic_number_of_times, // 0 =>  infinity
      on_screen_calculator: Boolean(Number(props?.quiz?.on_screen_calculator)),
      quiz_certificate: Boolean(Number(props?.quiz?.quiz_certificate)),
      resume_unfinished_quiz: Boolean(
        Number(props?.quiz?.resume_unfinished_quiz)
      ),
      show_only_specific_number_of_questions: Boolean(
        Number(props?.quiz?.show_only_specific_number_of_questions)
      ),
      specific_number_of_questions: props?.quiz?.specific_number_of_questions, // 0 => all
      rate_quiz: Boolean(Number(props?.quiz?.rate_quiz)),
      quiz_feedback: Boolean(Number(props?.quiz?.quiz_feedback)),
      proctoring: Boolean(Number(props?.quiz?.proctoring)),
      proctoring_max_number_of_time_allowed:
        props?.quiz?.proctoring_max_number_of_time_allowed, // min 1
      // Question settings
      show_marks: Boolean(Number(props?.quiz?.show_marks)),
      display_subject: Boolean(Number(props?.quiz?.display_subject)),
      answer_bullet: Boolean(Number(props?.quiz?.answer_bullet)),
      answer_bullet_type: props?.quiz?.answer_bullet_type, // numeric/alphabet
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
      minimum_percent_to_pass: props?.quiz?.minimum_percent_to_pass, // above 0 => pass
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
        props?.quiz?.leaderboard_total_number_of_entries, // 0 => all,
      leaderboard_user_can_apply_multiple_times: Boolean(
        Number(props?.quiz?.leaderboard_user_can_apply_multiple_times)
      ),
      leaderboard_apply_multiple_number_of_times:
        props?.quiz?.leaderboard_apply_multiple_number_of_times, // 0 => infinite
      display_leaderboard_in_quiz_result:
        props?.quiz?.display_leaderboard_in_quiz_result, // do_not_display/below_the_result/in_the_button
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
      admin_to: props?.quiz?.admin_to,
      admin_from: props?.quiz?.admin_from,
      admin_subject: props?.quiz?.admin_subject,
      admin_message: props?.quiz?.admin_message,
      student_email_notification: Boolean(
        Number(props?.quiz?.student_email_notification)
      ),
      student_to: props?.quiz?.student_to,
      student_from: props?.quiz?.student_from,
      student_subject: props?.quiz?.student_subject,
      student_message: props?.quiz?.student_message,
      instructor_email_notification: Boolean(
        Number(props?.quiz?.instructor_email_notification)
      ),
      instructor_to: props?.quiz?.instructor_to,
      instructor_from: props?.quiz?.instructor_from,
      instructor_subject: props?.quiz?.instructor_subject,
      instructor_message: props?.quiz?.instructor_message,
      // Language setting
      multi_language: Boolean(Number(props?.quiz?.multi_language)),
      // Instruction settings
      instruction1: props?.quiz?.instruction1,
      instruction2: props?.quiz?.instruction2,
      // Question Section
      questions:
        updateQuestions(props?.quiz?.questions, props?.quiz)?.map(
          (question, index) => {
            return {
              selected: index === 0 ?? false,
              question_id: question?.id,
              quiz_id: props?.quiz?.id,
              subject_name: question?.subject?.subject_name ?? "Uncategorized",
              online: question?.online,
              sort: question?.sort,
              title: question?.title,
              points: question?.points,
              negative_points: question?.negative_points,
              different_points_for_each_answer: Boolean(
                Number(question?.different_points_for_each_answer)
              ),
              different_incorrect_msg: Boolean(
                Number(question?.different_incorrect_msg)
              ),
              hint_enabled: Boolean(Number(question?.hint_enabled)),
              answer_type: question?.answer_type,
              time: props?.quiz?.quiz_time * 1000,
              review: false,
              hint: false,
              check: false,
              result: {
                correct_count: 0,
                incorrect_count: 0,
                solved_count: 0,
                hint_count: 0,
                time: 0,
                answer_data: "",
              },
              language:
                question?.question_languages?.map((lang) => {
                  return {
                    language_id: lang?.language_id,
                    language_name: lang?.language?.language_name,
                    default: Boolean(Number(lang?.default)),
                    selected: Boolean(Number(lang?.default)),
                    question: lang?.question,
                    correct_msg: lang?.correct_msg,
                    incorrect_msg: lang?.incorrect_msg,
                    hint_msg: lang?.hint_msg,
                    answer_data: {
                      singleChoice: updateAnswer(
                        JSON.parse(lang?.answer_data)?.singleChoice,
                        Boolean(Number(props?.quiz?.random_option)),
                        Boolean(
                          Number(props?.quiz?.do_not_randomize_last_option)
                        )
                      ),
                      multipleChoice: updateAnswer(
                        JSON.parse(lang?.answer_data)?.multipleChoice,
                        Boolean(Number(props?.quiz?.random_option)),
                        Boolean(
                          Number(props?.quiz?.do_not_randomize_last_option)
                        )
                      ),
                      trueFalse: JSON.parse(lang?.answer_data)?.trueFalse,
                      sortingChoice:
                        question?.answer_type === "sortingChoice"
                          ? arrayRandomize(
                              JSON.parse(lang?.answer_data)?.sortingChoice
                            )
                          : [],
                      matrixSortingChoice:
                        question?.answer_type === "matrixSortingChoice"
                          ? randomizePosition(
                              JSON.parse(lang?.answer_data)?.matrixSortingChoice
                            )
                          : [],
                      fillInTheBlank: JSON.parse(lang?.answer_data)
                        ?.fillInTheBlank,
                      numerical: JSON.parse(lang?.answer_data)?.numerical,
                      rangeType: JSON.parse(lang?.answer_data)?.rangeType,
                    },
                  };
                }) ?? [],
            };
          }
        ) ?? [],
      last: Date.now(),
      now: Date.now(),
      rank: 0,
      percentile: 0,
      average_score: 0,
      topper_result: {
        quiz_time: 0,
        accuracy: 0,
        status: "",
        result: 0,
        points: 0,
        rank: 0,
        name: "",
        email: "",
      },
      toplist: [],
      toplist_count: 0,
    },
  });

  console.log(methods?.watch());
  let countdownApi = null;

  const saveResultMutation = PostSaveResultById(props?.quiz?.id);
  const saveResult = () => {
    const points = methods?.watch("questions")?.reduce((total, d) => {
      if (d?.result?.solved_count && d?.result?.correct_count) {
        return total + Number(d?.points);
      } else if (d?.result?.solved_count && d?.result?.incorrect_count) {
        return total - Number(d?.negative_points);
      } else {
        return total;
      }
    }, 0);
    const total = methods
      ?.watch("questions")
      ?.reduce((total, d) => total + Number(d?.points), 0);
    const correct_count = methods
      ?.watch("questions")
      ?.filter((d) => d?.result?.correct_count)?.length;
    const solved_count = methods
      ?.watch("questions")
      ?.filter((d) => d?.result?.solved_count)?.length;
    let data = {
      points: points,
      result: ((points / total) * 100).toFixed(2),
      accuracy: ((correct_count / solved_count) * 100).toFixed(2),
      status:
        (points / total) * 100 > methods?.watch("minimum_percent_to_pass")
          ? "Pass"
          : "Fail",
      time_taken: methods
        ?.watch("questions")
        .reduce((total, d) => total + d?.result?.time, 0),
      ...methods.watch(),
    };

    saveResultMutation?.mutate(data, {
      onSuccess: (data) => {
        methods?.setValue("average_score", data?.data?.average_score ?? 0, {
          shouldDirty: true,
        });
        methods?.setValue("percentile", data?.data?.percentile ?? 0, {
          shouldDirty: true,
        });
        methods?.setValue("rank", data?.data?.rank ?? 0, { shouldDirty: true });
        methods?.setValue("toplist_count", data?.data?.toplist_count ?? 0, { shouldDirty: true });
        methods?.setValue("toplist", data?.data?.toplist ?? [], {
          shouldDirty: true,
        });
        let topper = data?.data?.toplist?.filter((d, key) => key === 0)?.[0];
        let topper_data = {
          quiz_time: topper?.quiz_time ?? 0,
          accuracy: topper?.accuracy ?? 0,
          status: topper?.status ?? "",
          result: topper?.result ?? 0,
          points: topper?.points ?? 0,
          rank: 1,
          name: topper?.name ?? "",
          email: topper?.email ?? "",
        };
        methods?.setValue("topper_result", topper_data, { shouldDirty: true });
      },
    });
  };

  const checkMode = () => {
    switch (methods?.watch("mode")) {
      case "normal":
      case "check_and_continue":
      case "question_below_each_other":
        return (
          <NormalQuizMode
            {...methods}
            {...props}
            countdownApi={countdownApi}
            saveResult={saveResult}
            isPending={saveResultMutation?.isPending}
          />
        );
      case "advance_mode":
        return (
          <AdvanceQuizMode
            {...methods}
            {...props}
            countdownApi={countdownApi}
            saveResult={saveResult}
            isPending={saveResultMutation?.isPending}
          />
        );
      default:
        return (
          <NormalQuizMode
            {...methods}
            {...props}
            countdownApi={countdownApi}
            saveResult={saveResult}
            isPending={saveResultMutation?.isPending}
          />
        );
    }
  };

  if (!methods?.watch("start")) {
    return <DescriptionSection {...methods} countdownApi={countdownApi} />;
  }

  return <Box>{checkMode()}</Box>;
};

export default QuizContent;
