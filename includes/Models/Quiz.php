<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Quiz')){
    class Quiz extends Model
    {
        protected $table = "quiz";

        protected $fillable = [
            "category_id",
            "title",
            "description",
            // Mode
            "mode",
            "enable_back_button",
            "enable_check_button",
            "enable_check_on_option_selected",
            "question_per_page",
            "advance_mode_type",
            // General
            "hide_quiz_title",
            "hide_restart_button",
            "show_clear_response_button",
            "quiz_timing_type",
            "quiz_time",
            "pause_quiz",
            "set_start_date",
            "start_date",
            "set_end_date",
            "end_date",
            "prerequisite",
            "enable_login_register",
            "login_register_type",
            "per_user_allowed_attempt",
            "save_statistic",
            "save_statistic_number_of_times",
            "on_screen_calculator",
            "quiz_certificate",
            "resume_unfinished_quiz",
            "show_only_specific_number_of_questions",
            "specific_number_of_questions",
            "rate_quiz",
            "quiz_feedback",
            "proctoring",
            "proctoring_max_number_of_time_allowed",
            // Question 
            "show_marks",
            "display_subject",
            "skip_question",
            "answer_bullet",
            "answer_bullet_type",
            "random_option",
            "do_not_randomize_last_option",
            "question_overview",
            "hide_question_numbering",
            "sort_by_subject",
            "attempt_and_move_forward",
            "force_user_to_answer_each_question",
            // Result
            "hide_result",
            "hide_negative_marks",
            "hide_quiz_time",
            "show_speed",
            "show_percentile",
            "show_accuracy",
            "show_rank",
            "show_average_score",
            "show_subject_wise_analysis",
            "show_marks_distribution",
            "show_status_based_on_min_percent",
            "minimum_percent_to_pass",
            "result_comparision_with_top_five_student",
            "hide_answer_sheet",
            "show_per_question_time",
            "was_the_solution_helpful",
            "bookmark",
            "report_question_answer",
            "leaderboard",
            "leaderboard_total_number_of_entries",
            "leaderboard_user_can_apply_multiple_times",
            "leaderboard_apply_multiple_number_of_times",
            "display_leaderboard_in_quiz_result",
            "percent_based_result_text",
            "result_text",
            // Notification
            "admin_email_notification",
            "admin_to",
            "admin_from",
            "admin_subject",
            "admin_message",
            "student_email_notification",
            "student_to",
            "student_from",
            "student_subject",
            "student_message",
            "instructor_email_notification",
            "instructor_to",
            "instructor_from",
            "instructor_subject",
            "instructor_message",
            // Language
            "multi_language",
            // Instruction
            "instruction1",
            "instruction2",
        ];

        protected $with = ["category", "quiz_languages"];


        public function category()
        {
            return $this->belongsTo(Category::class, "category_id", "id");
        }

        /**
         * Get all of the quiz_language for the Quiz
         *
         * @return \Illuminate\Database\Eloquent\Relations\HasMany
         */
        public function quiz_languages()
        {
            return $this->hasMany(QuizLang::class, 'quiz_id', 'id');
        }

        public function questions()
        {
            return $this->hasMany(Question::class, 'quiz_id', 'id');
        }

    }
}