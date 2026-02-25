<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

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
          'permission_callback' => function () {
            return current_user_can('acadlix_show_quiz');
          },
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_create_quiz'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_quiz');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_add_quiz');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_quiz');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_quiz');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_quiz');
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
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_set_category_quiz');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/export',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'post_export_quiz'],
          'permission_callback' => function () {
            return current_user_can('acadlix_import_export_json_quiz');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/import',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'post_import_quiz'],
          'permission_callback' => function () {
            return current_user_can('acadlix_import_export_json_quiz');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_delete_quiz');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_add_edit_language_to_quiz');
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
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/update-set-default-language-to-quiz',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_set_default_language_to_quiz'],
          'permission_callback' => function () {
            return current_user_can('acadlix_set_default_quiz_language');
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
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/delete-language-from-quiz',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'delete_language_from_quiz'],
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_language_from_quiz');
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
  }

  /**
   * @api /admin-quiz
   * @method GET get_quizes()
   * @param [type] $request
   * @return all the quizes in backend with offset
   */
  public function get_quizes($request)
  {
    global $wpdb;
    $res = [];
    $params = $request->get_params();
    $skip = $params['page'] * $params['pageSize'];
    $search = $params['search'];
    $quiz = acadlix()
      ->model()
      ->quiz()
      ->ofQuiz()
      ->whereHas('quiz_shortcode')
      ->orderBy('ID', 'desc');
    if (!empty($search)) {
      $quiz->where(function ($query) use ($search, $wpdb) {
        $query
          ->where('post_title', 'LIKE', "%{$search}%")
          ->orWhereHas('quiz_shortcode', function ($query) use ($search) {
            $query->where('id', 'LIKE', "%{$search}%");
          })
          ->orWhereIn('ID', function ($sub) use ($wpdb, $search) {
            $sub
              ->select('tr.object_id')
              ->from("{$wpdb->term_relationships} as tr")
              ->join("{$wpdb->term_taxonomy} as tt", 'tr.term_taxonomy_id', '=', 'tt.term_taxonomy_id')
              ->join("{$wpdb->terms} as t", 'tt.term_id', '=', 't.term_id')
              ->where('tt.taxonomy', '=', ACADLIX_QUIZ_CATEGORY_TAXONOMY)
              ->where(function ($q) use ($search) {
                $q
                  ->where('t.name', 'LIKE', "%{$search}%");
              });
          });
      });
    }
    $res['total'] = $quiz->count();
    $res['quizes'] = $quiz
      ->skip($skip)
      ->take($params['pageSize'])
      ->get(['ID', 'post_title', 'post_author'])
      ->each
      ->setAppends([
        'category',
        'questions_count',
        'rendered_metas'
      ]);
    return rest_ensure_response($res);
  }

  public function get_create_quiz($request)
  {
    $res = [];
    $res['categories'] = acadlix()->model()->category()->all();
    $res['languages'] = acadlix()->model()->language()->all();
    $res['quizzes'] = acadlix()
      ->model()
      ->quiz()
      ->ofQuiz()
      ->without(['author', 'metas'])
      ->whereHas('quiz_shortcode')
      ->orderBy('ID', 'desc')
      ->get(['ID', 'post_title'])
      ->each
      ->setAppends([]);
    $res['templates'] = acadlix()->model()->template()->where('type', 'quiz')->get(['id', 'name']);
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
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
      : [];

    try {
      // create quiz with meta data
      $quizId = acadlix()->model()->quiz()->insertQuiz([
        'post_title' => $params['post_title'],
        'post_content' => $params['post_content'],
        'post_author' => (int) $params['post_author'],
        'post_status' => 'draft',
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
      $result = acadlix()->model()->quiz()->assignCategory($quizId, $term_id);

      if (is_wp_error($result)) {
        acadlix()->model()->quiz()->deleteQuiz($quizId);
        return new WP_Error(
          'category_assign_creation_failed',
          __('Cannot assign category to quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      // handle language
      $languages = $params['languages'];

      $result = acadlix()->model()->quiz()->assignLanguage($quizId, $languages);
      if (is_wp_error($result)) {
        acadlix()->model()->quiz()->deleteQuiz($quizId);
        return new WP_Error(
          'language_assign_creation_failed',
          __('Cannot assign language to quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      // Retrieve and return the quiz data
      $quiz = get_post($quizId);
      if (!$quiz) {
        acadlix()->model()->quiz()->deleteQuiz($quizId);
        return new WP_Error(
          'quiz_not_found',
          __('Created quiz not found.', 'acadlix'),
          ['status' => 500]
        );
      } else {
        // handle shortcode
        acadlix()->model()->quizShortcode()->create([
          'quiz_id' => $quizId
        ]);

        wp_update_post([
          'ID' => $quizId,
          'post_status' => 'publish'
        ]);
      }
      $res['quizId'] = $quizId;
      $res['quiz'] = $quiz;
      return rest_ensure_response($res);
    } catch (Exception $e) {
      return new WP_Error(
        'exception_occurred',
        $e->getMessage(),
        ['status' => 500]
      );
    }
  }

  public function get_quiz_by_id($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
    $res['categories'] = acadlix()->model()->category()->all();
    $res['languages'] = acadlix()->model()->language()->all();
    $res['templates'] = acadlix()->model()->template()->where('type', 'quiz')->get(['id', 'name']);
    $res['quizzes'] = acadlix()
      ->model()
      ->quiz()
      ->ofQuiz()
      ->without(['author', 'metas'])
      ->whereHas('quiz_shortcode')
      ->whereNot('ID', $quiz_id)
      ->orderBy('ID', 'desc')
      ->get(['ID', 'post_title'])
      ->each
      ->setAppends([]);
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
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
      : [];
    try {
      // create quiz with meta data
      $quizId = acadlix()->model()->quiz()->updateQuiz($quiz_id, [
        'post_title' => $params['post_title'],
        'post_content' => $params['post_content'],
        'post_author' => (int) $params['post_author'],
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
      $result = acadlix()->model()->quiz()->assignCategory($quizId, $term_id);

      if (is_wp_error($result)) {
        return new WP_Error(
          'category_assign_creation_failed',
          __('Cannot assign category to quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      // handle language
      $languages = $params['languages'];

      $result = acadlix()->model()->quiz()->assignLanguage($quizId, $languages);
      if (is_wp_error($result)) {
        return new WP_Error(
          'language_assign_creation_failed',
          __('Cannot assign language to quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      // Retrieve and return the quiz data
      $quiz = get_post($quizId);
      if (!$quiz) {
        return new WP_Error(
          'quiz_not_found',
          __('Created quiz not found.', 'acadlix'),
          ['status' => 500]
        );
      }
      $quiz = acadlix()->model()->quiz()->ofQuiz()->find($quizId);

      $res['quiz'] = $quiz;
      return rest_ensure_response($res);
    } catch (Exception $e) {
      return new WP_Error(
        'exception_occurred',
        $e->getMessage(),
        ['status' => 500]
      );
    }
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

    $quiz = acadlix()->model()->quiz()->deleteQuiz($quiz_id);
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
      acadlix()->model()->quiz()->deleteQuiz($quiz_id);
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
        $result = acadlix()->model()->quiz()->assignCategory($quiz_id, $params['category_id']);
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

  public function post_export_quiz($request)
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

    $quizzes = acadlix()
      ->model()
      ->quiz()
      ->ofQuiz()
      ->with([
        'questions'
      ])
      ->whereIn('ID', $params['quiz_ids'])
      ->get();

    $res['quizzes'] = $quizzes;
    return rest_ensure_response($res);

  }

  public function post_import_quiz($request)
  {
    $res = [];
    $params = $request->get_json_params();

    if (empty($params['quizzes']) && count($params['quizzes']) == 0) {
      return new WP_Error(
        'missing_quizzes',
        __('Quizzes data is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    foreach ($params['quizzes'] as $quizData) {
      $meta = !empty($quizData['rendered_metas']) && is_array($quizData['rendered_metas'])
        ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($quizData['rendered_metas'], 'quiz')
        : [];

      // create quiz with meta data
      $quizId = acadlix()->model()->quiz()->insertQuiz([
        'post_title' => $quizData['post_title'],
        'post_content' => $quizData['post_content'],
        'post_author' => (int) $quizData['post_author'],
        'post_status' => 'draft',
      ], $meta);

      if (is_wp_error($quizId) || $quizId == 0) {
        return new WP_Error(
          'quiz_creation_failed',
          __('Failed to create the quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      // handle category
      $term = $quizData['category']['name'];
      $term_id = acadlix()->model()->category()->findOrCreateByName($term);
      $result = acadlix()->model()->quiz()->assignCategory($quizId, $term_id);
      error_log("category assign");
      if (is_wp_error($result)) {
        acadlix()->model()->quiz()->deleteQuiz($quizId);
        return new WP_Error(
          'category_assign_creation_failed',
          __('Cannot assign category to quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      // handle language
      $languages = array_map(function ($language) {
        $term_id = acadlix()->model()->language()->findOrCreateByName($language['name']);
        return $term_id;
      }, $quizData['languages']);
      $result = acadlix()->model()->quiz()->assignLanguage($quizId, $languages);
      if (is_wp_error($result)) {
        acadlix()->model()->quiz()->deleteQuiz($quizId);
        return new WP_Error(
          'language_assign_creation_failed',
          __('Cannot assign language to quiz.', 'acadlix'),
          ['status' => 500]
        );
      }

      error_log("language assign");

      // Retrieve and return the quiz data
      $quiz = get_post($quizId);
      if (!$quiz) {
        acadlix()->model()->quiz()->deleteQuiz($quizId);
        return new WP_Error(
          'quiz_not_found',
          __('Created quiz not found.', 'acadlix'),
          ['status' => 500]
        );
      }
      // handle shortcode
      acadlix()->model()->quizShortcode()->create([
        'quiz_id' => $quizId
      ]);

      wp_update_post([
        'ID' => $quizId,
        'post_status' => 'publish'
      ]);

      if (count($quizData['questions']) > 0) {
        $sort = acadlix()->model()->question()->where('quiz_id', $quizId)->max('sort');
        foreach ($quizData['questions'] as $questionData) {
          $subject_term_id = acadlix()->model()->subject()->findOrCreateByName($questionData['subject']['subject_name']);
          $question = acadlix()->model()->question()->create([
            "quiz_id" => $quizId,
            "subject_id" => $subject_term_id,
            "difficulty_level" => $questionData['difficulty_level'],
            "online" => $questionData['online'],
            "sort" => $sort + 1,
            "title" => $questionData['title'],
            "points" => $questionData['points'],
            "negative_points" => $questionData['negative_points'],
            "different_points_for_each_answer" => $questionData['different_points_for_each_answer'],
            "different_incorrect_msg" => $questionData['different_incorrect_msg'],
            "hint_enabled" => $questionData['hint_enabled'],
            "paragraph_enabled" => $questionData['paragraph_enabled'],
            "paragraph_id" => $questionData['paragraph_id'],
            "answer_type" => $questionData['answer_type'],
            "meta" => $questionData['meta'],
          ]);
          if (count($questionData['question_languages']) > 0) {
            foreach ($questionData['question_languages'] as $ql) {
              $language_id = acadlix()->model()->language()->findOrCreateByName($ql['language']['name']);
              $question->question_languages()->create([
                'language_id' => $language_id,
                'default' => $ql['default'],
                'question' => $ql['question'],
                'correct_msg' => $ql['correct_msg'],
                'incorrect_msg' => $ql['incorrect_msg'],
                'hint_msg' => $ql['hint_msg'],
                'answer_data' => $ql['answer_data'],
                'meta' => $ql['meta'],
              ]);
            }
          }
        }
      }
    }
    $res['message'] = __('Quizzes imported successfully', 'acadlix');
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
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
      : [];

    try {
      // update quiz language data
      $quizId = acadlix()->model()->quiz()->updateQuiz($quiz_id, [], $meta);
      if (is_wp_error($quizId)) {
        return new WP_Error(
          'quiz_updation_failed',
          __('Failed to update the quiz.', 'acadlix'),
          ['status' => 500, 'error' => $quizId->get_error_message()]
        );
      }

      $quizId = acadlix()->model()->quiz()->assignLanguage($quiz_id, $params['languages']);
      if (is_wp_error($quizId)) {
        return new WP_Error(
          'quiz_updation_failed',
          __('Failed to update the quiz.', 'acadlix'),
          ['status' => 500, 'error' => $quizId->get_error_message()]
        );
      }

      // update langauge to question
      $question = acadlix()->model()->question()->where('quiz_id', $quiz_id)->get();
      if ($question->count() > 0) {
        foreach ($question as $q) {
          $q->createNewLanguage($language_id, $copy_default_language);
        }
      }

      $res['message'] = __('Language added successfully', 'acadlix');
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
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
      : [];
    try {
      // update quiz language data
      $quizId = acadlix()->model()->quiz()->updateQuiz($quiz_id, [], $meta);
      if (is_wp_error($quizId)) {
        return new WP_Error(
          'quiz_updation_failed',
          __('Failed to update the quiz.', 'acadlix'),
          ['status' => 500, 'error' => $quizId->get_error_message()]
        );
      }

      // update langauge to question
      $question = acadlix()->model()->question()->where('quiz_id', $quiz_id)->get();
      if ($question->count() > 0) {
        foreach ($question as $q) {
          $q->question_languages()->where('default', 1)->update(['default' => 0]);
          $q->question_languages()->where('language_id', $language_id)->update(['default' => 1]);
        }
      }

      $res['message'] = __('Default language set successfully', 'acadlix');
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
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'quiz')
      : [];
    try {
      // update quiz language data
      $quizId = acadlix()->model()->quiz()->updateQuiz($quiz_id, [], $meta);
      if (is_wp_error($quizId)) {
        return new WP_Error(
          'quiz_updation_failed',
          __('Failed to update the quiz.', 'acadlix'),
          ['status' => 500, 'error' => $quizId->get_error_message()]
        );
      }

      $quizId = acadlix()->model()->quiz()->assignLanguage($quiz_id, $params['languages']);
      if (is_wp_error($quizId)) {
        return new WP_Error(
          'quiz_updation_failed',
          __('Failed to update the quiz.', 'acadlix'),
          ['status' => 500, 'error' => $quizId->get_error_message()]
        );
      }

      // remove question with language id
      $question = acadlix()->model()->question()->where('quiz_id', $quiz_id)->get();
      if ($question->count() > 0) {
        foreach ($question as $q) {
          $q->question_languages()->where('language_id', $language_id)->delete();
        }
      }

      $res['message'] = __('Language removed successfully', 'acadlix');
      return rest_ensure_response($res);
    } catch (Exception $e) {
      return new WP_Error(
        'exception_occurred',
        $e->getMessage(),
        ['status' => 500]
      );
    }
  }
}
