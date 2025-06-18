<?php

namespace Yuvayana\Acadlix\Common\REST\Front;

use WP_REST_Server;
use WP_Error;


defined('ABSPATH') || exit();

class FrontDashboardController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-dashboard';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-orders',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_orders'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-order-by-id',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_order_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-update-lesson-time',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_update_lesson_time'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-set-active',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_set_active'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-mark-as-complete',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_mark_as_complete'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-mark-as-incomplete',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_mark_as_incomplete'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        // register_rest_route(
        //     $this->namespace,
        //     '/' . $this->base . '/post-upload-assignment-file',
        //     [
        //         [
        //             'methods' => WP_REST_Server::CREATABLE,
        //             'callback' => [$this, 'post_upload_assignment_file'],
        //             'permission_callback' => [$this, 'check_permission'],
        //         ],
        //     ]
        // );

        // register_rest_route(
        //     $this->namespace,
        //     '/' . $this->base . '/post-delete-assignment-file',
        //     [
        //         [
        //             'methods' => WP_REST_Server::CREATABLE,
        //             'callback' => [$this, 'post_delete_assignment_file'],
        //             'permission_callback' => [$this, 'check_permission'],
        //         ],
        //     ]
        // );

        // register_rest_route(
        //     $this->namespace,
        //     '/' . $this->base . '/post-submit-assignment',
        //     [
        //         [
        //             'methods' => WP_REST_Server::CREATABLE,
        //             'callback' => [$this, 'post_submit_assignment'],
        //             'permission_callback' => [$this, 'check_permission'],
        //         ],
        //     ]
        // );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-purchases',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_purchases'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-profile',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_profile'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-update-user-photo',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_update_user_photo'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-update-user-profile',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_update_user_profile'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_user_orders($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];

        if ($request->get_param("user_id") == 0) {
            return new WP_Error('no_data_found', __('Required user_id', 'acadlix'), array('status' => 404));
        }

        $skip = $params['page'] * $params['pageSize'];
        $userId = $request->get_param("user_id");
        $order_items = acadlix()->model()->orderItem()->with(['order', 'course'])->whereHas('order', function ($query) use ($userId) {
            $query->where("user_id", $userId)->where("status", "success");
        })->orderByDesc("created_at");

        if (!empty($search)) {
            $order_items->whereHas('course', function ($query) use ($search) {
                $query->where('post_title', 'like', "%$search%");
            });
        }

        $res['total'] = $order_items->count();
        $res['order_items'] = $order_items->skip($skip)->take($params['pageSize'])->get()->each(function ($orderItem) {
            $orderItem->setAppends(['course_completion_percentage']);
        });
        return rest_ensure_response($res);
    }

    public function get_user_order_by_id($request)
    {
        $res = [];
        $required_fields = array('order_item_id', 'user_id');

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        $orderItemId = $request->get_param('order_item_id');
        $userId = $request->get_param('user_id');

        // Retrieve the order item with associated order and course if conditions match
        $orderItem = acadlix()->model()->orderItem()->with(['order', 'course', 'course.sections'])
            ->whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->where('status', 'success');
            })
            ->find($orderItemId);

        $res['order_item'] = $orderItem;

        // Add course statistics if the order item exists
        if ($orderItem) {
            $res['course_statistic'] = acadlix()->model()->courseStatistic()->with(['assignment_user_stat', 'assignment_user_stat.submissions'])
                ->where('order_item_id', $orderItemId)
                ->where('user_id', $userId)
                ->get();
        }

        return rest_ensure_response($res);
    }

    public function post_update_lesson_time($request)
    {
        $required_fields = array('lesson_id');
        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }
        $lessonId = $request->get_param("lesson_id");
        $meta = [
            "hours" => $request->get_param("hours"),
            "minutes" => $request->get_param("minutes"),
            "seconds" => $request->get_param("seconds"),
        ];

        $meta = !empty($meta) && is_array($meta)
            ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($meta, 'lesson')
            : [];

        $lesson = acadlix()->model()->lesson()->ofLesson()->find($lessonId);
        if ($lesson) {
            acadlix()->model()->lesson()->updateLesson($lessonId, [], $meta);
        }
        return rest_ensure_response(['success' => true, 'lesson' => acadlix()->model()->lesson()->ofLesson()->find($lessonId)]);
    }

    public function post_set_active($request)
    {
        $required_fields = array('order_item_id', 'course_section_content_id', 'user_id');

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }
        $userId = $request->get_param("user_id");
        $orderItemId = $request->get_param("order_item_id");
        $courseSectionContentId = $request->get_param("course_section_content_id");
        $metaType = $request->get_param("meta_type");
        // $assignmentUserStat = $request->get_param("assignment_user_stat") ?? [];
        // $isAssignmentStarted = $request->get_param("is_assignment_started");

        $course_statistics = acadlix()->model()->courseStatistic()->where("order_item_id", $orderItemId)->get();
        if ($course_statistics->count() > 0) {
            foreach ($course_statistics as $course_statistic) {
                $course_statistic->update([
                    'is_active' => false
                ]);
            }
        }

        $active_statistic = acadlix()->model()->courseStatistic()->where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)->first();
        if ($active_statistic) {
            $active_statistic->update([
                'is_active' => true
            ]);
        } else {
            $active_statistic = acadlix()->model()->courseStatistic()->create([
                'order_item_id' => $orderItemId,
                'course_section_content_id' => $courseSectionContentId,
                'user_id' => $userId,
                'is_active' => true,
                'is_completed' => false,
                'meta_type' => $metaType,
            ]);
        }

        $res['active_statistic'] = $active_statistic;

        // if ($metaType && $metaType === "assignment" && $isAssignmentStarted) {
        //     $assignment_user_stat = AssignmentUserStats::with("submissions")->where("course_statistic_id", $active_statistic->id)
        //         ->first();
        //     if (!$assignment_user_stat) {
        //         $assignment_user_stat = $active_statistic
        //             ->assignment_user_stat()
        //             ->create([
        //                 'assignment_id' => $assignmentUserStat['assignment_id'] ?? null,
        //                 'user_status' => $assignmentUserStat['user_status'] ?? "pending",
        //                 'admin_status' => $assignmentUserStat['admin_status'] ?? "pending_review",
        //                 'final_marks' => $assignmentUserStat['final_marks'] ?? null,
        //                 'passed' => $assignmentUserStat['passed'] ?? false,
        //                 'has_late_submission' => $assignmentUserStat['has_late_submission'] ?? false,
        //                 'resubmission_allowed' => $assignmentUserStat['resubmission_allowed'] ?? false,
        //                 'attempt_counts' => $assignmentUserStat['attempt_counts'] ?? 1,
        //                 'first_started_at' => $assignmentUserStat['first_started_at'] ?? null,
        //             ]);
        //         if($assignment_user_stat){
        //             $assignment_user_stat->submissions()->create([
        //                 'is_active' => true,
        //             ]);
        //         }
        //     }

        //     $assignment_user_stat = AssignmentUserStats::with("submissions")->where("course_statistic_id", $active_statistic->id)
        //         ->first();
        //     return rest_ensure_response([
        //         'success' => true,
        //         'assignment_user_stat' => $assignment_user_stat
        //     ]);
        // }

        return rest_ensure_response(['success' => true]);
    }

    public function post_mark_as_complete($request)
    {
        $required_fields = array('order_item_id', 'course_section_content_id', 'user_id');

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }
        $userId = $request->get_param("user_id");
        $orderItemId = $request->get_param("order_item_id");
        $courseSectionContentId = $request->get_param("course_section_content_id");

        $active_statistic = acadlix()->model()->courseStatistic()->where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($active_statistic) {
            $active_statistic->update([
                'is_completed' => true
            ]);
        } else {
            acadlix()->model()->courseStatistic()->create([
                'order_item_id' => $orderItemId,
                'course_section_content_id' => $courseSectionContentId,
                'user_id' => $userId,
                'is_active' => true,
                'is_completed' => true,
            ]);
        }

        // send email for course completion
        acadlix()->helper()->course()->handleCourseCompletionEmail($orderItemId);

        return rest_ensure_response(['success' => true]);
    }

    public function post_mark_as_incomplete($request)
    {
        $required_fields = array('order_item_id', 'course_section_content_id', 'user_id');

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }
        $userId = $request->get_param("user_id");
        $orderItemId = $request->get_param("order_item_id");
        $courseSectionContentId = $request->get_param("course_section_content_id");

        $active_statistic = acadlix()->model()->courseStatistic()->where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($active_statistic) {
            $active_statistic->update([
                'is_completed' => false
            ]);
        } else {
            acadlix()->model()->courseStatistic()->create([
                'order_item_id' => $orderItemId,
                'course_section_content_id' => $courseSectionContentId,
                'user_id' => $userId,
                'is_active' => true,
                'is_completed' => false,
            ]);
        }
        return rest_ensure_response(['success' => true]);
    }

    // public function post_upload_assignment_file($request)
    // {
    //     $required_fields = array('submission_id');

    //     foreach ($required_fields as $field) {
    //         $param = $request->get_param($field);

    //         if (empty($param)) {
    //             /* translators: %s is the required field */
    //             $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
    //         }
    //     }

    //     if (!empty($errors)) {
    //         return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
    //     }

    //     $files = $request->get_file_params();
    //     $submission_id = $request->get_param("submission_id");

    //     if (empty($files['files'])) {
    //         return new WP_Error('no_file', __('No file uploaded', 'acadlix'), array('status' => 400));
    //     }

    //     // Include WordPress upload functions
    //     require_once ABSPATH . 'wp-admin/includes/file.php';

    //     // Get the base uploads directory
    //     $upload_dir = wp_upload_dir(); // Gives [basedir] and [baseurl]

    //     // Define custom subdirectory path
    //     $custom_subdir = '/assignment';
    //     $custom_dir_path = $upload_dir['basedir'] . $custom_subdir;

    //     // Create the folder if it doesn't exist
    //     if (!file_exists($custom_dir_path)) {
    //         if (!wp_mkdir_p($custom_dir_path)) {
    //             return new WP_Error('mkdir_failed', __('Failed to create assignment folder.', 'acadlix'), ['status' => 500]);
    //         }
    //     }

    //     // Upload override settings
    //     $upload_overrides = ['test_form' => false];

    //     // Loop through each file
    //     $file_count = count($files['files']['name']);
    //     $new_file = [];
    //     // return rest_ensure_response($file_count);
    //     for ($i = 0; $i < $file_count; $i++) {
    //         $file = [
    //             'name' => $files['files']['name'][$i],
    //             'type' => $files['files']['type'][$i],
    //             'tmp_name' => $files['files']['tmp_name'][$i],
    //             'error' => $files['files']['error'][$i],
    //             'size' => $files['files']['size'][$i],
    //         ];

    //         $original_filename = sanitize_file_name($file['name']);
    //         $timestamp = time();
    //         $extension = pathinfo($original_filename, PATHINFO_EXTENSION);
    //         $filename_wo_ext = pathinfo($original_filename, PATHINFO_FILENAME);
    //         $file['name'] = "{$filename_wo_ext}_{$timestamp}.{$extension}";
    //         // Set upload_dir filter for each file
    //         add_filter('upload_dir', function ($dirs) use ($custom_subdir) {
    //             $dirs['subdir'] = $custom_subdir;
    //             $dirs['path'] = $dirs['basedir'] . $custom_subdir;
    //             $dirs['url'] = $dirs['baseurl'] . $custom_subdir;
    //             return $dirs;
    //         });

    //         $result = wp_handle_upload($file, $upload_overrides);

    //         // Remove the filter (important when looping)
    //         remove_filter('upload_dir', '__return_custom_assignment_dir');

    //         if ($result && !isset($result['error'])) {
    //             $new_file[] = [
    //                 'file_name' => $file['name'],
    //                 'file_size' => $file['size'],
    //                 'file_extension' => $extension,
    //                 'file_url' => $result['url'],
    //                 'file_path' => $result['file'],
    //                 'file_type' => $result['type'],
    //             ];
    //         } else {
    //             return new WP_Error('upload_failed', __('Failed to upload file.', 'acadlix'), array('status' => 500));
    //         }
    //     }

    //     $assignment_submission = AssignmentSubmission::find($submission_id);
    //     if ($assignment_submission) {
    //         $answer_attachments = array_merge($assignment_submission->answer_attachments ?? [], $new_file);
    //         $assignment_submission->update([
    //             "answer_attachments" => $answer_attachments
    //         ]);
    //     }

    //     return rest_ensure_response([
    //         "success" => true,
    //         "answer_attachments" => $assignment_submission->answer_attachments ?? null,
    //     ]);
    // }

    // public function post_delete_assignment_file($request)
    // {
    //     $required_fields = array('submission_id');

    //     foreach ($required_fields as $field) {
    //         $param = $request->get_param($field);

    //         if (empty($param)) {
    //             /* translators: %s is the required field */
    //             $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
    //         }
    //     }

    //     if (!empty($errors)) {
    //         return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
    //     }
    //     $delete_file_data = $request->get_param("delete_file_data");
    //     $submission_id = $request->get_param("submission_id");
    //     $answer_attachments = $request->get_param("answer_attachments");
    //     $file_path = $delete_file_data['file_path'];
    //     if (file_exists($file_path)) {
    //         $delete_file = wp_delete_file($file_path);
    //         if (!$delete_file) {
    //             return new WP_Error('file_not_deleted', __('File not deleted', 'acadlix'), ['status' => 500]);
    //         }
    //     }
    //     $assignment_submission = AssignmentSubmission::find($submission_id);
    //     if ($assignment_submission) {
    //         $assignment_submission->update([
    //             "answer_attachments" => $answer_attachments
    //         ]);
    //     }
    //     return rest_ensure_response([
    //         "success" => true,
    //         "answer_attachments" => $assignment_submission->answer_attachments ?? null,
    //     ]);
    // }
    // public function post_submit_assignment($request)
    // {
    //     $required_fields = array('assignment_user_stat_id', 'submission_id', 'user_status');

    //     foreach ($required_fields as $field) {
    //         $param = $request->get_param($field);

    //         if (empty($param)) {
    //             /* translators: %s is the required field */
    //             $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
    //         }
    //     }

    //     if (!empty($errors)) {
    //         return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
    //     }
    //     $assignmentUserStatId = $request->get_param("assignment_user_stat_id");
    //     $submissionId = $request->get_param("submission_id");
    //     $userStatus = $request->get_param("user_status");
    //     $answerText = $request->get_param("answer_text");
    //     $answerAttachments = $request->get_param("answer_attachments");
    //     $submittedAt = $request->get_param("submitted_at");

    //     $assignment_user_stat = AssignmentUserStats::find($assignmentUserStatId);
    //     if ($assignment_user_stat) {
    //         $assignment_user_stat->update([
    //             "user_status" => $userStatus,
    //         ]);
    //     }
    //     $assignment_submission = AssignmentSubmission::find($submissionId);
    //     if ($assignment_submission) {
    //         if(!empty($submittedAt)){
    //             $assignment_submission->update([
    //                 "answer_text" => $answerText,
    //                 "answer_attachments" => $answerAttachments,
    //                 "submitted_at" => $submittedAt,
    //             ]);
    //         }else{
    //             $assignment_submission->update([
    //                 "answer_text" => $answerText,
    //                 "answer_attachments" => $answerAttachments,
    //             ]);
    //         }
    //     }
    //     return rest_ensure_response([
    //         "success" => true,
    //         "user_status" => $userStatus,
    //         "assignment_submission" => $assignment_submission,
    //     ]);
    // }

    public function get_user_purchases($request)
    {
        $res = [];
        $params = $request->get_params();
        if ($request->get_param("user_id") == 0) {
            return new WP_Error('no_data_found', __('Required user_id', 'acadlix'), array('status' => 404));
        }
        $skip = $params['page'] * $params['pageSize'];
        $order = acadlix()->model()->order()->with(['order_items', 'order_metas', 'user'])->where("user_id", $request->get_param("user_id"))->orderBy('created_at', 'desc');
        $res['total'] = $order->count();
        $res['orders'] = $order->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_user_profile($request)
    {
        $res = [];
        if ($request->get_param("user_id") == 0) {
            return new WP_Error('no_data_found', __('Required user_id', 'acadlix'), array('status' => 404));
        }
        $res['user'] = acadlix()->model()->wpUsers()->with('user_metas')->where('ID', $request->get_param("user_id"))->first();
        return rest_ensure_response($res);
    }

    public function post_update_user_photo($request)
    {
        $files = $request->get_file_params();

        if (empty($files['file'])) {
            return new WP_Error('no_file', __('No file uploaded', 'acadlix'), array('status' => 400));
        }

        $file = $files['file'];

        // Check if the upload is an image
        if (!in_array($file['type'], array('image/jpeg', 'image/png', 'image/jpg'))) {
            return new WP_Error('invalid_file_type', __('Only JPG and PNG files are allowed', 'acadlix'), array('status' => 400));
        }

        // Handle the upload using WordPress functions
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $upload_overrides = array(
            'test_form' => false
        );
        $uploaded_file = wp_handle_upload($file, $upload_overrides);

        if (isset($uploaded_file['error'])) {
            return new WP_Error('upload_error', $uploaded_file['error'], array('status' => 500));
        }

        // Create attachment
        $attachment_id = wp_insert_attachment(array(
            'guid' => $uploaded_file['url'],
            'post_mime_type' => $file['type'],
            'post_title' => sanitize_file_name($file['name']),
            'post_content' => '',
            'post_status' => 'inherit'
        ), $uploaded_file['file']);

        // Generate metadata and update attachment
        $attachment_data = wp_generate_attachment_metadata($attachment_id, $uploaded_file['file']);
        wp_update_attachment_metadata($attachment_id, $attachment_data);

        // Return the URL of the uploaded image
        $image_url = wp_get_attachment_url($attachment_id);

        // Update user image
        update_user_meta($request->get_param("user_id"), '_acadlix_profile_photo', $image_url);

        return rest_ensure_response(array('success' => true, 'url' => $image_url));
    }

    public function post_update_user_profile($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $user_id = $request->get_param("user_id");
        if ($user_id == 0) {
            return new WP_Error('no_data_found', __('Required user_id', 'acadlix'), array('status' => 404));
        }
        wp_update_user([
            'ID' => $user_id,
            'display_name' => sanitize_text_field($params['first_name']) . " " . sanitize_text_field($params['last_name']),
            'user_url' => sanitize_text_field($params['user_url'])
        ]);

        update_user_meta($user_id, 'first_name', sanitize_text_field($params['first_name']));
        update_user_meta($user_id, 'last_name', sanitize_text_field($params['last_name']));
        update_user_meta($user_id, 'description', sanitize_text_field($params['description']));
        update_user_meta($user_id, '_acadlix_profile_phonecode', sanitize_text_field($params['phonecode']));
        update_user_meta($user_id, '_acadlix_profile_phone_number', sanitize_text_field($params['phone_number']));
        update_user_meta($user_id, '_acadlix_profile_address', sanitize_text_field($params['address']));
        update_user_meta($user_id, '_acadlix_profile_country', sanitize_text_field($params['country']));
        update_user_meta($user_id, '_acadlix_profile_city', sanitize_text_field($params['city']));
        update_user_meta($user_id, '_acadlix_profile_zip_code', sanitize_text_field($params['zip_code']));
        update_user_meta($user_id, '_acadlix_profile_photo', sanitize_text_field($params['photo']));

        $res['user'] = acadlix()->model()->wpUsers()->with('user_metas')->where('ID', $user_id)->first();
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}