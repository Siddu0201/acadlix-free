import { Alert, Box } from "@mui/material";
import React, { useLayoutEffect } from "react";
import NormalQuizMode from "./NormalQuizMode";
import { useForm } from "react-hook-form";
import DescriptionSection from "./normalMode/normal-quiz-section/DescriptionSection";
import {
  arrayRandomize,
  getCurrentDateString,
  getFormatDate,
  getOffset,
  secondsToHms,
  strtotime,
} from "@acadlix/helpers/util";
import {
  PostSaveQuizAttemptById,
  PostSaveResultById,
} from "@acadlix/requests/front/FrontQuizRequest";
import { getCookie, setCookie } from "@acadlix/helpers/cookie";
import { __ } from "@wordpress/i18n";
import { PostResultFeedback } from "@acadlix/requests/ai/AiCommonRequest";
import toast from "react-hot-toast";
import { QuizFunction } from "./QuizFunction";

const AdvanceQuizMode = React.lazy(() =>
  process.env.REACT_APP_IS_PREMIUM === 'true'
    ? import(
        /* webpackChunkName: "front_dashboard_quiz_advance_quiz_mode" */
        "@acadlix/pro/front/dashboard/quiz/AdvanceQuizMode") // Use pro version in Pro build
    : Promise.resolve({ default: () => null })           // Provide fallback if in Free build
);

