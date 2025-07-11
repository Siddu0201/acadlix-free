<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

if (!class_exists('Quiz')) {
    class Quiz extends Model
    {
        protected $table;
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

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_wp_prefix('posts'); // Posts table is used for all post types
        }

        public function scopeOfQuiz($query)
        {
            return $query->where('post_type', self::$postType);
        }
        public function getCategoryAttribute()
        {
            return acadlix()->model()->category()->get_quiz_category($this->ID);
        }
        public function getLanguagesAttribute()
        {
            return acadlix()->model()->language()->get_quiz_languages($this->ID);
        }

        public function getRenderedPostContentAttribute()
        {
            return acadlix()->helper()->renderShortCode($this->post_content);
        }


        public function quiz_shortcode()
        {
            return $this->hasOne(acadlix()->model()->quizShortcode(), 'quiz_id', 'ID');
        }

        public function metas()
        {
            return $this->hasMany(acadlix()->model()->wpPostMeta(), 'post_id', 'ID');
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
                ? acadlix()->helper()->cpt()->acadlix_remome_prefix_meta_keys($keyValueArray, 'quiz')
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
            $random_option = $metas['quiz_settings']['random_option'] ?? false;
            $do_not_randomize_last_option = $metas['quiz_settings']['do_not_randomize_last_option'] ?? false;

            $questions = acadlix()->model()->question()->
                ofOnline()
                ->where('quiz_id', $this->ID)
                ->when($random_question, fn($query) => $query->inRandomOrder())
                ->get()
            ;
            if ($sort_by_subject) {
                $questions = $questions->sortByDesc(fn($q) => optional($q->subject)->subject_name ?? '')->values();
            }

            if ($show_only_specific_number_of_questions) {
                $questions = $questions->slice(0, $specific_number_of_questions);
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
            // return $this->hasMany(acadlix()->model()->question(), "quiz_id", "ID");
            return acadlix()->model()->question()->ofOnline()->where('quiz_id', $this->ID)->get();
        }

        public function getQuestionsCountAttribute()
        {
            return count($this->questions);
        }

        public function author()
        {
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'post_author', 'ID');
        }

        public static function insertQuiz(array $data, array $meta = [])
        {
            $data['post_content'] = wp_slash($data['post_content'] ?? "");
            $data = wp_parse_args($data, [
                'post_title' => '',
                'post_content' => '',
                'post_status' => 'publish',
                'post_type' => self::$postType,
                'post_author' => 1,
            ]);

            // Add meta data to the 'meta_input' argument for wp_insert_post.
            if (!empty($meta)) {
                $data['meta_input'] = wp_slash($meta);
            }

            // Insert the post and return the ID or WP_Error.
            $postId = wp_insert_post($data);

            return $postId;
        }

        public static function updateQuiz(int $postId, array $data = [], array $meta = [])
        {
            $data['post_content'] = wp_slash($data['post_content'] ?? "");
            // Parse default arguments for the quiz update.
            $data = wp_parse_args($data, [
                'ID' => $postId,
            ]);
            // return $data;

            // Add meta data to the 'meta_input' argument for wp_update_post.
            if (!empty($meta)) {
                $data['meta_input'] = wp_slash($meta);
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
            $updated = update_post_meta($postId, $setting_name, wp_slash($quizSettings));

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
            acadlix()->model()->question()->where("quiz_id", $postId)->delete();

            // Delete Statistic
            acadlix()->model()->statisticRef()->where("quiz_id", $postId)->delete();

            // Delete Toplist
            acadlix()->model()->toplist()->where("quiz_id", $postId)->delete();

            // Delete User Meta Activity data
            acadlix()->model()->userActivityMeta()->ofQuiz()
                ->where("type_id", $postId)
                ->delete();

            // Delete Course Section Content
            $courseSectionContents = acadlix()->model()->courseSectionContent()->getByQuizId($postId);
            if ($courseSectionContents) {
                foreach ($courseSectionContents as $csc) {
                    acadlix()->model()->courseSectionContent()->deleteCourseSectionContent($csc->ID);
                }
            }

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