<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Models\Assignment;
use Yuvayana\Acadlix\Models\CourseStatistic;
use Yuvayana\Acadlix\Models\Order;
use Illuminate\Database\Capsule\Manager as DB;
use Yuvayana\Acadlix\Models\OrderItem;

defined('ABSPATH') || exit();

class AdminAssignmentController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-assignment';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_assignments'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_assignment'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<assignment_id>\d+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_assignment_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'assignment_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_assignment_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'assignment_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_assignment_by_id'],
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'assignment_id' => array(
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
            '/' . $this->base . '/(?P<assignment_id>\d+)/submissions',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_assignment_submissions_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'assignment_id' => array(
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
            '/' . $this->base . '/(?P<assignment_id>\d+)/evaluation/(?P<course_statistic_id>\d+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_evaluation_assignment'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'assignment_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'course_statistic_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_evaluate_assignment'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'assignment_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'course_statistic_id' => array(
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
            '/' . $this->base . '/delete-bulk-assignment',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_bulk_assignment'],
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                ],
            ]
        );

    }

    public function get_assignments($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];
        $skip = $params['page'] * $params['pageSize'];
        $assignment = Assignment::ofAssignment()->orderBy('id', 'desc');
        if (!empty($search)) {
            $assignment->where('post_title', 'like', "%$search%");
        }
        $res['total'] = $assignment->count();
        $res['assignments'] = $assignment->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function post_create_assignment($request)
    {
        $res = [];
        $params = $request->get_params();

        // Validate required fields
        if (empty($params['title'])) {
            return new WP_Error(
                'missing_title',
                __('Assignment title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'assignment')
            : [];

        try {
            // Insert the assignment post
            $assignmentId = Assignment::insertAssignment([
                'post_title' => sanitize_text_field($params['title']),
                'post_content' => wp_kses_post($params['post_content']),
                'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
            ], $meta);

            if (is_wp_error($assignmentId)) {
                return new WP_Error(
                    'assignment_creation_failed',
                    __('Failed to create the assignment.', 'acadlix'),
                    ['status' => 500, 'error' => $assignmentId->get_error_message()]
                );
            }
            $assignment = get_post($assignmentId);
            if (!$assignment) {
                return new WP_Error(
                    'assignment_not_found',
                    __('Created assignment not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['assignment'] = $assignment;
            return rest_ensure_response($res);
        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function get_assignment_by_id($request)
    {
        $res = [];
        $assignment_id = $request['assignment_id'];

        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $assignment = Assignment::ofAssignment()->find($assignment_id);
        if ($assignment) {
            $res['assignment'] = $assignment;
        }
        return rest_ensure_response($res);
    }

    public function update_assignment_by_id($request)
    {
        $res = [];
        $assignment_id = $request['assignment_id'];
        $params = $request->get_params();

        // Validate required fields
        if (empty($params['title'])) {
            return new WP_Error(
                'missing_title',
                __('Assignment title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'assignment')
            : [];

        try {
            $assignmentId = Assignment::updateAssignment($assignment_id, [
                'post_title' => sanitize_text_field($params['title']),
                'post_content' => wp_kses_post($params['post_content']),
                'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
            ], $meta);

            if (is_wp_error($assignmentId)) {
                return new WP_Error(
                    'assignment_updation_failed',
                    __('Failed to update the assignment.', 'acadlix'),
                    ['status' => 500, 'error' => $assignmentId->get_error_message()]
                );
            }

            $assignment = get_post($assignmentId);
            if (!$assignment) {
                return new WP_Error(
                    'assignment_not_found',
                    __('Updated assignment not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['assignment'] = $assignment;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function get_assignment_submissions_by_id($request)
    {
        $res = [];
        $assignment_id = $request['assignment_id'];

        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $order = [];
        // $order = Order::with('order_items')->whereHas('order_items', function ($q) use ($assignment_id) {
        //     $q->whereHas('course.sections.contents.metas', function ($q2) use ($assignment_id) {
        //         $q2->where(function($q3) use ($assignment_id) {
        //             $q3->where('meta_key', '_acadlix_course_section_content_assignment_id')
        //                ->where('meta_value', $assignment_id);
        //         });
        //     });
        // })->get();

        $assignment = Assignment::ofAssignment()->find($assignment_id);
        if (!$assignment) {
            return new WP_Error(
                'assignment_not_found',
                __('Assignment not found.', 'acadlix'),
                ['status' => 404]
            );
        }
        
        $res['assignment'] = $assignment;

        $submissions = OrderItem::with([
            'order',
            'order.user',
            'course.sections.contents' => function ($query) use ($assignment_id) {
                $query->whereHas('metas', function ($q) use ($assignment_id) {
                    $q->where('meta_key', '_acadlix_course_section_content_assignment_id')
                      ->where('meta_value', $assignment_id);
                });
            },
            'course.sections.contents.course_statistics'
        ])
        ->whereHas('course.sections.contents', function ($q) use ($assignment_id) {
            $q->whereHas('metas', function ($q2) use ($assignment_id) {
                $q2->where('meta_key', '_acadlix_course_section_content_assignment_id')
                   ->where('meta_value', $assignment_id);
            });
        })
        ->get()
        ->each(function ($orderItem) {
            $orderItem->setAppends([]);
        });

        $res['submissions'] = $submissions;
        return rest_ensure_response($res);
    }

    public function get_evaluation_assignment($request)
    {
        $res = [];
        $assignment_id = $request['assignment_id'];
        $course_statistic_id = $request['course_statistic_id'];

        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if(empty($course_statistic_id)) {
            return new WP_Error(
                'missing_course_statistic_id',
                __('Course statistic ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $assignment = Assignment::ofAssignment()->find($assignment_id);
        if (!$assignment) {
            return new WP_Error(
                'assignment_not_found',
                __('Assignment not found.', 'acadlix'),
                ['status' => 404]
            );
        }
        $courseStatistic = CourseStatistic::with([
            'user',
            ])->find($course_statistic_id);
        if (!$courseStatistic) {
            return new WP_Error(
                'course_statistic_not_found',
                __('Course statistic not found.', 'acadlix'),
                ['status' => 404]
            );
        }
        $res['assignment'] = $assignment;
        $res['course_statistic'] = $courseStatistic;
        return rest_ensure_response($res);
    }

    public function post_evaluate_assignment($request)
    {
        $res = [];
        $assignment_id = $request['assignment_id'];
        $course_statistic_id = $request['course_statistic_id'];
        $params = $request->get_params();

        $meta_value = $params['meta_value'] ?? [];

        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if(empty($course_statistic_id)) {
            return new WP_Error(
                'missing_course_statistic_id',
                __('Course statistic ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $courseStatistic = CourseStatistic::with([
            'user',
            ])->find($course_statistic_id);
        if ($courseStatistic) {
            $courseStatistic->update([
                'meta_value' => $meta_value
            ]);
        }

        return rest_ensure_response([
            'success' => true,
            'course_statistic' => $courseStatistic,
            'message' => __('Assignment evaluated successfully.', 'acadlix'),
        ]);
        
    }

    public function delete_assignment_by_id($request)
    {
        $res = [];
        $assignment_id = $request['assignment_id'];

        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $assignment = Assignment::deleteAssignment($assignment_id);
        if (is_wp_error($assignment)) {
            return new WP_Error(
                'assignment_deletion_failed',
                __('Failed to delete the assignment.', 'acadlix'),
                ['status' => 500, 'error' => $assignment->get_error_message()]
            );
        }

        $res['message'] = __('Assignment successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function delete_bulk_assignment($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $assignment_ids = $params['assignment_ids'];
        if (!is_array($assignment_ids) || count($assignment_ids) == 0) {
            return new WP_Error(
                'missing_ids',
                __('Assignment ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        foreach ($assignment_ids as $assignment_id) {
            if (empty($assignment_id)) {
                return new WP_Error(
                    'missing_id',
                    __('Assignment id is required.', 'acadlix'),
                    ['status' => 400]
                );
            }
            $assignment = Assignment::deleteAssignment($assignment_id);
            if (is_wp_error($assignment)) {
                return new WP_Error(
                    'assignment_deletion_failed',
                    __('Failed to delete the assignment.', 'acadlix'),
                    ['status' => 500, 'error' => $assignment->get_error_message()]
                );
            }
        }
        $res['message'] = __('Assignments successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function check_permission($request)
    {
        return true;
    }
}