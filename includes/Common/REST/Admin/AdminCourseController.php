<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_Error;
use WP_REST_Server;
use WP_REST_Request;

defined('ABSPATH') || exit();

class AdminCourseController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-course';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_courses'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_update_course'],
                    'permission_callback' => fn() => current_user_can('acadlix_edit_course') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/section',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_section'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_course_section') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/section/(?P<section_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_section_by_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_edit_course_section') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_section_by_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_delete_course_section') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    )
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<course_id>[\d]+)/sort-section',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_sort_section'],
                    'permission_callback' => fn() => current_user_can('acadlix_sort_course_section') && $this->check_permission(),
                    'args' => array(
                        'course_id' => array(
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
            '/' . $this->base . '/(?P<section_id>[\d]+)/sort-content',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_sort_content'],
                    'permission_callback' => fn() => current_user_can('acadlix_sort_course_section_content') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
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
            '/' . $this->base . '/get-lessons-for-course',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_lessons_for_course'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_course_section_lesson') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/section/(?P<section_id>[\d]+)/lesson',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_add_create_lesson'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_course_section_lesson') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
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
            '/' . $this->base . '/section/(?P<section_id>[\d]+)/lesson/(?P<lesson_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_update_lesson_by_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_edit_course_section_lesson') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
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
            '/' . $this->base . '/get-quizzes-for-course',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quizzes_for_course'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_course_section_quiz') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/section/(?P<section_id>[\d]+)/quiz',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_add_quiz'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_course_section_quiz') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
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
            '/' . $this->base . '/section/(?P<section_id>[\d]+)/content/(?P<content_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'remove_content'],
                    'permission_callback' => fn() => current_user_can('acadlix_delete_course_section_content') && $this->check_permission(),
                    'args' => array(
                        'section_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'content_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }

    public function get_courses()
    {

    }

    public function post_create_update_course($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $courseId = $params['id'];

        // Validate required fields
        if (empty($courseId)) {
            return new WP_Error(
                'missing_id',
                __('Course id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'course')
            : [];

        try {
            // Insert the lesson post
            $courseId = acadlix()->model()->course()->updateCourse($courseId, [], $meta);

            if (is_wp_error($courseId)) {
                return new WP_Error(
                    'course_updation_failed',
                    __('Failed to update the course.', 'acadlix'),
                    ['status' => 500, 'error' => $courseId->get_error_message()]
                );
            }

            // Retrieve and return the lesson data
            $course = get_post($courseId);
            if (!$course) {
                return new WP_Error(
                    'course_not_found',
                    __('Updated course not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['course'] = $course;
            $res['course_cap'] = current_user_can('acadlix_add_course_section_assignment');
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function post_create_section($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $courseId = $params['courseId'];

        // Validate required fields
        if (empty($courseId)) {
            return new WP_Error(
                'missing_id',
                __('Course id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($params['post_title'])) {
            return new WP_Error(
                'missing_title',
                __('Course section title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        try {
            // Change post status and title
            $course_post = get_post($courseId, ARRAY_A);
            if ($course_post['post_title'] == 'Auto Draft' && $course_post['post_status'] == 'auto-draft') {
                acadlix()->model()->course()->updateCourse(
                    $courseId,
                    [
                        'post_title' => __('Draft Course', 'acadlix'),
                        'post_status' => 'draft',
                        'post_author' => $params['logged_in_user_id'],
                    ],
                );
            }
            $course = acadlix()->model()->course()->ofCourse()->with('sections')->find($courseId);
            // Insert the section post
            $courseSectionId = acadlix()->model()->courseSection()->insertCourseSection([
                'post_title' => $params['post_title'],
                'post_content' => $params['post_content'],
                'post_author' => (int) $params['post_author'], // Assign to current user
                'post_parent' => $courseId,
                'menu_order' => $course->sections()->max('menu_order') + 1 ?? 1,
            ]);

            if (is_wp_error($courseSectionId)) {
                return new WP_Error(
                    'course_section_creation_failed',
                    __('Failed to create the course section.', 'acadlix'),
                    ['status' => 500, 'error' => $courseSectionId->get_error_message()]
                );
            }

            $course_section = get_post($courseSectionId);
            if (!$course_section) {
                return new WP_Error(
                    'course_section_not_found',
                    __('Created course section not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['course_section'] = $course_section;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function update_section_by_id($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $params = $request->get_json_params();

        // Validate required fields
        if (empty($section_id)) {
            return new WP_Error(
                'missing_id',
                __('Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($params['post_title'])) {
            return new WP_Error(
                'missing_title',
                __('Course section title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        try {
            $courseSectionId = acadlix()->model()->courseSection()->updateCourseSection(
                $section_id,
                [
                    'post_title' => $params['post_title'],
                    'post_content' => $params['post_content'],
                ]
            );

            if (is_wp_error($courseSectionId)) {
                return new WP_Error(
                    'course_section_updation_failed',
                    __('Failed to create the course section.', 'acadlix'),
                    ['status' => 500, 'error' => $courseSectionId->get_error_message()]
                );
            }

            $course_section = get_post($courseSectionId);
            if (!$course_section) {
                return new WP_Error(
                    'course_section_not_found',
                    __('Updated course section not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['course_section'] = $course_section;
            return rest_ensure_response($res);

        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function delete_section_by_id($request)
    {
        $res = [];
        $section_id = $request['section_id'];

        // Validate required fields
        if (empty($section_id)) {
            return new WP_Error(
                'missing_id',
                __('Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $section = acadlix()->model()->courseSection()->deleteCourseSection($section_id);

        if (is_wp_error($section)) {
            return new WP_Error(
                'course_section_deletion_failed',
                __('Failed to delete the course section.', 'acadlix'),
                ['status' => 500, 'error' => $section->get_error_message()]
            );
        }

        $res['message'] = __('Course section successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function post_sort_section($request)
    {
        $res = [];
        $courseId = $request['course_id'];
        $params = $request->get_json_params();

        // Validate required fields
        if (empty($courseId)) {
            return new WP_Error(
                'missing_id',
                __('Course id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $course = acadlix()->model()->course()->ofCourse()->with('sections')->find($courseId);

        if (!$course) {
            return new WP_Error(
                'missing_course',
                __('Course with this doesnt exist. Course id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $sections = $course->sections()->get();
        $active_menu_order = $params['active_menu_order'];
        $over_menu_order = $params['over_menu_order'];

        if (empty($active_menu_order) || empty($over_menu_order)) {
            return new WP_Error(
                'missing_menu_order',
                __('active and over menu order is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        if ($active_menu_order < $over_menu_order) {
            foreach ($sections as $section) {
                if ($section->menu_order == $active_menu_order) {
                    $section->updateCourseSection($section->ID, ['menu_order' => $over_menu_order]);
                } else if ($section->menu_order > $active_menu_order && $section->menu_order <= $over_menu_order) {
                    $section->updateCourseSection($section->ID, ['menu_order' => $section->menu_order - 1]);
                }
            }
        } else {
            foreach ($sections as $section) {
                if ($section->menu_order == $active_menu_order) {
                    $section->updateCourseSection($section->ID, ['menu_order' => $over_menu_order]);
                } else if ($section->menu_order < $active_menu_order && $section->menu_order >= $over_menu_order) {
                    $section->updateCourseSection($section->ID, ['menu_order' => $section->menu_order + 1]);
                }
            }
        }
        $res['sections'] = $course->sections()->get();
        return rest_ensure_response($res);
    }

    public function post_sort_content($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $section_id = $request['section_id'];

        // Validate required fields
        if (empty($section_id)) {
            return new WP_Error(
                'missing_id',
                __('Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $section = acadlix()->model()->courseSection()->ofCourseSection()->find($section_id);

        if (!$section) {
            return new WP_Error(
                'missing_section',
                __('Section with this doesnt exist. Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $contents = $section->contents()->get();
        $active_menu_order = $params['active_menu_order'];
        $over_menu_order = $params['over_menu_order'];

        if (empty($params['active_menu_order']) || empty($params['over_menu_order'])) {
            return new WP_Error(
                'missing_sort',
                __('active and over menu order is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        if ($active_menu_order < $over_menu_order) {
            foreach ($contents as $content) {
                if ($content->menu_order == $active_menu_order) {
                    $content->updateCourseSectionContent($content->ID, ['menu_order' => $over_menu_order]);
                } else if ($content->menu_order > $active_menu_order && $content->menu_order <= $over_menu_order) {
                    $content->updateCourseSectionContent($content->ID, ['menu_order' => $content->menu_order - 1]);
                }
            }
        } else {
            foreach ($contents as $content) {
                if ($content->menu_order == $active_menu_order) {
                    $content->updateCourseSectionContent($content->ID, ['menu_order' => $over_menu_order]);
                } else if ($content->menu_order < $active_menu_order && $content->menu_order >= $over_menu_order) {
                    $content->updateCourseSectionContent($content->ID, ['menu_order' => $content->menu_order + 1]);
                }
            }
        }
        $res['contents'] = $section->contents()->get();
        return rest_ensure_response($res);
    }

    public function get_lessons_for_course()
    {
        $res = [];
        $res['lessons'] = acadlix()->model()->lesson()->ofLesson()
            ->without(['author', 'metas'])
            ->select(["ID", "post_title"])
            ->orderBy("ID", "desc")
            ->get()
            ->each
            ->setAppends([]);
        return rest_ensure_response($res);
    }

    public function post_add_create_lesson($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $section_id = $request['section_id'];

        if (empty($section_id)) {
            return new WP_Error(
                'missing_id',
                __('Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $section = acadlix()->model()->courseSection()->find($section_id);
        if ($params['lesson_type'] == 'add_new') {
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
            $courseSectionContentMetas = [
                "type" => "lesson",
                "lesson_id" => $lessonId
            ];
            // Prepare meta data
            $meta = !empty($courseSectionContentMetas) && is_array($courseSectionContentMetas)
                ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($courseSectionContentMetas, 'course_section_content')
                : [];

            // add data to section content
            $courseSectionContentId = acadlix()->model()->courseSectionContent()->insertCourseSectionContent(
                [
                    'post_title' => $params['title'],
                    'post_author' => (int) $params['post_author'],
                    'post_parent' => $section_id,
                    'menu_order' => $section->contents()->max('menu_order') + 1 ?? 1,
                ],
                $meta
            );

            if (is_wp_error($courseSectionContentId)) {
                return new WP_Error(
                    'course_section_content_creation_failed',
                    __('Failed to create the course section content.', 'acadlix'),
                    ['status' => 500, 'error' => $courseSectionContentId->get_error_message()]
                );
            }
        }

        if ($params['lesson_type'] == 'existing') {
            if (!is_array($params['lesson_ids']) || count($params['lesson_ids']) == 0) {
                return new WP_Error(
                    'missing_ids',
                    __('Lesson ids is required.', 'acadlix'),
                    ['status' => 400]
                );
            }
            foreach ($params['lesson_ids'] as $lesson_id) {
                $lesson = acadlix()->model()->lesson()->ofLesson()->find($lesson_id);
                if (!$lesson) {
                    return new WP_Error(
                        'lesson_not_found',
                        __('Lesson not found.', 'acadlix'),
                        ['status' => 500]
                    );
                }

                $courseSectionContentMetas = [
                    "type" => "lesson",
                    "lesson_id" => $lesson_id
                ];
                // Prepare meta data
                $meta = !empty($courseSectionContentMetas) && is_array($courseSectionContentMetas)
                    ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($courseSectionContentMetas, 'course_section_content')
                    : [];

                // add data to section content
                $courseSectionContentId = acadlix()->model()->courseSectionContent()->insertCourseSectionContent(
                    [
                        'post_title' => $lesson['post_title'],
                        'post_author' => (int) $lesson['post_author'],
                        'post_parent' => $section_id,
                        'menu_order' => $section->contents()->max('menu_order') + 1 ?? 1,
                    ],
                    $meta
                );

                if (is_wp_error($courseSectionContentId)) {
                    return new WP_Error(
                        'course_section_content_creation_failed',
                        __('Failed to create the course section content.', 'acadlix'),
                        ['status' => 500, 'error' => $courseSectionContentId->get_error_message()]
                    );
                }
            }
        }
        $res['section'] = acadlix()->model()->courseSection()->ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function post_update_lesson_by_id($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $lesson_id = $request['lesson_id'];
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
        if (empty($lesson_id)) {
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

        // Update the lesson post
        $lessonId = acadlix()->model()->lesson()->updateLesson($lesson_id, [
            'post_title' => $params['title'],
            'post_content' => $params['content'],
        ], $meta);

        if (is_wp_error($lessonId)) {
            return new WP_Error(
                'lesson_updation_failed',
                __('Failed to update the lesson.', 'acadlix'),
                ['status' => 500, 'error' => $lessonId->get_error_message()]
            );
        }

        $res['section'] = acadlix()->model()->courseSection()->ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function get_quizzes_for_course()
    {
        $res = [];
        $res['quizzes'] = acadlix()->model()->quiz()->ofQuiz()
            ->without(['author', 'metas', 'quiz_shortcode'])
            ->whereHas("quiz_shortcode")
            ->select(["ID", "post_title"])
            ->orderBy('ID', 'desc')
            ->get()
            ->each
            ->setAppends([
                'category'
            ]);
        return rest_ensure_response($res);
    }

    public function post_add_quiz($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $section_id = $request['section_id'];

        if (empty($section_id)) {
            return new WP_Error(
                'missing_id',
                __('Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        if (!is_array($params['quiz_ids']) || count($params['quiz_ids']) == 0) {
            return new WP_Error(
                'missing_ids',
                __('Quiz ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $section = acadlix()->model()->courseSection()->ofCourseSection()->find($section_id);

        foreach ($params['quiz_ids'] as $quiz_id) {
            $quiz = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
            if (!$quiz) {
                return new WP_Error(
                    'quiz_not_found',
                    __('Quiz not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $courseSectionContentMetas = [
                "type" => "quiz",
                "quiz_id" => $quiz_id
            ];

            // Prepare meta data
            $meta = !empty($courseSectionContentMetas) && is_array($courseSectionContentMetas)
                ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($courseSectionContentMetas, 'course_section_content')
                : [];

            // add data to section content
            $courseSectionContentId = acadlix()->model()->courseSectionContent()->insertCourseSectionContent(
                [
                    'post_title' => $quiz['post_title'],
                    'post_author' => (int) $quiz['post_author'],
                    'post_parent' => $section_id,
                    'menu_order' => $section->contents()->max('menu_order') + 1 ?? 1,
                ],
                $meta
            );

            if (is_wp_error($courseSectionContentId)) {
                return new WP_Error(
                    'course_section_content_creation_failed',
                    __('Failed to create the course section content.', 'acadlix'),
                    ['status' => 500, 'error' => $courseSectionContentId->get_error_message()]
                );
            }
        }
        $res['section'] = acadlix()->model()->courseSection()->ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function remove_content($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $content_id = $request['content_id'];

        // Validate required fields
        if (empty($section_id)) {
            return new WP_Error(
                'missing_id',
                __('Section id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (empty($content_id)) {
            return new WP_Error(
                'missing_id',
                __('Content id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $section_content = acadlix()->model()->courseSectionContent()->find($content_id);
        if ($section_content) {
            $content_id = acadlix()->model()->courseSectionContent()->deleteCourseSectionContent($content_id);

            if (is_wp_error($content_id)) {
                return new WP_Error(
                    'course_section_content_deletion_failed',
                    __('Failed to delete the course section content.', 'acadlix'),
                    ['status' => 500, 'error' => $content_id->get_error_message()]
                );
            }
        }
        $res['section'] = acadlix()->model()->courseSection()->ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}