<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Models\Paragraph;
use Yuvayana\Acadlix\Models\Prerequisite;
use Yuvayana\Acadlix\Models\Question;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\Category;
use Yuvayana\Acadlix\Models\Language;
use Yuvayana\Acadlix\Models\QuizShortcode;
use Yuvayana\Acadlix\Models\SubjectTime;
use Yuvayana\Acadlix\Models\Template;

defined('ABSPATH') || exit();

class AdminQuizController
{

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-quiz';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quizes'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_quiz'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/create',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_create_quiz'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quiz_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_quiz_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_quiz_by_id'],
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/set-category',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_set_category'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/delete-bulk-quiz',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_bulk_quiz'],
                    'permission_callback' => function (WP_REST_REQUEST $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/get-subject-by-quiz-id',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_subject_by_quiz_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/update-quiz-subject',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_quiz_subject'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/update-add-language-to-quiz',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_add_language_to_quiz'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/update-set-default-language-to-quiz',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_set_default_language_to_quiz'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/delete-language-from-quiz',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'delete_language_from_quiz'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }
    /**
     * @api /admin-quiz
     * @method GET get_quizes()
     * @param [type] $request
     * @return all the quizes in backend with offset
     */
    public function get_quizes($request)
    {
        $res = [];
        $params = $request->get_params();
        $skip = $params['page'] * $params['pageSize'];
        $search = $params['search'];
        $quiz = Quiz::ofQuiz()->whereHas('quiz_shortcode')->orderBy('ID', 'desc');
        // $quiz = Quiz::ofQuiz()->orderBy('ID', 'desc');
        if (!empty($search)) {
            $quiz->where(function ($query) use ($search) {
                $query->where('post_title', 'LIKE', "%{$search}%");
            })
            ->orWhereHas('quiz_shortcode', function ($query) use ($search) {
                $query->where('id', 'LIKE', "%{$search}%"); 
            });
        }
        $res['total'] = $quiz->count();
        $res['quizes'] = $quiz->skip($skip)->take($params['pageSize'])
            ->get(["ID", "post_title"])
            ->each
            ->setAppends(['category', 'questions_count', 'rendered_metas']);
        return rest_ensure_response($res);
    }

    public function get_create_quiz($request)
    {
        $res = [];
        $res['categories'] = Category::all();
        $res['languages'] = Language::all();
        $res['quizzes'] = Quiz::ofQuiz()
            ->without(['author', 'metas'])
            ->get(["ID", "post_title"])
            ->each
            ->setAppends([]);
        $res['templates'] = Template::where("type", "quiz")->get(["id", "name"]);
        return rest_ensure_response($res);
    }

    public function post_create_quiz($request)
    {
        $res = [];
        $params = $request->get_json_params();

        // Validate required fields
        if (empty($params['post_title'])) {
            return new WP_Error(
                'missing_post_title',
                __('Quiz title is required.', 'acadlix'),
                ['status' => 400]
            );
        }


        if (is_null($params['category_id'])) {
            return new WP_Error(
                'missing_post_category',
                __('Quiz category is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (is_array($params['languages']) && count($params['languages']) == 0) {
            return new WP_Error(
                'missing_post_languages',
                __('Quiz language is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
            : [];

        try {
            // create quiz with meta data
            $quizId = Quiz::insertQuiz([
                'post_title' => sanitize_text_field($params['post_title']),
                'post_content' => wp_kses_post($params['post_content']),
                'post_author' => (int) sanitize_text_field($params['post_author']),
                'post_status' => "draft",
            ], $meta);

            if (is_wp_error($quizId) || $quizId == 0) {
                return new WP_Error(
                    'quiz_creation_failed',
                    __('Failed to create the quiz.', 'acadlix'),
                    ['status' => 500]
                );
            }

            // handle category
            $term_id = $params['category_id'];
            $result = Quiz::assignCategory($quizId, $term_id);

            if (is_wp_error($result)) {
                Quiz::deleteQuiz($quizId);
                return new WP_Error(
                    'category_assign_creation_failed',
                    __('Cannot assign category to quiz.', 'acadlix'),
                    ['status' => 500]
                );
            }

            // handle language
            $languages = $params['languages'];

            $result = Quiz::assignLanguage($quizId, $languages);
            if (is_wp_error($result)) {
                Quiz::deleteQuiz($quizId);
                return new WP_Error(
                    'language_assign_creation_failed',
                    __('Cannot assign language to quiz.', 'acadlix'),
                    ['status' => 500]
                );
            }

            // handle prerequisite
            if (is_array($params['prerequisite']) && count($params['prerequisite']) > 0) {
                // enable other quiz statistic
                foreach ($params['prerequisite'] as $key => $prerequisite) {
                    $prerequisite_id = $prerequisite['ID'];
                    if (!$prerequisite_id) {
                        continue;
                    }
                    Prerequisite::create([
                        "type" => "quiz",
                        "type_id" => $quizId,
                        "prerequisite_type" => "quiz",
                        "prerequisite_id" => $prerequisite_id
                    ]);
                    // Quiz::updateQuizSettings(
                    //     $prerequisite_id,
                    //     ["enable_quiz_statistic" => true]
                    // );
                }
            }

            // Retrieve and return the quiz data
            $quiz = get_post($quizId);
            if (!$quiz) {
                Quiz::deleteQuiz($quizId);
                return new WP_Error(
                    'quiz_not_found',
                    __('Created quiz not found.', 'acadlix'),
                    ['status' => 500]
                );
            }else{
                // handle shortcode
                QuizShortcode::create([
                    'quiz_id' => $quizId
                ]);

                wp_update_post([
                    'ID'          => $quizId,
                    'post_status' => 'publish'
                ]);
            }

            $res['quiz'] = $quiz;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }

        // $quiz = Quiz::create($params);
        // $quiz->quiz_languages()->createMany($params['language_data']);
        // $quiz->prerequisites()->createMany($params['prerequisite_data']);
        // $res['quiz'] = $quiz;
        // return rest_ensure_response($res);
    }

    public function get_quiz_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['quiz'] = Quiz::ofQuiz()->find($quiz_id);
        $res['categories'] = Category::all();
        $res['languages'] = Language::all();
        $res['templates'] = Template::where("type", "quiz")->get(["id", "name"]);
        $res['quizzes'] = Quiz::ofQuiz()
            ->without(['author', 'metas'])
            ->whereNot('ID', $quiz_id)
            ->get(["ID", "post_title"])
            ->each
            ->setAppends([]);
        $res['prerequisites'] = Prerequisite::ofTypeQuiz()
            ->ofPrerequisiteTypeQuiz()
            ->where("type_id", $quiz_id)
            ->where("prerequisite_type", "quiz")
            ->get()
            ->each
            ->setAppends(['quiz_title']);
        return rest_ensure_response($res);
    }

    public function update_quiz_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        
        // Validate required fields
        if (empty($params['post_title'])) {
            return new WP_Error(
                'missing_post_title',
                __('Quiz title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (is_null($params['category_id'])) {
            return new WP_Error(
                'missing_post_category',
                __('Quiz category is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (is_array($params['languages']) && count($params['languages']) == 0) {
            return new WP_Error(
                'missing_post_languages',
                __('Quiz language is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
            : [];
        try {
            // create quiz with meta data
            $quizId = Quiz::updateQuiz($quiz_id, [
                'post_title' => sanitize_text_field($params['post_title']),
                'post_content' => wp_kses_post($params['post_content']),
                'post_author' => (int) sanitize_text_field($params['post_author']),
            ], $meta);

            if (is_wp_error($quizId)) {
                return new WP_Error(
                    'quiz_updation_failed',
                    __('Failed to update the quiz.', 'acadlix'),
                    ['status' => 500]
                );
            }

            // handle category
            $term_id = $params['category_id'];
            $result = Quiz::assignCategory($quizId, $term_id);

            if (is_wp_error($result)) {
                return new WP_Error(
                    'category_assign_creation_failed',
                    __('Cannot assign category to quiz.', 'acadlix'),
                    ['status' => 500]
                );
            }

            // handle language
            $languages = $params['languages'];

            $result = Quiz::assignLanguage($quizId, $languages);
            if (is_wp_error($result)) {
                return new WP_Error(
                    'language_assign_creation_failed',
                    __('Cannot assign language to quiz.', 'acadlix'),
                    ['status' => 500]
                );
            }

            // handle prerequisite
            if (is_array($params['prerequisite']) && count($params['prerequisite']) > 0) {
                // enable other quiz statistic
                foreach ($params['prerequisite'] as $key => $prerequisite) {
                    $prerequisite_id = $prerequisite['ID'];
                    if (!$prerequisite_id) {
                        continue;
                    }
                    $prerequisite = Prerequisite::ofTypeQuiz()
                                                ->ofPrerequisiteTypeQuiz()
                                                ->where("type_id", $quizId)
                                                ->where("prerequisite_id", $prerequisite_id)
                                                ->first();
                    if(!$prerequisite) {
                        Prerequisite::create([
                            "type" => "quiz",
                            "type_id" => $quizId,
                            "prerequisite_type" => "quiz",
                            "prerequisite_id" => $prerequisite_id
                        ]);
                    }
                    // Quiz::updateQuizSettings(
                    //     $prerequisite_id,
                    //     ["enable_quiz_statistic" => true]
                    // );
                }
            }
            // delete if not available
            $rowToDelete = Prerequisite::ofTypeQuiz()
                                ->ofPrerequisiteTypeQuiz()
                                ->where("type_id", $quizId)
                                ->whereNotIn('prerequisite_id', array_column($params['prerequisite'], 'ID'))->pluck('id');
            Prerequisite::whereIn('id', $rowToDelete)->delete();

            // Retrieve and return the quiz data
            $quiz = get_post($quizId);
            if (!$quiz) {
                return new WP_Error(
                    'quiz_not_found',
                    __('Created quiz not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['quiz'] = $quiz;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }


        // $quiz = Quiz::find($quiz_id);
        // $quiz->update($params);
        // foreach ($params['language_data'] as $lang) {
        //     $quiz->quiz_languages()->updateOrCreate(
        //         ['language_id' => $lang['language_id']],
        //         $lang
        //     );
        // }
        // $rowToDelete = $quiz->quiz_languages()->whereNotIn('language_id', array_column($params['language_data'], 'language_id'))->pluck('id');
        // $quiz->quiz_languages()->whereIn('id', $rowToDelete)->delete();

        // foreach ($params['prerequisite_data'] as $pre) {
        //     $quiz->prerequisites()->updateOrCreate(
        //         ['prerequisite_quiz_id' => $pre['prerequisite_quiz_id']],
        //         $pre
        //     );
        //     $prerequisite_quiz = Quiz::find($pre['prerequisite_quiz_id']);
        //     $prerequisite_quiz->update([
        //         'enable_login_register' => true,
        //         'login_register_type' => "at_start_of_quiz",
        //         'save_statistic' => true,
        //     ]);
        // }
        // $rowToDelete = $quiz->prerequisites()->whereNotIn('prerequisite_quiz_id', array_column($params['prerequisite_data'], 'prerequisite_quiz_id'))->pluck('id');
        // $quiz->prerequisites()->whereIn('id', $rowToDelete)->delete();
        // return rest_ensure_response($res);
    }

    public function delete_quiz_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $quiz = Quiz::deleteQuiz($quiz_id);
        $res['quiz'] = $quiz;
        return rest_ensure_response($res);
    }

    public function delete_bulk_quiz($request)
    {
        $res = [];
        $params = $request->get_json_params();

        if (empty($params['quiz_ids']) && count($params['quiz_ids']) == 0) {
            return new WP_Error(
                'missing_quiz_ids',
                __('Quiz ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        foreach ($params['quiz_ids'] as $quiz_id) {
            Quiz::deleteQuiz($quiz_id);
        }
        return rest_ensure_response($res);
    }

    public function post_set_category($request)
    {
        $res = [];
        $params = $request->get_json_params();

        if (empty($params['quiz_ids']) && count($params['quiz_ids']) == 0) {
            return new WP_Error(
                'missing_quiz_ids',
                __('Quiz ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (is_null($params['category_id'])) {
            return new WP_Error(
                'missing_post_category',
                __('Quiz category is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        try {
            foreach ($params['quiz_ids'] as $quiz_id) {
                $result = Quiz::assignCategory($quiz_id, $params['category_id']);
                if (is_wp_error($result)) {
                    return new WP_Error(
                        'category_assign_creation_failed',
                        __('Cannot assign category to quiz.', 'acadlix'),
                        ['status' => 500]
                    );
                }
            }
            return rest_ensure_response($res);
        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }

    }

    public function get_subject_by_quiz_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $res['quiz'] = Quiz::ofQuiz()->find($quiz_id);
        $questions = Question::where('online', 1)->where('quiz_id', $quiz_id)->get();
        $grouped = $questions->groupBy('subject_id')->map(function ($group) use ($quiz_id) {
            return [
                'subject_id' => $group->first()->subject_id,
                'number_of_question' => $group->count(),
                'subject_name' => $group->first()->subject->subject_name ?? "Uncategorized",
                'time' => SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $group->first()->subject_id)->first()->time ?? 0,
                'specific_number_of_questions' => SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $group->first()->subject_id)->first()->specific_number_of_questions ?? $group->count(),
                'optional' => SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $group->first()->subject_id)->first()->optional ?? 0,
            ];
        })->values();
        $res['subjects'] = $grouped->toArray();
        return rest_ensure_response($res);
    }

    public function update_quiz_subject($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $quiz_id = $params['quiz_id'];

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $quiz = Quiz::ofQuiz()->find($quiz_id);
        if ($quiz) {
            Quiz::updateQuizSettings(
                $quiz_id,
                [
                    'quiz_timing_type' => $params['quiz_timing_type'] ?: $quiz['rendered_metas']['quiz_settings']['quiz_timing_type'] ?: "full_quiz_time",
                    'subject_wise_question' => $params['subject_wise_question'],
                    'optional_subject' => $params['optional_subject']
                ]
            );
        }
        foreach ($params['subjects'] as $subject) {
            $subject_time = SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $subject['subject_id'])->first();
            if ($subject_time) {
                $subject_time->update([
                    'time' => $subject['time'],
                    'specific_number_of_questions' => $subject['specific_number_of_questions'],
                    'optional' => $params['optional_subject'] ? $subject['optional'] : 0,
                ]);
            } else {
                SubjectTime::create([
                    'quiz_id' => $quiz_id,
                    'subject_id' => $subject['subject_id'],
                    'time' => $subject['time'],
                    'specific_number_of_questions' => $subject['specific_number_of_questions'],
                    'optional' => $params['optional_subject'] ? $subject['optional'] : 0,
                ]);
            }
        }
        return rest_ensure_response($res);
    }

    public function update_add_language_to_quiz($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $quiz_id = $request['quiz_id'];
        $language_id = $params['language_id'];
        $copy_default_language = $params['copy_default_language'];

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($language_id)) {
            return new WP_Error(
                'missing_language_id',
                __('Language id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($params['languages']) && count($params['languages']) == 0) {
            return new WP_Error(
                'missing_languages',
                __('Languages are required.', 'acadlix'),
                ['status' => 400]
            );
        }
        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
            : [];

        try {
            // update quiz language data
            $quizId = Quiz::updateQuiz($quiz_id, [], $meta);
            if (is_wp_error($quizId)) {
                return new WP_Error(
                    'quiz_updation_failed',
                    __('Failed to update the quiz.', 'acadlix'),
                    ['status' => 500, 'error' => $quizId->get_error_message()]
                );
            }

            $quizId = Quiz::assignLanguage($quiz_id, $params['languages']);
            if (is_wp_error($quizId)) {
                return new WP_Error(
                    'quiz_updation_failed',
                    __('Failed to update the quiz.', 'acadlix'),
                    ['status' => 500, 'error' => $quizId->get_error_message()]
                );
            }

            // update langauge to question
            $question = Question::where('quiz_id', $quiz_id)->get();
            if ($question->count() > 0) {
                foreach ($question as $q) {
                    $q->createNewLanguage($language_id, $copy_default_language);
                }
            }

            // update language to paragraph
            $paragraph = Paragraph::ofParagraph()->where("post_parent", $quiz_id)->get();
            if ($paragraph->count() > 0) {
                foreach ($paragraph as $p) {
                    return $p->createNewLanguage($language_id, $copy_default_language);
                }
            }

            $res['message'] = __("Language added successfully", "acadlix");
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }


    }

    public function update_set_default_language_to_quiz($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $quiz_id = $request['quiz_id'];
        $language_id = $params['language_id'];

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($language_id)) {
            return new WP_Error(
                'missing_language_id',
                __('Language id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
            : [];
        try {
            // update quiz language data
            $quizId = Quiz::updateQuiz($quiz_id, [], $meta);
            if (is_wp_error($quizId)) {
                return new WP_Error(
                    'quiz_updation_failed',
                    __('Failed to update the quiz.', 'acadlix'),
                    ['status' => 500, 'error' => $quizId->get_error_message()]
                );
            }

            // update langauge to question
            $question = Question::where('quiz_id', $quiz_id)->get();
            if ($question->count() > 0) {
                foreach ($question as $q) {
                    $q->question_languages()->where('default', 1)->update(['default' => 0]);
                    $q->question_languages()->where('language_id', $language_id)->update(['default' => 1]);
                }
            }

            // update language to paragraph
            $paragraph = Paragraph::ofParagraph()->where("post_parent", $quiz_id)->get();
            if ($paragraph->count() > 0) {
                foreach ($paragraph as $p) {
                    $p->setDefaultLanguage($language_id);
                }
            }

            $res['message'] = __("Default language set successfully", "acadlix");
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function delete_language_from_quiz($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $quiz_id = $request['quiz_id'];
        $language_id = $params['language_id'];

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($language_id)) {
            return new WP_Error(
                'missing_language_id',
                __('Language id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($params['languages']) && count($params['languages']) == 0) {
            return new WP_Error(
                'missing_languages',
                __('Languages are required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
            : [];
        try {
            // update quiz language data
            $quizId = Quiz::updateQuiz($quiz_id, [], $meta);
            if (is_wp_error($quizId)) {
                return new WP_Error(
                    'quiz_updation_failed',
                    __('Failed to update the quiz.', 'acadlix'),
                    ['status' => 500, 'error' => $quizId->get_error_message()]
                );
            }

            $quizId = Quiz::assignLanguage($quiz_id, $params['languages']);
            if (is_wp_error($quizId)) {
                return new WP_Error(
                    'quiz_updation_failed',
                    __('Failed to update the quiz.', 'acadlix'),
                    ['status' => 500, 'error' => $quizId->get_error_message()]
                );
            }

            // remove question with language id
            $question = Question::where('quiz_id', $quiz_id)->get();
            if ($question->count() > 0) {
                foreach ($question as $q) {
                    $q->question_languages()->where('language_id', $language_id)->delete();
                }
            }

            // remove paragraph with language id
            $paragraph = Paragraph::ofParagraph()->where("post_parent", $quiz_id)->get();
            if ($paragraph->count() > 0) {
                foreach ($paragraph as $p) {
                    $p->deleteLanguageParagraph($language_id);
                }
            }

            $res['message'] = __("Language removed successfully", "acadlix");
            return rest_ensure_response($res);
        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }

    }
    public function check_permission()
    {
        return true;
    }
}
