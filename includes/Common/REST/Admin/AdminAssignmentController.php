<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
use Yuvayana\Acadlix\Common\Helper\CptHelper;
use Yuvayana\Acadlix\Common\Models\Assignment;
use Yuvayana\Acadlix\Common\Models\AssignmentSubmission;
use Yuvayana\Acadlix\Common\Models\AssignmentUserStats;
use Yuvayana\Acadlix\Common\Models\CourseStatistic;

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
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_evaluate_assignment'],
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
        $search = $params['search'] ?? '';
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

        // filters
        $course_id = $request['course_id'] ?? "";
        $admin_status = $request['admin_status'] ?? "";
        $user_status = $request['user_status'] ?? "";

        $search = $request['search'] ?? "";
        $skip = $request['page'] * $request['pageSize'] ?? 0;
        $pageSize = $request['pageSize'] ?? 10;
        // Validate required fields
        if (empty($assignment_id)) {
            return new WP_Error(
                'missing_assignment_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $courses = CourseStatistic::with([
            'order_item.course',
            'assignment_user_stat',
        ])
            ->whereHas('assignment_user_stat', function ($q) use ($assignment_id) {
                $q->where('assignment_id', $assignment_id);
            })
            ->get()
            ->pluck('order_item.course')
            ->unique('ID')
            ->map(fn($course) => [
                'ID' => $course->ID,
                'post_title' => $course->post_title,
            ])
            ->values();

        $res['courses'] = $courses;

        $course_statistics = CourseStatistic::with([
            'user',
            'order_item',
            'order_item.course',
            'content',
            'assignment_user_stat'
        ])
            ->whereHas('content', function ($q) use ($assignment_id) {
                $q->whereHas('metas', function ($q2) use ($assignment_id) {
                    $q2->where('meta_key', '_acadlix_course_section_content_assignment_id')
                        ->where('meta_value', $assignment_id);
                });
            });

        if (!empty($course_id)) {
            $course_statistics->whereHas('order_item', function ($q) use ($course_id) {
                $q->where('course_id', $course_id);
            });
        }

        if (!empty($admin_status)) {
            $course_statistics->whereHas('assignment_user_stat', function ($q) use ($admin_status) {
                $q->where('admin_status', $admin_status);
            });
        }

        if (!empty($user_status)) {
            $course_statistics->whereHas('assignment_user_stat', function ($q) use ($user_status) {
                $q->where('user_status', $user_status);
            });
        }

        if (!empty($search)) {
            $course_statistics->where(function ($query) use ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('user_login', 'like', '%' . $search . '%')
                        ->orWhere('display_name', 'like', '%' . $search . '%')
                        ->orWhere('user_email', 'like', '%' . $search . '%');
                })
                    ->orWhereHas('order_item.course', function ($q) use ($search) {
                        $q->where('post_title', 'like', '%' . $search . '%');
                    });
            });
        }

        $res['total'] = $course_statistics->count();
        $res['course_statistics'] = $course_statistics->take($pageSize)->skip($skip)->get();
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

        if (empty($course_statistic_id)) {
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
            'assignment_user_stat',
            'assignment_user_stat.submissions',
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
        $assignment_user_stat_id = $request['assignment_user_stat_id'];
        $submission_id = $request['submission_id'];
        $feedback = $request['feedback'];
        $marks = $request['marks'];
        $admin_status = $request['admin_status'];
        $evaluated_at = $request['evaluated_at'];

        // Validate required fields
        if (empty($assignment_user_stat_id)) {
            return new WP_Error(
                'missing_assignment_user_stat_id',
                __('Assignment ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($submission_id)) {
            return new WP_Error(
                'missing_submission_id',
                __('Submission ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $submission = AssignmentSubmission::find($submission_id);
        if ($submission) {
            $submission->update([
                'marks' => $marks,
                'feedback' => $feedback,
                'evaluated_at' => $evaluated_at,
            ]);
        }

        $assignmentUserStat = AssignmentUserStats::with([
            'submissions',
        ])->find($assignment_user_stat_id);
        if ($assignmentUserStat) {
            $assignmentUserStat->update([
                'final_marks' => $marks,
                'admin_status' => $admin_status,
            ]);
        }


        return rest_ensure_response([
            'success' => true,
            'assignment_user_stat' => $assignmentUserStat,
            'message' => __('Assignment evaluated successfully.', 'acadlix'),
        ]);

    }

    public function delete_evaluate_assignment($request)
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

        if (empty($course_statistic_id)) {
            return new WP_Error(
                'missing_course_statistic_id',
                __('Course statistic ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $courseStatistic = CourseStatistic::find($course_statistic_id);
        if ($courseStatistic) {
            $courseStatistic->delete();
        }

        return rest_ensure_response([
            'success' => true,
            'course_statistic' => $courseStatistic,
            'message' => __('Assignment statistic deleted successfully.', 'acadlix'),
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
        if(!acadlix()->pro || !acadlix()->license->isActive){
            return new WP_Error(
                'permission_denied',
                __('Permission denied.', 'acadlix'),
                ['status' => 403]
            );
        }
        return true;
    }
}