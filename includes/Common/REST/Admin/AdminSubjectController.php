<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

defined('ABSPATH') || exit();

class AdminSubjectController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-subject';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_subjects'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_subject');
          },
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_create_subject'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_subject');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<subject_id>[\d]+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_subject_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_subject');
          },
          'args' => array(
            'subject_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_subject_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_subject');
          },
          'args' => array(
            'subject_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_subject_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_subject');
          },
          'args' => array(
            'subject_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
      ]
    );
  }

  public function get_subjects($request)
  {
    $res = [];
    $res['subjects'] = acadlix()->model()->subject()->get();
    return rest_ensure_response($res);
  }

  public function post_create_subject($request)
  {
    $res = [];
    $params = $request->get_json_params();
    if (empty($params["subject_name"])) {
      return new WP_Error(
        'missing_subject',
        __('Subject name is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $subject = acadlix()->model()->subject()->create(["subject_name" => $params["subject_name"]]);
    if (is_wp_error($subject)) {
      return new WP_Error(
        'subject_not_created',
        __('Failed to create the subject.', 'acadlix'),
        ['status' => 500]
      );
    }
    $res['subject_id'] = $subject->id;
    $res['subjects'] = acadlix()->model()->subject()->get();
    return rest_ensure_response($res);
  }

  public function get_subject_by_id($request)
  {
    $res = [];
    $subject_id = $request['subject_id'];
    $res['subject'] = acadlix()->model()->subject()->find($subject_id);
    return rest_ensure_response($res);
  }

  public function update_subject_by_id($request)
  {
    $res = [];
    $subject_id = $request['subject_id'];
    $params = $request->get_json_params();
    if (empty($subject_id)) {
      return new WP_Error(
        'missing_subject',
        __('Subject id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    if (empty($params["subject_name"])) {
      return new WP_Error(
        'missing_subject',
        __('Subject name is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $subject = acadlix()->model()->subject()->find($subject_id);
    if ($subject) {
      $subject->update(
        [
          "subject_name" => $params["subject_name"]
        ]
      );
    }

    if (is_wp_error($subject)) {
      return new WP_Error(
        'subject_not_updated',
        __('Failed to update the subject.', 'acadlix'),
        ['status' => 500]
      );
    }
    $res['subject'] = $subject;
    $res['subjects'] = acadlix()->model()->subject()->get();
    return rest_ensure_response($res);
  }

  public function delete_subject_by_id($request)
  {
    $res = [];
    $subject_id = $request['subject_id'];
    $subject = acadlix()->model()->subject()->find($subject_id);
    if (is_wp_error($subject)) {
      return new WP_Error(
        'subject_not_found',
        __('Subject not found.', 'acadlix'),
        ['status' => 404]
      );
    }
    if ($subject) {
      $default_subject = acadlix()->model()->subject()->where('default', 1)->first();
      $questions = acadlix()->model()->question()->where('subject_id', $subject_id)->get();
      if ($questions->count() > 0) {
        foreach ($questions as $question) {
          $question->update(
            [
              "subject_id" => $default_subject->id
            ]
          );
        }
      }
      $subject->delete();
    }
    $res['subject'] = $subject;
    $res['subjects'] = acadlix()->model()->subject()->get();
    return rest_ensure_response($res);
  }
}
