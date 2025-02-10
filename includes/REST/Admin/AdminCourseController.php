<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\CourseSection;
use Yuvayana\Acadlix\Models\CourseSectionContent;
use Yuvayana\Acadlix\Models\Lesson;
use Yuvayana\Acadlix\Models\Quiz;

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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
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
            '/' . $this->base . '/(?P<course_id>[\d]+)/sort-section',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_sort_section'],
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
            '/' . $this->base . '/section/(?P<section_id>[\d]+)/content/(?P<content_id>[\d]+)/preview',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_toogle_preview_content'],
                    'permission_callback' => [$this, 'check_permission'],
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

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-lessons-for-course',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_lessons_for_course'],
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => [$this, 'check_permission'],
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
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
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
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'course')
            : [];

        try {
            // Insert the lesson post
            $courseId = Course::updateCourse($courseId, [], $meta);

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
                Course::updateCourse(
                    $courseId,
                    [
                        'post_title' => __('Draft Course', 'acadlix'),
                        'post_status' => 'draft',
                        'post_author' => $params['logged_in_user_id'],
                    ],
                );
            }
            $course = Course::ofCourse()->find($courseId);
            // Insert the section post
            $courseSectionId = CourseSection::insertCourseSection([
                'post_title' => sanitize_text_field($params['post_title']),
                'post_content' => wp_kses_post($params['post_content']),
                'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
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
            $courseSectionId = CourseSection::updateCourseSection(
                $section_id,
                [
                    'post_title' => sanitize_text_field($params['post_title']),
                    'post_content' => wp_kses_post($params['post_content']),
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

        $section = CourseSection::deleteCourseSection($section_id);

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

        $course = Course::ofCourse()->find($courseId);

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

        $section = CourseSection::ofCourseSection()->find($section_id);

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

        if(empty($params['active_menu_order']) || empty($params['over_menu_order'])){
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

    public function post_toogle_preview_content($request)
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
        $meta = [
            'preview' => $request->get_param('preview')
        ];
        $meta = !empty($meta) && is_array($meta)
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($meta, 'course_section_content')
            : [];

        $section_content = CourseSectionContent::ofCourseSectionContent()->find($content_id);
        if (!$section_content) {
            return new WP_Error(
                'missing_content',
                __('Content not found.', 'acadlix'),
                ['status' => 400]
            );
        }
        $courseSectionContentId = CourseSectionContent::updateCourseSectionContent(
            $content_id,
            [],
            $meta
        );

        if (is_wp_error($courseSectionContentId)) {
            return new WP_Error(
                'course_section_content_updation_failed',
                __('Failed to update the content.', 'acadlix'),
                ['status' => 500, 'error' => $courseSectionContentId->get_error_message()]
            );
        }
        $res['section'] = CourseSection::ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function get_lessons_for_course()
    {
        $res = [];
        $res['lessons'] = Lesson::ofLesson()->select(["ID", "post_title"])->get();
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

        $section = CourseSection::find($section_id);
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
                ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'lesson')
                : [];

            // Insert the lesson post
            $lessonId = Lesson::insertLesson([
                'post_title' => sanitize_text_field($params['title']),
                'post_content' => wp_kses_post($params['content']),
                'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
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
                ? CptHelper::instance()->acadlix_add_prefix_meta_keys($courseSectionContentMetas, 'course_section_content')
                : [];

            // add data to section content
            $courseSectionContentId = CourseSectionContent::insertCourseSectionContent(
                [
                    'post_title' => sanitize_text_field($params['title']),
                    'post_author' => (int) sanitize_text_field($params['post_author']),
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
                $lesson = Lesson::ofLesson()->find($lesson_id);
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
                    ? CptHelper::instance()->acadlix_add_prefix_meta_keys($courseSectionContentMetas, 'course_section_content')
                    : [];

                // add data to section content
                $courseSectionContentId = CourseSectionContent::insertCourseSectionContent(
                    [
                        'post_title' => sanitize_text_field($lesson['post_title']),
                        'post_author' => (int) sanitize_text_field($lesson['post_author']),
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
        $res['section'] = CourseSection::ofCourseSection()->find($section_id);
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
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'lesson')
            : [];

        // Update the lesson post
        $lessonId = Lesson::updateLesson($lesson_id, [
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['content']),
        ], $meta);

        if (is_wp_error($lessonId)) {
            return new WP_Error(
                'lesson_updation_failed',
                __('Failed to update the lesson.', 'acadlix'),
                ['status' => 500, 'error' => $lessonId->get_error_message()]
            );
        }

        $res['section'] = CourseSection::ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function get_quizzes_for_course()
    {
        $res = [];
        $res['quizzes'] = Quiz::ofQuiz()->select(["ID", "post_title"])->get();
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

        $section = CourseSection::ofCourseSection()->find($section_id);

        foreach ($params['quiz_ids'] as $quiz_id) {
            $quiz = Quiz::ofQuiz()->find($quiz_id);
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
                ? CptHelper::instance()->acadlix_add_prefix_meta_keys($courseSectionContentMetas, 'course_section_content')
                : [];

            // add data to section content
            $courseSectionContentId = CourseSectionContent::insertCourseSectionContent(
                [
                    'post_title' => sanitize_text_field($quiz['post_title']),
                    'post_author' => (int) sanitize_text_field($quiz['post_author']),
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
        $res['section'] = CourseSection::ofCourseSection()->find($section_id);
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

        $section_content = CourseSectionContent::find($content_id);
        if ($section_content) {
            $content_id = CourseSectionContent::deleteCourseSectionContent($content_id);

            if (is_wp_error($content_id)) {
                return new WP_Error(
                    'course_section_content_deletion_failed',
                    __('Failed to delete the course section content.', 'acadlix'),
                    ['status' => 500, 'error' => $content_id->get_error_message()]
                );
            }
        }
        $res['section'] = CourseSection::ofCourseSection()->find($section_id);
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}