const QuizContent = (props) => {
  const userToken = "acadlix_user_token";
  const methods = useForm({
    defaultValues: {
      logo: props?.logo,
      login_modal: false,
      start: props?.start ?? false,
      view_instruction1: props?.start ?? false,
      view_instruction2: false,
      ready_to_begin: false,
      view_question: false,
      finsih: false,
      view_result: false,
      view_answer: false,
      view_leaderboard: false,
      user_id: acadlixOptions?.user?.ID ? Number(acadlixOptions?.user?.ID) : 0,
      name: acadlixOptions?.user?.display_name,
      email: acadlixOptions?.user?.user_email,
      user_token: "",
      id: props?.quiz?.ID,
      category: props?.quiz?.category?.name ?? "Uncategorized",
      title: props?.quiz?.post_title,
      description: props?.quiz?.rendered_post_content ?? "",
      // Mode settings
      mode: props?.quiz?.rendered_metas?.mode, // normal/check_and_continue/question_below_each_other/advance_mode
      advance_mode_type: props?.quiz?.rendered_metas?.advance_mode_type, // advance_panel/ibps/ssc/gate/sbi/jee/railway
      start_date: props?.quiz?.rendered_metas?.start_date ?? "",
      end_date: props?.quiz?.rendered_metas?.end_date ?? "",
      multi_language: Boolean(Number(props?.quiz?.rendered_metas?.multi_language)),
      // Quiz settings
      // Mode settings
      enable_back_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_back_button)),
      enable_check_on_option_selected: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_check_on_option_selected)
      ),
      skip_question: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.skip_question)),
      question_per_page: props?.quiz?.rendered_metas?.quiz_settings?.question_per_page, // 0 => all question
      pagination_page: 1,
      // General settings
      hide_quiz_title: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_quiz_title)),
      hide_restart_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.hide_restart_button)),
      show_clear_response_button: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.show_clear_response_button)
      ),
      enable_check_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_check_button)),
      quiz_timing_type: props?.quiz?.rendered_metas?.quiz_settings?.quiz_timing_type, // full_quiz_time/per_question_time
      quiz_time: props?.quiz?.rendered_metas?.quiz_settings?.quiz_time * 1000, // 0 => Infinity (no limit)
      show_review_button: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_review_button)),
      start_button_text: props?.quiz?.rendered_metas?.quiz_settings?.start_button_text ?? "Start Quiz",
      enable_login_register: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_login_register)
      ),
      per_user_allowed_attempt: Number(props?.quiz?.rendered_metas?.quiz_settings?.per_user_allowed_attempt), // 0 => infinity
      enable_prerequisite: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_prerequisite)),
      save_statistic: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.save_statistic)),
      statistic_ip_lock: Number(props?.quiz?.rendered_metas?.quiz_settings?.statistic_ip_lock),
      save_statistic_number_of_times:
        props?.quiz?.rendered_metas?.quiz_settings?.save_statistic_number_of_times, // 0 =>  infinity
      show_only_specific_number_of_questions: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.show_only_specific_number_of_questions)
      ),
      specific_number_of_questions: props?.quiz?.rendered_metas?.quiz_settings?.specific_number_of_questions, // 0 => all
      result_feedback_by_ai: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.result_feedback_by_ai)),
      result_feedback_additional_prompt: props?.quiz?.rendered_metas?.quiz_settings?.result_feedback_additional_prompt ?? "",
      scientific_calculator: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.scientific_calculator)),
      // Question settings
      show_marks: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.show_marks)),
      display_subject: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.display_subject)),
      answer_bullet: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.answer_bullet)),
      answer_bullet_type: props?.quiz?.rendered_metas?.quiz_settings?.answer_bullet_type, // numeric/alphabet
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
      // Subject wise settings
      optional_subject: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.optional_subject)),
      subject_wise_question: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.subject_wise_question)
      ),
      enable_selectable_questions_rule: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.enable_selectable_questions_rule)
      ),
      selectable_questions_rule: props?.quiz?.rendered_metas?.quiz_settings?.selectable_questions_rule, //evaluate_first_x_attempted_questions/allow_only_x_attempts
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
      minimum_percent_to_pass: props?.quiz?.rendered_metas?.quiz_settings?.minimum_percent_to_pass, // above 0 => pass
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
        props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_total_number_of_entries, // 0 => all,
      leaderboard_user_can_apply_multiple_times: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_user_can_apply_multiple_times)
      ),
      leaderboard_apply_multiple_number_of_times:
        props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_apply_multiple_number_of_times, // 0 => infinite
      display_leaderboard_in_quiz_result:
        props?.quiz?.rendered_metas?.quiz_settings?.display_leaderboard_in_quiz_result, // do_not_display/below_the_result/in_the_button
      percent_based_result_text: Boolean(
        Number(props?.quiz?.rendered_metas?.quiz_settings?.percent_based_result_text)
      ),
      result_text: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.percent_based_result_text))
        ? props?.quiz?.rendered_metas?.quiz_settings?.result_text
        : props?.quiz?.rendered_metas?.quiz_settings?.result_text, // ""/[{percent: number, text: ""}]
      // Language settings
      default_language_id: props?.quiz?.rendered_metas?.default_language_id
        ? Number(props?.quiz?.rendered_metas?.default_language_id)
        : null,
      language_data:
        props?.quiz?.rendered_metas?.language_data?.map((l) => {
          return {
            ...l,
            language_name: props?.quiz?.languages?.find((d) => d?.term_id === l?.language_id)?.name,
            instruction1: l?.instruction1,
            instruction2: l?.instruction2,
            default: Boolean(Number(l?.default)),
            selected: Boolean(Number(l?.default)),
          };
        }) ?? [],
      languages: props?.quiz?.languages ?? [],
      selected_language_id: props?.quiz?.rendered_metas?.default_language_id,
      // Question Section
      subjects: [],
      subject_times:
        props?.quiz?.subject_times ?
          props?.quiz?.subject_times?.map((s) => {
            return {
              ...s,
              optional: Boolean(Number(s?.optional)),
            };
          }) : [],
      questions:
        props?.quiz?.rendered_questions?.map((question, index) => {
          return {
            index: index,
            selected:
              props?.quiz?.rendered_metas?.mode === "question_below_each_other"
                ? props?.quiz?.rendered_metas?.quiz_settings?.question_per_page > 0
                  ? props?.quiz?.rendered_metas?.quiz_settings?.question_per_page > index ?? false
                  : true
                : index === 0 ?? false,
            question_id: question?.id,
            quiz_id: props?.quiz?.ID,
            subject_id: question?.subject_id,
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
            paragraph_enabled: Boolean(Number(question?.paragraph_enabled)),
            paragraph_id: question?.paragraph_id,
            answer_type: question?.answer_type,
            time: props?.quiz?.rendered_metas?.quiz_settings?.quiz_time * 1000,
            bookmark: false,
            like: false,
            dislike: false,
            report: false,
            report_msg: "",
            review: false,
            hint: false,
            check: false,
            visit: index === 0,
            result: {
              correct_count: 0,
              incorrect_count: 0,
              solved_count: 0,
              hint_count: 0,
              time: 0,
              answer_data: question?.answer_type === "sortingChoice"
                ? question
                  ?.question_languages
                  ?.find((lang) => Boolean(Number(lang?.default)))
                  ?.rendered_answer_data
                  ?.sortingChoice
                  ?.map((d) => d.position)
                : null,
              attempted_at: null,
            },
            shuffle_order: question?.answer_type === "matrixSortingChoice"
              ? arrayRandomize(question
                ?.question_languages
                ?.find((lang) => Boolean(Number(lang?.default)))
                ?.rendered_answer_data
                ?.matrixSortingChoice
                ?.map((d) => String(d?.correctPosition)) ?? [])
              : null,
            language:
              question?.question_languages?.map((lang) => {
                return {
                  language_id: lang?.language_id,
                  language_name: lang?.language?.name,
                  default: Boolean(Number(lang?.default)),
                  selected: Boolean(Number(lang?.default)),
                  paragraph:
                    question?.paragraph?.rendered_metas?.language_data?.find(
                      (p) => p?.language_id === lang?.language_id
                    )?.content ?? ""
                    ?? "",
                  question: lang?.rendered_question,
                  correct_msg: lang?.rendered_correct_msg,
                  incorrect_msg: lang?.rendered_incorrect_msg,
                  hint_msg: lang?.rendered_hint_msg,
                  answer_data: {
                    singleChoice: lang?.rendered_answer_data?.singleChoice,
                    multipleChoice: lang?.rendered_answer_data
                      ?.multipleChoice,
                    trueFalse: lang?.rendered_answer_data?.trueFalse,
                    freeChoice: lang?.rendered_answer_data?.freeChoice,
                    sortingChoice: lang?.rendered_answer_data?.sortingChoice ?? [],
                    matrixSortingChoice: lang?.rendered_answer_data?.matrixSortingChoice ?? [],
                    fillInTheBlank: lang?.rendered_answer_data
                      ?.fillInTheBlank,
                    numerical: lang?.rendered_answer_data?.numerical,
                    rangeType: lang?.rendered_answer_data?.rangeType,
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
      toplist_id: 0,
      toplist: [],
      toplist_count: 0,
      quiz_error: "",
      // ai
      result_ai_response: "",
      show_calculator: false,
    },
  });

  if (process.env.REACT_APP_MODE === 'development') {
    console?.log(methods?.watch());
  }

  const {
    getPoints,
    getNegativePoints,
    getTotalPoints,
    getResult,
    getCorrectCount,
    getIncorrectCount,
    getSkippedCount,
    getSolvedCount,
    getAccuracy,
    getStatus,
    getTimeTaken,
    getPointsBySubjectId,
    getNegativePointsBySubjectId,
    getTotalPointsBySubjectId,
    getSolvedCountBySubjectId,
    getCorrectCountBySubjectId,
    getIncorrectCountBySubjectId,
    getSkippedCountBySubjectId,
    getTimeBySubjectId,
    isSolved,
    isCorrect,
    isIncorrect,
    isQuestionEvaluated,
  } = QuizFunction(methods);

  useLayoutEffect(() => {
    if (typeof window.wp !== "undefined" && window.wp.mediaelement) {
      // Initialize mediaelement.js
      window.wp.mediaelement.initialize();
    }
  });

  let [countdownApi, setCountDownApi] = React.useState(null);

  function getQueryParamsFromCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [key, value] of params.entries()) {
      result[key] = value;
    }

    return result;
  }

  const handleCompleteCourseContent = () => {
    if (methods?.watch("mode") === "advance_mode") {
      const queryParams = getQueryParamsFromCurrentPage();
      if (
        queryParams?.course_section_content_id !== undefined &&
        queryParams?.section_index !== undefined &&
        queryParams?.content_index !== undefined
      ) {

        const payload = {
          type: "QUIZ_HANDLE_COMPLETE",
          payload: {
            course_section_content_id: queryParams?.course_section_content_id,
            section_index: queryParams?.section_index,
            content_index: queryParams?.content_index,
          },
        };

        // If inside a real browser
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, "*");
        }

        // window.opener.handleComplete(
        //   queryParams?.course_section_content_id,
        //   queryParams?.section_index,
        //   queryParams?.content_index,
        //   0,
        //   false
        // );
      }
    } else {
      if (
        props?.course_section_content_id !== undefined &&
        props?.section_index !== undefined &&
        props?.content_index !== undefined &&
        props?.handleComplete !== undefined &&
        props?.is_completed !== undefined
      ) {
        if (!props?.is_completed) {
          props?.handleComplete(
            props?.course_section_content_id,
            props?.section_index,
            props?.content_index,
            0,
            false
          );
        }
      }
    }
  };

  const resultFeedbackMutation = PostResultFeedback();

  const handleGenerateResultFeedback = () => {
    if (!methods?.watch("result_feedback_by_ai")) {
      return;
    }
    let question = methods?.watch("questions");

    const data = {
      quiz_title: methods?.watch("title"),
      correct_count: getCorrectCount(),
      incorrect_count: getIncorrectCount(),
      skipped_count: getSkippedCount(),
      total_question: question?.length,
      time_taken: getTimeTaken(),
      result: getResult(),
      questions: question?.map(q => {
        return {
          question: q?.language?.find(l => l?.default)?.question,
          isCorrect: q?.result?.correct_count,
          isIncorrect: q?.result?.incorrect_count,
          isSolved: q?.result?.solved_count,
          answer_type: q?.answer_type
        }
      }),
      prompt: methods?.watch("result_feedback_additional_prompt"),
    };
    resultFeedbackMutation?.mutate(data, {
      onSuccess: (data) => {
        methods?.setValue("result_ai_response", data?.data?.feedback, { shouldDirty: true });
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      }
    });
  }

  const quizAttemptMutation = PostSaveQuizAttemptById(methods?.watch("id"));

  const handleQuizAttempt = () => {
    if (methods?.watch("user_id") === 0) {
      const tokenExpiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const userTokenValue = getCookie(userToken) || `${userToken}_${tokenExpiry}`;
      setCookie(userToken, userTokenValue, tokenExpiry);
      methods?.setValue("user_token", getCookie(userToken), { shouldDirty: true });
    }
    const data = {
      user_id: methods?.watch("user_id"),
      user_token: methods?.watch("user_token"),
      quiz_attempt_type: props?.quiz_attempt_type ?? "shortcode",
      course_statistic_id: props?.course_statistic_id ?? 0,
    };
    quizAttemptMutation.mutate(data);
  }

  const saveResultMutation = PostSaveResultById(methods?.watch("id"));

  const saveResult = () => {

    // Complete course lesson
    handleCompleteCourseContent();

    // Result AI Feedback
    handleGenerateResultFeedback();

    if (methods?.watch("user_id") === 0) {
      const tokenExpiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const userTokenValue = getCookie(userToken) || `${userToken}_${tokenExpiry}`;
      setCookie(userToken, userTokenValue, tokenExpiry);
      methods?.setValue("user_token", getCookie(userToken), { shouldDirty: true });
    }

    let data = {
      points: getPoints(),
      result: getResult(),
      accuracy: getAccuracy(),
      status: getStatus(),
      time_taken: getTimeTaken(),
      user_token: methods?.watch("user_token"),
      user_id: methods?.watch("user_id"),
      name: methods?.watch("name"),
      email: methods?.watch("email"),
      questions: methods?.watch("questions")?.map((d) => {
        return {
          question_id: d?.question_id,
          result: d?.result,
          points: d?.points,
          negative_points: d?.negative_points,
          answer_data: d?.result?.answer_data,
        };
      }),
      quiz_attempt_type: props?.quiz_attempt_type ?? "shortcode",
      course_statistic_id: props?.course_statistic_id ?? 0,
    };

    if (methods?.watch("mode") === "advance_mode") {
      const queryParams = getQueryParamsFromCurrentPage();
      if (
        queryParams?.quiz_attempt_type !== undefined &&
        queryParams?.course_statistic_id !== undefined
      ) {
        data.quiz_attempt_type = queryParams?.quiz_attempt_type;
        data.course_statistic_id = queryParams?.course_statistic_id;
      }
    }

    saveResultMutation?.mutate(data, {
      onSuccess: (data) => {
        let topper = data?.data?.topper;
        const topper_result = {
          quiz_time: topper?.result > getResult() ? topper.quiz_time ?? 0 : getTimeTaken(),
          accuracy: topper?.result > getResult() ? topper?.accuracy?.toFixed(2) ?? 0 : getAccuracy()?.toFixed(2),
          status: topper?.result > getResult() ? topper?.status ?? "" : getStatus(),
          result: topper?.result > getResult() ? topper?.result?.toFixed(2) ?? 0 : getResult()?.toFixed(2),
          points: topper?.result > getResult() ? topper?.points?.toFixed(2) ?? 0 : getPoints()?.toFixed(2),
          rank: 1,
          name: topper?.result > getResult() ? topper?.name ?? "Anonymous" : methods?.watch("name"),
          email: topper?.result > getResult() ? topper?.email ?? "" : methods?.watch("email"),
        }

        methods?.reset({
          ...methods?.getValues(),
          average_score: data?.data?.average_score?.toFixed(2) ?? 0,
          percentile: data?.data?.percentile?.toFixed(2) ?? 0,
          rank: data?.data?.rank ?? 1,
          toplist_count: data?.data?.toplist_count ?? 0,
          toplist: data?.data?.toplist ?? [],
          toplist_id: data?.data?.toplist_id ?? 0,
          topper_result: topper_result,
        },
          {
            shouldDirty: true,
          }
        );
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
            setCountDownApi={setCountDownApi}
            saveResult={saveResult}
            isPending={saveResultMutation?.isPending}
            isPendingResultFeedback={resultFeedbackMutation?.isPending}
            getPoints={getPoints}
            getNegativePoints={getNegativePoints}
            getTotalPoints={getTotalPoints}
            getResult={getResult}
            getCorrectCount={getCorrectCount}
            getIncorrectCount={getIncorrectCount}
            getSkippedCount={getSkippedCount}
            getSolvedCount={getSolvedCount}
            getAccuracy={getAccuracy}
            getStatus={getStatus}
            getTimeTaken={getTimeTaken}
            getPointsBySubjectId={getPointsBySubjectId}
            getNegativePointsBySubjectId={getNegativePointsBySubjectId}
            getTotalPointsBySubjectId={getTotalPointsBySubjectId}
            getSolvedCountBySubjectId={getSolvedCountBySubjectId}
            getCorrectCountBySubjectId={getCorrectCountBySubjectId}
            getIncorrectCountBySubjectId={getIncorrectCountBySubjectId}
            getSkippedCountBySubjectId={getSkippedCountBySubjectId}
            getTimeBySubjectId={getTimeBySubjectId}
            isSolved={isSolved}
            isCorrect={isCorrect}
            isIncorrect={isIncorrect}
            isQuestionEvaluated={isQuestionEvaluated}
          />
        );
      case "advance_mode":
        return (
          <React.Suspense fallback={null}>
            <AdvanceQuizMode
              {...methods}
              {...props}
              countdownApi={countdownApi}
              setCountDownApi={setCountDownApi}
              saveResult={saveResult}
              isPending={saveResultMutation?.isPending}
              isPendingResultFeedback={resultFeedbackMutation?.isPending}
              getPoints={getPoints}
              getNegativePoints={getNegativePoints}
              getTotalPoints={getTotalPoints}
              getResult={getResult}
              getCorrectCount={getCorrectCount}
              getIncorrectCount={getIncorrectCount}
              getSkippedCount={getSkippedCount}
              getSolvedCount={getSolvedCount}
              getAccuracy={getAccuracy}
              getStatus={getStatus}
              getTimeTaken={getTimeTaken}
              getPointsBySubjectId={getPointsBySubjectId}
              getNegativePointsBySubjectId={getNegativePointsBySubjectId}
              getTotalPointsBySubjectId={getTotalPointsBySubjectId}
              getSolvedCountBySubjectId={getSolvedCountBySubjectId}
              getCorrectCountBySubjectId={getCorrectCountBySubjectId}
              getIncorrectCountBySubjectId={getIncorrectCountBySubjectId}
              getSkippedCountBySubjectId={getSkippedCountBySubjectId}
              getTimeBySubjectId={getTimeBySubjectId}
              isSolved={isSolved}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              isQuestionEvaluated={isQuestionEvaluated}
            />
          </React.Suspense>
        );
      default:
        return (
          <></>
        );
    }
  };

  const current_date = getCurrentDateString();
  const start_date = strtotime(methods?.watch("start_date"));
  const end_date = strtotime(methods?.watch("end_date"));

  if (methods?.watch("questions")?.length === 0) {
    return <Alert severity="error">{__("No questions found", "acadlix")}</Alert>;
  }

  if (start_date && current_date < start_date) {
    return <Alert severity="error">{`${__('Quiz will start on', 'acadlix')} ${getFormatDate(start_date)} ${getOffset()} `}</Alert>;
  }

  if (end_date && current_date > end_date) {
    return <Alert severity="error">{__("Quiz has expired", "acadlix")}</Alert>;
  }

  if (!methods?.watch("start")) {
    return (
      <>
        <DescriptionSection
          {...methods}
          {...props}
          userToken={userToken}
          countdownApi={countdownApi}
          handleQuizAttempt={handleQuizAttempt}
        />
      </>
    );
  }

  return (
    <Box>
      {checkMode()}
    </Box>
  );
};

export default QuizContent;
