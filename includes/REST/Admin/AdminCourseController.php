<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
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
            '/' . $this->base . '/section/(?P<section_id>[\d]+)/content/(?P<section_content_id>[\d]+)',
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
                        'section_content_id' => array(
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
        $course_id = $params['id'];
        $course = Course::find($course_id);
        if ($course) {
            $course->update($params);
        } else {
            Course::create([
                ...$params,
                'id' => $course_id,
            ]);
        }
        $course = Course::find($course_id);
        $course->users()->whereNotIn("user_id", $params['user_ids'])->delete();
        if (count($params['user_ids']) > 0) {
            foreach ($params['user_ids'] as $user_id) {
                $course->users()->updateOrCreate(
                    ['user_id' => $user_id],
                    ['user_id' => $user_id]
                );
            }
        }
        $course->outcomes()->whereNotIn('id', array_column($params['outcomes'], 'id'))->delete();
        if (count($params['outcomes']) > 0) {
            foreach ($params['outcomes'] as $outcome) {
                $course->outcomes()->updateOrCreate(
                    ['id' => $outcome['id']],
                    ['outcome' => $outcome['outcome']]
                );
            }
        }

        $course->faqs()->whereNotIn('id', array_column($params['faqs'], 'id'))->delete();
        if (count($params['faqs']) > 0) {
            foreach ($params['faqs'] as $faq) {
                $course->faqs()->updateOrCreate(
                    ['id' => $faq['id']],
                    [
                        'question' => $faq['question'],
                        'answer' => $faq['answer']
                    ]
                );
            }
        }

        return rest_ensure_response($res);
    }

    public function post_create_section($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $course_id = $params['id'];

        // Change post status and title
        $course_post = get_post($course_id, ARRAY_A);
        if ($course_post['post_title'] == 'Auto Draft' && $course_post['post_status'] == 'auto-draft') {
            wp_update_post(array(
                'ID' => $course_id,
                'post_title' => __('Draft Course', 'acadlix'),
                'post_status' => 'draft',
                'post_author' => $params['logged_in_user_id'],
            ));
        }

        // Create course if not exist
        $course = Course::find($course_id);
        if (!$course) {
            $course = Course::create([
                'id' => $course_id
            ]);
        }
        $course = Course::find($course_id);
        $res['section'] = $course->sections()->create([
            "title" => $params['title'],
            "description" => $params['description'],
            'sort' => $course->sections()->max('sort') + 1 ?? 1,
        ]);

        return rest_ensure_response($res);
    }

    public function update_section_by_id($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $params = $request->get_json_params();
        $section = CourseSection::find($section_id);
        if ($section) {
            $section->update([
                "title" => $params['title'],
                "description" => $params['description'],
            ]);
        }
        $res['section'] = $section;
        return rest_ensure_response($res);
    }

    public function delete_section_by_id($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $section = CourseSection::find($section_id);
        if ($section) {
            $section->delete();
        }
        $res['message'] = __('Course section successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function post_sort_section($request)
    {
        $res = [];
        $course_id = $request['course_id'];
        $params = $request->get_json_params();
        $course = Course::find($course_id);
        if ($course) {
            $sections = $course->sections()->get();
            $active_sort = $params['active_sort'];
            $over_sort = $params['over_sort'];
            if ($active_sort < $over_sort) {
                foreach ($sections as $section) {
                    if ($section->sort == $active_sort) {
                        $section->update(['sort' => $over_sort]);
                    } else if ($section->sort > $active_sort && $section->sort <= $over_sort) {
                        $section->update(['sort' => $section->sort - 1]);
                    }
                }
            } else {
                foreach ($sections as $section) {
                    if ($section->sort == $active_sort) {
                        $section->update(['sort' => $over_sort]);
                    } else if ($section->sort < $active_sort && $section->sort >= $over_sort) {
                        $section->update(['sort' => $section->sort + 1]);
                    }
                }
            }
        }
        $res['sections'] = $course->sections()->get();
        return rest_ensure_response($res);
    }

    public function post_sort_content($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $params = $request->get_json_params();
        $section = CourseSection::find($section_id);
        if ($section) {
            $contents = $section->contents()->get();
            $active_sort = $params['active_sort'];
            $over_sort = $params['over_sort'];
            if ($active_sort < $over_sort) {
                foreach ($contents as $content) {
                    if ($content->sort == $active_sort) {
                        $content->update(['sort' => $over_sort]);
                    } else if ($content->sort > $active_sort && $content->sort <= $over_sort) {
                        $content->update(['sort' => $content->sort - 1]);
                    }
                }
            } else {
                foreach ($contents as $content) {
                    if ($content->sort == $active_sort) {
                        $content->update(['sort' => $over_sort]);
                    } else if ($content->sort < $active_sort && $content->sort >= $over_sort) {
                        $content->update(['sort' => $content->sort + 1]);
                    }
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
        $section = CourseSection::find($section_id);
        if ($section) {
            $section_content = $section->contents()->find($content_id);
            if ($section_content) {
                $section_content->update([
                    'preview' => $request->get_param('preview')
                ]);
            }
        }
        $res['section'] = CourseSection::find($section_id);
        return rest_ensure_response($res);
    }

    public function get_lessons_for_course()
    {
        $res = [];
        $res['lessons'] = Lesson::select(["id", "title"])->get();
        return rest_ensure_response($res);
    }

    public function post_add_create_lesson($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $params = $request->get_json_params();

        $section = CourseSection::find($section_id);
        if ($params['lesson_type'] == 'add_new') {
            $lesson = Lesson::create([
                ...$params,
            ]);
            if (count($params['resources']) > 0) {
                foreach ($params['resources'] as $resource) {
                    if (($resource['type'] == 'upload' && $resource['filename'] !== '') || ($resource['type'] == 'link' && $resource['link'] != '')) {
                        $lesson->lesson_resources()->create($resource);
                    }

                }
            }

            if ($lesson) {
                $section->contents()->create([
                    "course_id" => $params['course_id'],
                    "contentable_type" => Lesson::class,
                    "contentable_id" => $lesson['id'],
                    "sort" => $section->contents()->max('sort') + 1 ?? 1,
                ]);
            }
        }

        if ($params['lesson_type'] == 'existing') {
            if (count($params['lesson_ids']) > 0) {
                foreach ($params['lesson_ids'] as $lesson_id) {
                    $section->contents()->create([
                        "course_id" => $params['course_id'],
                        "contentable_type" => Lesson::class,
                        "contentable_id" => $lesson_id,
                        "sort" => $section->contents()->max('sort') + 1 ?? 1,
                    ]);
                }
            }
        }
        $res['section'] = CourseSection::find($section_id);
        return rest_ensure_response($res);
    }

    public function post_update_lesson_by_id($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $lesson_id = $request['lesson_id'];
        $params = $request->get_json_params();
        $lesson = Lesson::find($lesson_id);
        $lesson->update([
            ...$params,
        ]);
        foreach ($params['resources'] as $resource) {
            if (($resource['type'] == 'upload' && $resource['filename'] !== '') || ($resource['type'] == 'link' && $resource['link'] != '')) {
                $lesson->lesson_resources()->updateOrCreate(
                    ['id' => $resource['id']],
                    $resource
                );
            }
        }
        $lesson->lesson_resources()->whereNotIn('id', array_column($params['resources'], 'id'))->delete();
        $res['section'] = CourseSection::find($section_id);
        return rest_ensure_response($res);
    }

    public function get_quizzes_for_course()
    {
        $res = [];
        $res['quizzes'] = Quiz::select(["id", "title"])->get();
        return rest_ensure_response($res);
    }

    public function post_add_quiz($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $params = $request->get_json_params();
        $section = CourseSection::find($section_id);
        if (count($params['quiz_ids']) > 0) {
            foreach ($params['quiz_ids'] as $quiz_id) {
                $section->contents()->create([
                    "course_id" => $params['course_id'],
                    "contentable_type" => Quiz::class,
                    "contentable_id" => $quiz_id,
                    "sort" => $section->contents()->max('sort') + 1 ?? 1,
                ]);
            }
        }
        $res['section'] = CourseSection::find($section_id);
        return rest_ensure_response($res);
    }

    public function remove_content($request)
    {
        $res = [];
        $section_id = $request['section_id'];
        $section_content_id = $request['section_content_id'];
        $section_content = CourseSectionContent::find($section_content_id);
        if ($section_content) {
            $section_content->delete();
        }
        $res['section'] = CourseSection::find($section_id);
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}