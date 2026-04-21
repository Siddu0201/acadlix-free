<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
defined('ABSPATH') || exit();

class AdminQuestionController
{

  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-quiz';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_quiz_questions'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_question');
          },
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_create_quiz_question'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_question');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/create',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_create_quiz_question'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_question');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/(?P<question_id>[\d]+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_quiz_question_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_question');
          },
          'args' => array(
            'quiz_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
            'question_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_quiz_question_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_question');
          },
          'args' => array(
            'quiz_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
            'question_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_quiz_question_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_question');
          },
          'args' => array(
            'quiz_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
            'question_id' => array(
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
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/set-subject-and-point',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'post_set_subject_and_point'],
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_set_subject_and_point_question');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/delete-bulk-question',
      [
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_bulk_question'],
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_delete_question');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/by-ids',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_question_by_ids'],
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_question_validate_ai_model');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/ai/bulk-update',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_ai_questions'],
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_question_validate_ai_model');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/ai/upload-questions',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'upload_ai_questions'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_question_with_ai');
          },
        ],
      ]
    );
  }

  public function get_quiz_questions($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    $params = $request->get_params();
    $skip = $params['page'] * $params['pageSize'];
    $search = $params['search'];
    $question = acadlix()->model()->question()
      ->ofOnline()
      ->where('quiz_id', $quiz_id)
      ->orderBy("sort");
    if (!empty($search)) {
      $question->where(function ($query) use ($search) {
        $query->where('title', 'LIKE', "%{$search}%")
          ->orWhereHas('question_languages', function ($query) use ($search) {
            $query->where('question', 'LIKE', "%{$search}%");
          })
          ->orWhereHas('subject', function ($s) use ($search) {
            $s->where('subject_name', 'like', "%{$search}%");
          });
      });
    }
    $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
    $res['total'] = $question->count();
    $res['questions'] = $question->skip($skip)->take($params['pageSize'])->get();
    return rest_ensure_response($res);
  }

  public function get_create_quiz_question($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    $res['subjects'] = acadlix()->model()->subject()->get();
    $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
    $res['all_question_count'] = acadlix()->model()->question()->where('quiz_id', $quiz_id)->count();
    return rest_ensure_response($res);
  }

  public function post_create_quiz_question($request)
  {
    $res = [];
    $params = $request->get_json_params();
    $question = acadlix()->model()->question()->create($params);
    $question->question_languages()->createMany($params['language']);
    $res['question'] = $question;
    return rest_ensure_response($res);
  }

  public function get_quiz_question_by_id($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    $question_id = $request['question_id'];
    $res['question'] = acadlix()->model()->question()->find($question_id);
    $res['subjects'] = acadlix()->model()->subject()->get();
    $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
    return rest_ensure_response($res);
  }

  public function update_quiz_question_by_id($request)
  {
    $res = [];
    $question_id = $request['question_id'];
    $params = $request->get_json_params();

    if (empty($question_id)) {
      return new WP_Error(
        'missing_question_id',
        __('Question id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    if (is_array($params['language']) && count($params['language']) == 0) {
      return new WP_Error(
        'missing_question_languages',
        __('Question language is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $question = acadlix()->model()->question()->find($question_id);
    $question->update($params);

    foreach ($params['language'] as $lang) {
      $question->question_languages()->updateOrCreate(
        ['language_id' => $lang['language_id']],
        $lang
      );
    }
    $res = $question;
    return rest_ensure_response($res);
  }

  public function delete_quiz_question_by_id($request)
  {
    $res = [];
    $question_id = $request['question_id'];
    $question = acadlix()->model()->question()->find($question_id);
    $question->update(['online' => 0]);
    $res = $question;
    return rest_ensure_response($res);
  }

  public function post_set_subject_and_point($request)
  {
    $res = [];
    $params = $request->get_json_params();
    if (is_array($params['question_ids']) && count($params['question_ids']) == 0) {
      return new WP_Error(
        'missing_question_ids',
        __('Question ids is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    foreach ($params['question_ids'] as $question_id) {
      $question = acadlix()->model()->question()->find($question_id);
      $question->update([
        'subject_id' => !empty($params['subject_id']) ? $params['subject_id'] : $question->subject_id,
        'points' => !empty($params['points']) ? $params['points'] : $question->points,
        'negative_points' => $params['negative_points'] != "" ? (float) $params['negative_points'] : $question->negative_points,
        'difficulty_level' => !empty($params['difficulty_level']) ? $params['difficulty_level'] : $question->difficulty_level,
      ]);
    }
    return rest_ensure_response($res);
  }

  public function delete_bulk_question($request)
  {
    $res = [];
    $params = $request->get_json_params();
    if (is_array($params['question_ids']) && count($params['question_ids']) == 0) {
      return new WP_Error(
        'missing_question_ids',
        __('Question ids is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    if (count($params['question_ids']) > 0) {
      foreach ($params['question_ids'] as $question_id) {
        $question = acadlix()->model()->question()->find($question_id);
        $question->update(['online' => 0]);
      }
    }
    return rest_ensure_response($res);
  }

  public function get_question_by_ids($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    // Accept question_ids from query params (GET) and fallback to JSON body
    $question_ids = $request->get_param('question_ids');
    if ($question_ids === null) {
      $bodyParams = $request->get_json_params();
      $question_ids = $bodyParams['question_ids'] ?? null;
    }

    if (empty($quiz_id)) {
      return new WP_Error(
        'missing_quiz_id',
        __('Quiz id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    // Normalize and validate question ids
    $question_ids = array_values(array_filter((array) $question_ids, 'is_numeric'));
    $question_ids = array_map('intval', $question_ids);

    if (empty($question_ids)) {
      return new WP_Error(
        'missing_question_ids',
        __('Question ids is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    $questions = acadlix()
      ->model()
      ->question()
      ->ofOnline()
      ->where('quiz_id', $quiz_id)
      ->whereIn('id', $question_ids)
      ->with([
        'question_languages',
      ])
      ->get();

    $res['questions'] = $questions;
    return rest_ensure_response($res);
  }

  public function update_ai_questions($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    $params = $request->get_json_params();
    $questions = $params['questions'];

    if (empty($quiz_id)) {
      return new WP_Error(
        'missing_quiz_id',
        __('Quiz id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    if (empty($questions) || !is_array($questions)) {
      return new WP_Error(
        'missing_questions',
        __('Questions are required for AI validation.', 'acadlix'),
        ['status' => 400]
      );
    }

    $updatedCount = 0;
    foreach ($questions as $question) {
      $qs = acadlix()->model()->question()->find($question['id']);
      if (!$qs) {
        continue; // skip invalid question id
      }
      if (is_array($question['question_languages']) && count($question['question_languages']) > 0) {
        foreach ($question['question_languages'] as $lang) {
          $ql = acadlix()->model()->questionLang()->find($lang['id']);
          if ($ql) {
            $ql->update([
              'question' => $lang['question'] ?? $ql->question,
              'correct_msg' => $lang['correct_msg'] ?? $ql->correct_msg,
              'incorrect_msg' => $lang['incorrect_msg'] ?? $ql->incorrect_msg,
              'hint_msg' => $lang['hint_msg'] ?? $ql->hint_msg,
              'answer_data' => $lang['answer_data'] ?? $ql->answer_data,
            ]);
            $updatedCount++;
          }
        }
      }
    }

    $res['message'] = sprintf(
      /* translators: %d: number of questions updated */
      _n(
        '%d question updated with AI validation.',
        '%d questions updated with AI validation.',
        $updatedCount,
        'acadlix'
      ),
      $updatedCount
    );

    return rest_ensure_response($res);
  }

  public function upload_ai_questions($request)
  {
    $res = [];
    $quiz_id = $request['quiz_id'];
    $params = $request->get_json_params();
    $questions = $params['questions'];

    if (empty($quiz_id)) {
      return new WP_Error(
        'missing_quiz_id',
        __('Quiz id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    if (empty($questions) || !is_array($questions)) {
      return new WP_Error(
        'missing_questions',
        __('Questions are required for AI upload.', 'acadlix'),
        ['status' => 400]
      );
    }


    foreach ($questions as $question) {
      $sort = acadlix()->model()->question()->where('quiz_id', $quiz_id)->latest('sort')->value('sort') ?? 0;
      $newQuestion = acadlix()->model()->question()->create([
        "sort" => $sort + 1,
        "different_incorrect_msg" => $question['different_incorrect_msg'] ?? 0,
        "hint_enabled" => $question['hint_enabled'] ?? 0,
        "answer_type" => $question['answer_type'] ?? 'singleChoice',
        'quiz_id' => $quiz_id,
        'subject_id' => $question['subject_id'] ?? null,
        'difficulty_level' => $question['difficulty_level'] ?? null,
        'online' => 1,
        'points' => $question['points'] ?? 1,
        'negative_points' => $question['negative_points'] ?? 0,
      ]);

      if (is_wp_error($newQuestion)) {
        continue; // skip failed question
      }

      if (is_array($question['question_languages']) && count($question['question_languages']) > 0) {
        foreach ($question['question_languages'] as $lang) {
          acadlix()->model()->questionLang()->create([
            'question_id' => $newQuestion->id,
            'language_id' => $lang['language_id'] ?? null,
            'default' => $lang['default'] ?? true,
            'question' => $lang['question'] ?? '',
            'correct_msg' => $lang['correct_msg'] ?? '',
            'incorrect_msg' => $lang['incorrect_msg'] ?? '',
            'hint_msg' => $lang['hint_msg'] ?? '',
            'answer_data' => $lang['answer_data'] ?? '',
          ]);
        }
      }
    }

    $res['questions'] = $questions;
    return rest_ensure_response($res);
  }
}
