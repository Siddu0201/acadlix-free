<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_Error;
use WP_REST_Server;

defined('ABSPATH') || exit;

class AdminReviewController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-review';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_reviews'],
          'permission_callback' => fn() => current_user_can('acadlix_show_review') && $this->check_permission(),
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<review_id>[\d]+)',
      [
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_review_by_id'],
          'permission_callback' => fn() => current_user_can('acadlix_edit_review') && $this->check_permission(),
          'args' => array(
            'review_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_review_by_id'],
          'permission_callback' => fn() => current_user_can('acadlix_delete_review') && $this->check_permission(),
          'args' => array(
            'review_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
      ]
    );
  }

  public function get_reviews($request)
  {
    $res = [];
    $params = $request->get_params();
    $search = $params['search'] ?? '';
    $skip = $params['page'] * $params['pageSize'];
    $reviews = acadlix()->model()->courseReview()->ofCourseRating()->with(['course']);
    if (!empty($search)) {
      $reviews->where(function ($q) use ($search) {
        $q->where('comment_author', 'like', '%' . esc_sql($search) . '%')
          ->orWhere('comment_approved', 'like', '%' . esc_sql($search) . '%')
          ->orWhereHas('course', function ($courseQuery) use ($search) {
            $courseQuery->where('post_title', 'like', '%' . esc_sql($search) . '%');
          });
      });
    }
    $res['total'] = $reviews->count();
    $res['reviews'] = $reviews->skip($skip)->take($params['pageSize'])->get();
    return rest_ensure_response($res);
  }

  public function update_review_by_id($request)
  {
    $res = [];
    $reviewId = $request['review_id'];
    $params = $request->get_json_params();

    if (empty($reviewId)) {
      return new WP_Error(
        'invalid_review_id',
        __('Invalid review ID.', 'acadlix'),
        array('status' => 400)
      );
    }

    if (empty($params['comment_approved'])) {
      return new WP_Error(
        'invalid_status',
        __('Invalid review status.', 'acadlix'),
        array('status' => 400)
      );
    }

    $review = acadlix()->model()->courseReview()->find($reviewId);
    if (!$review) {
      return new WP_Error(
        'review_not_found',
        __('Review not found.', 'acadlix'),
        array('status' => 404)
      );
    }
    $review->update([
      'comment_approved' => sanitize_text_field($params['comment_approved']),
    ]);
    $res['review'] = $review;
    return rest_ensure_response($res);
  }

  public function delete_review_by_id($request)
  {
    $res = [];
    $reviewId = $request['review_id'];

    if (empty($reviewId)) {
      return new WP_Error(
        'invalid_review_id',
        __('Invalid review ID.', 'acadlix'),
        array('status' => 400)
      );
    }

    $review = acadlix()->model()->courseReview()->find($reviewId);
    if (!$review) {
      return new WP_Error(
        'review_not_found',
        __('Review not found.', 'acadlix'),
        array('status' => 404)
      );
    }

    $review->delete();
    $res['message'] = __('Review deleted successfully.', 'acadlix');
    return rest_ensure_response($res);
  }

  public function check_permission()
  {
    return true;
  }



}