<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Helper\Helper;
defined('ABSPATH') || exit();

if (!class_exists('Quiz')) {
    class Quiz extends Model
    {
        protected $helper;
        protected $table = 'posts'; // Posts table is used for all post types
        protected $primaryKey = 'ID';
        protected $with = ['author', 'metas', 'quiz_shortcode'];
        protected $appends = [
            'rendered_post_content',
            'rendered_metas',
            'category',
            'languages',
            'questions_count',
        ];

        protected static $postType = ACADLIX_QUIZ_CPT;
        protected static $categoryTaxonomy = ACADLIX_QUIZ_CATEGORY_TAXONOMY;
        protected static $languageTaxonomy = ACADLIX_QUIZ_LANGUAGE_TAXONOMY;

        protected static $metaPrefix = "_acadlix_quiz_";

        // protected $fillable = [
        //     "category_id",
        //     "title",
        //     "description",
        //     // Mode
        //     "mode",
        //     "enable_back_button",
        //     "enable_check_button",
        //     "enable_check_on_option_selected",
        //     "question_per_page",
        //     "advance_mode_type",
        //     // General
        //     "hide_quiz_title",
        //     "hide_restart_button",
        //     "show_clear_response_button",
        //     "quiz_timing_type",
        //     "quiz_time",
        //     "pause_quiz",
        //     "show_review_button",
        //     "set_start_date",
        //     "start_date",
        //     "set_end_date",
        //     "end_date",
        //     "prerequisite",
        //     "enable_login_register",
        //     "login_register_type",
        //     "per_user_allowed_attempt",
        //     "save_statistic",
        //     "statistic_ip_lock",
        //     "save_statistic_number_of_times",
        //     "on_screen_calculator",
        //     "quiz_certificate",
        //     "resume_unfinished_quiz",
        //     "show_only_specific_number_of_questions",
        //     "specific_number_of_questions",
        //     "rate_quiz",
        //     "quiz_feedback",
        //     "proctoring",
        //     "proctoring_max_number_of_time_allowed",
        //     // Question 
        //     "show_marks",
        //     "display_subject",
        //     "skip_question",
        //     "answer_bullet",
        //     "answer_bullet_type",
        //     "random_question",
        //     "random_option",
        //     "do_not_randomize_last_option",
        //     "question_overview",
        //     "hide_question_numbering",
        //     "sort_by_subject",
        //     "subject_wise_question",
        //     "optional_subject",
        //     "attempt_and_move_forward",
        //     "force_user_to_answer_each_question",
        //     // Result
        //     "hide_result",
        //     "hide_negative_marks",
        //     "hide_quiz_time",
        //     "show_speed",
        //     "show_percentile",
        //     "show_accuracy",
        //     "show_average_score",
        //     "show_subject_wise_analysis",
        //     "show_marks_distribution",
        //     "show_status_based_on_min_percent",
        //     "minimum_percent_to_pass",
        //     "hide_answer_sheet",
        //     "show_per_question_time",
        //     "was_the_solution_helpful",
        //     "bookmark",
        //     "report_question_answer",
        //     "leaderboard",
        //     "show_rank",
        //     "result_comparision_with_topper",
        //     "leaderboard_total_number_of_entries",
        //     "leaderboard_user_can_apply_multiple_times",
        //     "leaderboard_apply_multiple_number_of_times",
        //     "display_leaderboard_in_quiz_result",
        //     "percent_based_result_text",
        //     "result_text",
        //     // Notification
        //     "admin_email_notification",
        //     "admin_to",
        //     "admin_from",
        //     "admin_subject",
        //     "admin_message",
        //     "student_email_notification",
        //     "student_to",
        //     "student_from",
        //     "student_subject",
        //     "student_message",
        //     "instructor_email_notification",
        //     "instructor_to",
        //     "instructor_from",
        //     "instructor_subject",
        //     "instructor_message",
        //     // Language
        //     "multi_language",
        // ];


        // protected $appends = ['rendered_description', 'rendered_result_text'];

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function scopeOfQuiz($query)
        {
            return $query->where('post_type', self::$postType);
        }
        public function getCategoryAttribute()
        {
            return Category::get_quiz_category($this->ID);
        }
        public function getLanguagesAttribute()
        {
            return Language::get_quiz_languages($this->ID);
        }

        public function prerequisites()
        {
            return null;
        }

        public function getRenderedPostContentAttribute()
        {
            return $this->helper->renderShortCode($this->post_content);
        }


        public function quiz_shortcode()
        {
            return $this->hasOne(QuizShortcode::class, 'quiz_id', 'ID');
        }

        public function metas()
        {
            return $this->hasMany(WpPostMeta::class, 'post_id', 'ID');
        }

        public function getRenderedMetasAttribute()
        {
            $metas = $this->metas;
            if (empty($metas)) {
                return [];
            }
            $keyValueArray = [];

            foreach ($metas as $meta) {
                // Ensure meta_key and meta_value exist in the object
                if (isset($meta['meta_key'], $meta['meta_value'])) {
                    $key = $meta['meta_key'];
                    $value = $meta['meta_value'];

                    // Decode JSON if applicable
                    if (is_string($value) && $decoded = json_decode($value, true)) {
                        $value = $decoded;
                    }

                    $keyValueArray[$key] = $value;
                }
            }
            $renderedMetas = !empty($keyValueArray) && is_array($keyValueArray)
                ? CptHelper::instance()->acadlix_remome_prefix_meta_keys($keyValueArray, 'quiz')
                : [];

            // if(isset($renderedMetas[]))

            return $renderedMetas;
        }

        public function createShuffledArray($number, $preserveLast = false, $ensureDifferent = false)
        {
            $original = range(0, $number - 1);

            // For arrays that are too small to shuffle differently, return the original.
            if ($number <= 1) {
                return $original;
            }
            if ($preserveLast && $number <= 2) {
                // With 2 elements and preserving the last, there's only one possible order.
                return $original;
            }

            // Define a closure for performing the Fisher-Yates shuffle.
            // It shuffles the entire array or only the portion excluding the last element if $preserveLast is true.
            $shuffleFunction = function ($arr, $preserveLast) {
                $n = count($arr);
                if ($preserveLast) {
                    $lastIndex = $n - 1;  // The index of the last element to be preserved.
                    // Shuffle indices 0 to lastIndex - 1
                    for ($i = $lastIndex - 1; $i >= 0; $i--) {
                        $j = mt_rand(0, $i);
                        // Swap the elements at indices $i and $j.
                        $temp = $arr[$i];
                        $arr[$i] = $arr[$j];
                        $arr[$j] = $temp;
                    }
                } else {
                    // Shuffle the entire array.
                    for ($i = $n - 1; $i > 0; $i--) {
                        $j = mt_rand(0, $i);
                        $temp = $arr[$i];
                        $arr[$i] = $arr[$j];
                        $arr[$j] = $temp;
                    }
                }
                return $arr;
            };

            // If we need to ensure the shuffled array is different from the original,
            // use a loop to reshuffle until the two arrays differ or until a max attempt is reached.
            if ($ensureDifferent) {
                $attempt = 0;
                $maxAttempts = 100; // Prevents an infinite loop in edge cases.
                do {
                    $shuffled = $shuffleFunction($original, $preserveLast);
                    $attempt++;
                } while ($shuffled === $original && $attempt < $maxAttempts);
            } else {
                // Otherwise, perform a single shuffle.
                $shuffled = $shuffleFunction($original, $preserveLast);
            }

            return $shuffled;
        }

        public function applyShuffleOrder(array $array = [], array $order = []): array
        {
            $shuffled = [];

            // Iterate through each index provided in the shuffle order.
            foreach ($order as $index) {
                // Check if the index exists in the original array.
                if (array_key_exists($index, $array)) {
                    $shuffled[] = $array[$index];
                } else {
                    // Optionally, handle cases where the index is not valid.
                    // Here, we'll simply skip it.
                    continue;
                }
            }

            return $shuffled;
        }

        public function getRenderedQuestionsAttribute()
        {
            $metas = $this->rendered_metas;
            $show_only_specific_number_of_questions = $metas['quiz_settings']['show_only_specific_number_of_questions'] ?? false;
            $specific_number_of_questions = $metas['quiz_settings']['specific_number_of_questions'] ?? 0;
            $random_question = $metas['quiz_settings']['random_question'] ?? false;
            $sort_by_subject = $metas['quiz_settings']['sort_by_subject'] ?? false;
            // $optional_subject = $metas['quiz_settings']['optional_subject'] ?? false;
            $subject_wise_question = $metas['quiz_settings']['subject_wise_question'] ?? false;
            $random_option = $metas['quiz_settings']['random_option'] ?? false;
            $do_not_randomize_last_option = $metas['quiz_settings']['do_not_randomize_last_option'] ?? false;

            $subject_times = $this->subject_times;
            $questions = Question::
                ofOnline()
                ->where('quiz_id', $this->ID)
                ->when($random_question, fn($query) => $query->inRandomOrder())
                ->get()
            ;
            if ($sort_by_subject) {
                $questions = $questions->sortByDesc(fn($q) => optional($q->subject)->subject_name ?? '')->values();
            }

            if ($subject_wise_question) {
                $newQuestion = [];
                foreach ($subject_times as $subject_time) {
                    $filteredQuestions = $questions->filter(fn($q) => $q->subject_id === $subject_time->subject_id);
                    $newQuestion = [...$newQuestion, ...$filteredQuestions->slice(0, $subject_time->specific_number_of_questions)];
                }
                $questions = $newQuestion;
            } else {
                if ($show_only_specific_number_of_questions) {
                    $questions = $questions->slice(0, $specific_number_of_questions);
                }
            }

            if (count($questions) > 0) {
                foreach ($questions as $question) {
                    $answer_type = $question->answer_type;
                    $question_languages = $question->question_languages;
                    $shuffled_order = [];
                    foreach ($question_languages as $question_language) {
                        if (in_array($answer_type, ['sortingChoice'])) {
                            $value = $question_language->answer_data[$answer_type];
                            if (count($shuffled_order) == 0) {
                                $shuffled_order = $this->createShuffledArray(count($value), false, true);
                            }
                            $answerData = $question_language->answer_data;
                            $answerData[$answer_type] = $this->applyShuffleOrder($value, $shuffled_order);
                            $question_language->answer_data = $answerData;
                        }

                        if (in_array($answer_type, ['singleChoice', 'multipleChoice']) && $random_option) {
                            $value = $question_language->answer_data[$answer_type];
                            if (count($shuffled_order) == 0) {
                                $shuffled_order = $this->createShuffledArray(count($value), $do_not_randomize_last_option, false);
                            }
                            $answerData = $question_language->answer_data;
                            $answerData[$answer_type] = $this->applyShuffleOrder($value, $shuffled_order);
                            $question_language->answer_data = $answerData;
                        }
                    }
                    $question->question_languages = $question_languages;
                }
            }

            return $questions;
        }

        public function getQuestionsAttribute()
        {
            // return $this->hasMany(Question::class, "quiz_id", "ID");
            return Question::ofOnline()->where('quiz_id', $this->ID)->get();
        }

        public function getQuestionsCountAttribute()
        {
            return count($this->questions);
        }

        public function getSubjectTimesAttribute()
        {
            $subjectTime = SubjectTime::where("quiz_id", $this->ID)->get();
            return $subjectTime;
        }

        public function author()
        {
            return $this->belongsTo(WpUsers::class, 'post_author', 'ID');
        }

        public static function insertQuiz(array $data, array $meta = [])
        {
            $data = wp_parse_args($data, [
                'post_title' => '',
                'post_content' => '',
                'post_status' => 'publish',
                'post_type' => self::$postType,
                'post_author' => 1,
            ]);

            // Add meta data to the 'meta_input' argument for wp_insert_post.
            if (!empty($meta)) {
                $data['meta_input'] = $meta;
            }

            // Insert the post and return the ID or WP_Error.
            $postId = wp_insert_post($data);

            return $postId;
        }

        public static function updateQuiz(int $postId, array $data = [], array $meta = [])
        {
            // Parse default arguments for the quiz update.
            $data = wp_parse_args($data, [
                'ID' => $postId,
            ]);

            // Add meta data to the 'meta_input' argument for wp_update_post.
            if (!empty($meta)) {
                $data['meta_input'] = $meta;
            }

            // Update the post and return the result or WP_Error.
            $result = wp_update_post($data, true);

            return $result;
        }

        public static function updateQuizSettings(int $postId, array $settingsToUpdate = [])
        {
            $setting_name = self::$metaPrefix . "quiz_settings";
            // Fetch current quiz_settings
            $quizSettingsSerialized = get_post_meta($postId, $setting_name, true);

            // Unserialize to get an array
            $quizSettings = maybe_unserialize($quizSettingsSerialized);

            // Ensure it's an array before modifying
            if (!is_array($quizSettings)) {
                $quizSettings = [];
            }

            // Update the settings
            foreach ($settingsToUpdate as $key => $value) {
                $quizSettings[$key] = $value;
            }

            // Serialize and save the updated settings
            $updated = update_post_meta($postId, $setting_name, $quizSettings);

            return (bool) $updated;
        }

        public static function deleteQuiz(int $postId)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', __('Invalid post ID or not a quiz post type.', 'acadlix'));
            }

            // Delete post
            $result = wp_delete_post($postId, true);

            if (!$result) {
                return new \WP_Error('delete_failed', __('Failed to delete quiz.', 'acadlix'));
            }

            // Delete Question
            $question = Question::where("quiz_id", $postId)->get();
            foreach ($question as $q) {
                $q->delete();
            }

            // Delete Paragraph
            $paragraph = Paragraph::where("post_parent", $postId)->get();
            foreach ($paragraph as $p) {
                Paragraph::deleteParagraph($p->ID);
            }

            // Delete Statistic
            $statistic_ref = StatisticRef::where("quiz_id", $postId)->get();
            foreach ($statistic_ref as $sr) {
                $sr->delete();
            }

            // Delete Toplist
            $toplist = Toplist::where("quiz_id", $postId)->get();
            foreach ($toplist as $t) {
                $t->delete();
            }

            // Delete User Meta Activity data
            $userMetas = UserActivityMeta::ofQuiz()
                ->where("type_id", $postId)
                ->get();
            foreach ($userMetas as $userMeta) {
                $userMeta->delete();
            }

            // Delete Course Section Content
            $courseSectionContent = new CourseSectionContent();
            $courseSectionContents = $courseSectionContent->getByQuizId($postId);
            if ($courseSectionContents) {
                foreach ($courseSectionContents as $csc) {
                    CourseSectionContent::deleteCourseSectionContent($csc->ID);
                }
            }

            // Delete prerequisite
            Prerequisite::ofTypeQuiz()
                ->where("type_id", $postId)
                ->delete();

            Prerequisite::ofPreRequisiteTypeQuiz()
                ->where("prerequisite_id", $postId)
                ->delete();

            return true;
        }

        public static function assignCategory(int $postId, int|array $categoryIds)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', __('Invalid post ID or not a quiz post type.', 'acadlix'));
            }

            if (!is_array($categoryIds)) {
                $categoryIds = [$categoryIds];
            }

            $categoryIds = array_map('intval', $categoryIds);
            $categoryIds = array_unique($categoryIds);

            $term_taxonomy_ids = wp_set_object_terms($postId, $categoryIds, self::$categoryTaxonomy);
            return $term_taxonomy_ids;
        }

        public static function assignLanguage(int $postId, int|array $languageIds)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', __('Invalid post ID or not a quiz post type.', 'acadlix'));
            }

            if (!is_array($languageIds)) {
                $languageIds = [$languageIds];
            }

            $languageIds = array_map('intval', $languageIds);
            $languageIds = array_unique($languageIds);

            $term_taxonomy_ids = wp_set_object_terms($postId, $languageIds, self::$languageTaxonomy);
            return $term_taxonomy_ids;
        }
    }
}