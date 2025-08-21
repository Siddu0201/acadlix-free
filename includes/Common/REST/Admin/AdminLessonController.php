<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
defined('ABSPATH') || exit();

class AdminLessonController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-lesson';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_lessons'],
                    'permission_callback' => fn() => current_user_can('acadlix_show_lesson') && $this->check_permission(),
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_lesson'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_lesson') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<lesson_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_lesson_by_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_edit_lesson') && $this->check_permission(),
                    'args' => array(
                        'lesson_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_lesson_by_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_edit_lesson') && $this->check_permission(),
                    'args' => array(
                        'lesson_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_lesson_by_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_delete_lesson') && $this->check_permission(),
                    'args' => array(
                        'lesson_id' => array(
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
            '/' . $this->base . '/delete-bulk-lesson',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_bulk_lesson'],
                    'permission_callback' => fn() => current_user_can('acadlix_bulk_delete_lesson') && $this->check_permission(),
                ],
            ]
        );
    }

    public function get_lessons($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];
        $skip = $params['page'] * $params['pageSize'];
        $lesson = acadlix()->model()->lesson()->ofLesson()->orderBy('ID', 'desc');
        if(!empty($search)) {
            $lesson->where('post_title', 'like', "%$search%");
        }
        $res['total'] = $lesson->count();
        $res['lessons'] = $lesson->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function post_create_lesson($request)
    {
        $res = [];
        $params = $request->get_json_params();

        // Validate required fields
        if (empty($params['title'])) {
            return new WP_Error(
                'missing_title',
                __('Lesson title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'lesson')
            : [];

        try {
            // Insert the lesson post
            $lessonId = acadlix()->model()->lesson()->insertLesson([
                'post_title' => $params['title'],
                'post_content' => $params['content'],
                'post_author' => (int) $params['post_author'], // Assign to current user
            ], $meta);

            if (is_wp_error($lessonId)) {
                return new WP_Error(
                    'lesson_creation_failed',
                    __('Failed to create the lesson.', 'acadlix'),
                    ['status' => 500, 'error' => $lessonId->get_error_message()]
                );
            }

            // Retrieve and return the lesson data
            $lesson = get_post($lessonId);
            if (!$lesson) {
                return new WP_Error(
                    'lesson_not_found',
                    __('Created lesson not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['lesson'] = $lesson;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function get_lesson_by_id($request)
    {
        $res = [];
        $lesson_id = $request['lesson_id'];

        // Validate required fields
        if (empty($lesson_id)) {
            return new WP_Error(
                'missing_id',
                __('Lesson id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $lesson = acadlix()->model()->lesson()->find($lesson_id);
        if ($lesson) {
            $res['lesson'] = $lesson;
        }
        return rest_ensure_response($res);
    }

    public function update_lesson_by_id($request)
    {
        $res = [];
        $lessonId = $request['lesson_id'];
        $params = $request->get_json_params();

        // Validate required fields
        if (empty($params['title'])) {
            return new WP_Error(
                'missing_title',
                __('Lesson title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Validate required fields
        if (empty($lessonId)) {
            return new WP_Error(
                'missing_id',
                __('Lesson id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'lesson')
            : [];

        try {
            // Update the lesson post
            $lessonId = acadlix()->model()->lesson()->updateLesson($lessonId, [
                'post_title' => sanitize_text_field($params['title']),
                'post_content' => wp_kses_post($params['content']),
                'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
            ], $meta);

            if (is_wp_error($lessonId)) {
                return new WP_Error(
                    'lesson_updation_failed',
                    __('Failed to update the lesson.', 'acadlix'),
                    ['status' => 500, 'error' => $lessonId->get_error_message()]
                );
            }

            // Retrieve and return the lesson data
            $lesson = get_post($lessonId);
            if (!$lesson) {
                return new WP_Error(
                    'lesson_not_found',
                    __('Updated lesson not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['lesson'] = $lesson;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }

    }

    public function delete_lesson_by_id($request)
    {
        $res = [];
        $lesson_id = $request['lesson_id'];

        // Validate required fields
        if (empty($lesson_id)) {
            return new WP_Error(
                'missing_id',
                __('Lesson id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $lesson = acadlix()->model()->lesson()->deleteLesson($lesson_id);

        if (is_wp_error($lesson)) {
            return new WP_Error(
                'lesson_deletion_failed',
                __('Failed to delete the lesson.', 'acadlix'),
                ['status' => 500, 'error' => $lesson->get_error_message()]
            );
        }
        $res['message'] = __('Lesson successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function delete_bulk_lesson($request)
    {
        $res = [];
        $params = $request->get_json_params();

        // Validate required fields
        if (!is_array($params['lesson_ids']) || count($params['lesson_ids']) == 0) {
            return new WP_Error(
                'missing_ids',
                __('Lesson ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        foreach ($params['lesson_ids'] as $lesson_id) {
            if (empty($lesson_id)) {
                return new WP_Error(
                    'missing_id',
                    __('Lesson id is required.', 'acadlix'),
                    ['status' => 400]
                );
            }
            $lesson = acadlix()->model()->lesson()->deleteLesson($lesson_id);

            if (is_wp_error($lesson)) {
                return new WP_Error(
                    'lesson_deletion_failed',
                    __('Failed to delete the lesson.', 'acadlix'),
                    ['status' => 500, 'error' => $lesson->get_error_message()]
                );
            }
        }
        $res['message'] = __('Lessons successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}