<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use WP_Error;
use Yuvayana\Acadlix\Helper\CourseHelper;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Models\CourseStatistic;
use Yuvayana\Acadlix\Models\Lesson;
use Yuvayana\Acadlix\Models\Order;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\WpUsers;


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

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-upload-assignment-file',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_upload_assignment_file'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-delete-assignment-file',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_delete_assignment_file'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-submit-assignment',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_submit_assignment'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

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
        $order_items = OrderItem::with(['order', 'course'])->whereHas('order', function ($query) use ($userId) {
            $query->where("user_id", $userId)->where("status", "success");
        })->orderByDesc("created_at");

        if (!empty($search)) {
            $order_items->whereHas('course', function ($query) use ($search) {
                $query->where('post_title', 'like', "%$search%");
            });
        }

        $res['total'] = $order_items->count();
        $res['order_items'] = $order_items->skip($skip)->take($params['pageSize'])->get();
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
        $orderItem = OrderItem::with(['order'])
            ->whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->where('status', 'success');
            })
            ->find($orderItemId);

        $res['order_item'] = $orderItem;

        // Add course statistics if the order item exists
        if ($orderItem) {
            $res['course_statistic'] = CourseStatistic::where('order_item_id', $orderItemId)
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
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($meta, 'lesson')
            : [];

        $lesson = Lesson::ofLesson()->find($lessonId);
        if ($lesson) {
            Lesson::updateLesson($lessonId, [], $meta);
        }
        return rest_ensure_response(['success' => true, 'lesson' => Lesson::ofLesson()->find($lessonId)]);
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
        $metaValue = $request->get_param("meta_value") ?? [];
        $isAssignmentStarted = $request->get_param("is_assignment_started");

        $course_statistics = CourseStatistic::where("order_item_id", $orderItemId)->get();
        if ($course_statistics->count() > 0) {
            foreach ($course_statistics as $course_statistic) {
                $course_statistic->update([
                    'is_active' => false
                ]);
            }
        }

        $active_statistic = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)->first();
        if ($active_statistic) {
            $active_statistic->update([
                'is_active' => true
            ]);
        } else {
            CourseStatistic::create([
                'order_item_id' => $orderItemId,
                'course_section_content_id' => $courseSectionContentId,
                'user_id' => $userId,
                'is_active' => true,
                'is_completed' => false,
            ]);
        }

        if($metaType && $metaType === "assignment" && $isAssignmentStarted) {
          $statistic = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)->first();
          if ($statistic) {
            $statistic->update([
              'meta_type' => $metaType,
              'meta_value' => $metaValue,
            ]);
          }
          return rest_ensure_response(['success' => true, 'meta_value' => $statistic->meta_value]);
        }

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

        $active_statistic = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($active_statistic) {
            $active_statistic->update([
                'is_completed' => true
            ]);
        } else {
            CourseStatistic::create([
                'order_item_id' => $orderItemId,
                'course_section_content_id' => $courseSectionContentId,
                'user_id' => $userId,
                'is_active' => true,
                'is_completed' => true,
            ]);
        }

        // send email for course completion
        CourseHelper::instance()->handleCourseCompletionEmail($orderItemId);

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

        $active_statistic = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($active_statistic) {
            $active_statistic->update([
                'is_completed' => false
            ]);
        } else {
            CourseStatistic::create([
                'order_item_id' => $orderItemId,
                'course_section_content_id' => $courseSectionContentId,
                'user_id' => $userId,
                'is_active' => true,
                'is_completed' => false,
            ]);
        }
        return rest_ensure_response(['success' => true]);
    }

    public function post_upload_assignment_file($request)
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

        $files = $request->get_file_params();
        $userId = $request->get_param("user_id");
        $orderItemId = $request->get_param("order_item_id");
        $courseSectionContentId = $request->get_param("course_section_content_id");
        $metaType = $request->get_param("meta_type");
        $metaValue = json_decode($request->get_param('meta_value'), true) ?? [];
        $currentMetaIndex = $request->get_param("current_meta_index") ?? 0;
        if (empty($files['files'])) {
            return new WP_Error('no_file', __('No file uploaded', 'acadlix'), array('status' => 400));
        }

        // Include WordPress upload functions
        require_once ABSPATH . 'wp-admin/includes/file.php';

        // Get the base uploads directory
        $upload_dir = wp_upload_dir(); // Gives [basedir] and [baseurl]

        // Define custom subdirectory path
        $custom_subdir = '/assignment';
        $custom_dir_path = $upload_dir['basedir'] . $custom_subdir;

        // Create the folder if it doesn't exist
        if (!file_exists($custom_dir_path)) {
            if (!wp_mkdir_p($custom_dir_path)) {
                return new WP_Error('mkdir_failed', __('Failed to create assignment folder.', 'acadlix'), ['status' => 500]);
            }
        }

        // Upload override settings
        $upload_overrides = ['test_form' => false];

        // Loop through each file
        $file_count = count($files['files']['name']);
        $new_file = [];
        // return rest_ensure_response($file_count);
        for ($i = 0; $i < $file_count; $i++) {
            $file = [
                'name' => $files['files']['name'][$i],
                'type' => $files['files']['type'][$i],
                'tmp_name' => $files['files']['tmp_name'][$i],
                'error' => $files['files']['error'][$i],
                'size' => $files['files']['size'][$i],
            ];

            $original_filename = sanitize_file_name($file['name']);
            $timestamp = time();
            $extension = pathinfo($original_filename, PATHINFO_EXTENSION);
            $filename_wo_ext = pathinfo($original_filename, PATHINFO_FILENAME);
            $file['name'] = "{$filename_wo_ext}_{$timestamp}.{$extension}";
            // Set upload_dir filter for each file
            add_filter('upload_dir', function ($dirs) use ($custom_subdir) {
                $dirs['subdir'] = $custom_subdir;
                $dirs['path'] = $dirs['basedir'] . $custom_subdir;
                $dirs['url'] = $dirs['baseurl'] . $custom_subdir;
                return $dirs;
            });

            $result = wp_handle_upload($file, $upload_overrides);

            // Remove the filter (important when looping)
            remove_filter('upload_dir', '__return_custom_assignment_dir');

            if ($result && !isset($result['error'])) {
                $new_file[] = [
                    'file_name' => $file['name'],
                    'file_size' => $file['size'],
                    'file_extension' => $extension,
                    'file_url' => $result['url'],
                    'file_path' => $result['file'],
                    'file_type' => $result['type'],
                ];
            } else {
                return new WP_Error('upload_failed', __('Failed to upload file.', 'acadlix'), array('status' => 500));
            }
        }

        $course_statistics = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($course_statistics) {

            $submissions = $metaValue['submissions'] ?? [];

            foreach ($submissions as $index => &$s) {
                if ($index == $currentMetaIndex) {
                    $s['answer_files'] = array_merge($s['answer_files'], $new_file);
                }
            }
            unset($s); // cleanup reference
            $course_statistics->update([
                "meta_type" => $metaType,
                "meta_value" => array_merge($metaValue, ['submissions' => $submissions])
            ]);
        }

        return rest_ensure_response([
            "success" => true,
            "meta_type" => $metaType,
            "meta_value" => $course_statistics->meta_value ?? null,
        ]);
    }

    public function post_delete_assignment_file($request)
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
        $delete_file_data = $request->get_param("delete_file_data");
        $userId = $request->get_param("user_id");
        $orderItemId = $request->get_param("order_item_id");
        $courseSectionContentId = $request->get_param("course_section_content_id");
        $metaType = $request->get_param("meta_type");
        $metaValue = $request->get_param("meta_value");
        $file_path = $delete_file_data['file_path'];
        if (file_exists($file_path)) {
            $delete_file = wp_delete_file($file_path);
            if (!$delete_file) {
                return new WP_Error('file_not_deleted', __('File not deleted', 'acadlix'), ['status' => 500]);
            }
        }
        $course_statistics = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($course_statistics) {
            $course_statistics->update([
                "meta_type" => $metaType,
                "meta_value" => $metaValue,
            ]);
        }
        return rest_ensure_response([
            "success" => true,
            "meta_type" => $metaType,
            "meta_value" => $course_statistics->meta_value ?? null,
        ]);
    }
    public function post_submit_assignment($request)
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
        $metaValue = $request->get_param("meta_value");

        $course_statistics = CourseStatistic::where("order_item_id", $orderItemId)
            ->where("course_section_content_id", $courseSectionContentId)
            ->where("user_id", $userId)
            ->first();
        if ($course_statistics) {
            $course_statistics->update([
                "meta_type" => $metaType,
                "meta_value" => $metaValue,
            ]);
        }
        return rest_ensure_response([
            "success" => true,
            "meta_type" => $metaType,
            "course_statistics" => $course_statistics,
        ]);
    }

    public function get_user_purchases($request)
    {
        $res = [];
        $params = $request->get_params();
        if ($request->get_param("user_id") == 0) {
            return new WP_Error('no_data_found', __('Required user_id', 'acadlix'), array('status' => 404));
        }
        $skip = $params['page'] * $params['pageSize'];
        $order = Order::with(['order_items', 'order_metas', 'user'])->where("user_id", $request->get_param("user_id"))->orderBy('created_at', 'desc');
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
        $res['user'] = WpUsers::with('user_metas')->where('ID', $request->get_param("user_id"))->first();
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

        $res['user'] = WpUsers::with('user_metas')->where('ID', $user_id)->first();
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        if(is_user_logged_in()){
            return true;
        }
        return false;
    }
}