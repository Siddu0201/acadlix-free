<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
use Yuvayana\Acadlix\Common\Helper\CptHelper;
use Yuvayana\Acadlix\Common\Models\Paragraph;
use Yuvayana\Acadlix\Common\Models\Quiz;
defined('ABSPATH') || exit();

class AdminParagraphController
{

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-paragraph';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/paragraph',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quiz_paragraphs'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_quiz_paragraph'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/paragraph/create',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_create_quiz_paragraph'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/paragraph/(?P<paragraph_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quiz_paragraph_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'paragraph_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_quiz_paragraph_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'paragraph_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_quiz_paragraph_by_id'],
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'paragraph_id' => array(
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
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/paragraph/delete-bulk-paragraph',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_bulk_paragraph'],
                    'permission_callback' => function (WP_REST_REQUEST $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }

    public function get_quiz_paragraphs($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_params();
        $search = $params['search'];

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $skip = $params['page'] * $params['pageSize'];
        $paragraph = Paragraph::ofParagraph()->where('post_parent', $quiz_id)->orderBy('ID', 'desc');
        if (!empty($search)) {
            $paragraph->where(function ($query) use ($search) {
                $query->where('post_title', 'like', "%$search%");
            });
        }
        $res['total'] = $paragraph->count();
        $res['paragraphs'] = $paragraph->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_quiz_paragraph($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $res['quiz'] = Quiz::find($quiz_id);
        return rest_ensure_response($res);
    }

    public function post_create_quiz_paragraph($request)
    {
        $res = [];
        $params = $request->get_json_params();
        // Validate required fields
        if (empty($params['post_title'])) {
            return new WP_Error(
                'missing_title',
                __('Paragraph title is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'paragraph')
            : [];
        try {
            $paragraphId = Paragraph::insertParagraph([
                'post_title' => sanitize_text_field($params['post_title']),
                'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
                'post_parent' => (int) sanitize_text_field($params['post_parent']),
            ], $meta);

            if (is_wp_error($paragraphId)) {
                return new WP_Error(
                    'paragraph_creation_failed',
                    __('Failed to create the paragraph.', 'acadlix'),
                    ['status' => 500, 'error' => $paragraphId->get_error_message()]
                );
            }
            // Retrieve and return the paragraph data
            $paragraph = get_post($paragraphId);
            if (!$paragraph) {
                return new WP_Error(
                    'paragraph_not_found',
                    __('Created paragraph not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['paragraph'] = $paragraph;
            return rest_ensure_response($res);
        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function get_quiz_paragraph_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $paragraph_id = $request['paragraph_id'];
        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        // Validate required fields
        if (empty($paragraph_id)) {
            return new WP_Error(
                'missing_paragraph_id',
                __('Paragraph ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $res['quiz'] = Quiz::find($quiz_id);
        $res['paragraph'] = Paragraph::find($paragraph_id);
        return rest_ensure_response($res);
    }

    public function update_quiz_paragraph_by_id($request)
    {
        $res = [];
        $paragraph_id = $request['paragraph_id'];
        $params = $request->get_json_params();
        // Validate required fields
        if (empty($paragraph_id)) {
            return new WP_Error(
                'missing_paragraph_id',
                __('Paragraph ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        // Prepare meta data
        $meta = !empty($params['meta']) && is_array($params['meta'])
            ? CptHelper::instance()->acadlix_add_prefix_meta_keys($params['meta'], 'paragraph')
            : [];

        try {
            $paragraphId = Paragraph::updateParagraph(
                $paragraph_id,
                [
                    'post_title' => sanitize_text_field($params['post_title']),
                    'post_author' => (int) sanitize_text_field($params['post_author']), // Assign to current user
                    'post_parent' => (int) sanitize_text_field($params['post_parent']),
                ],
                $meta
            );

            if (is_wp_error($paragraphId)) {
                return new WP_Error(
                    'paragraph_updation_failed',
                    __('Failed to update the paragraph.', 'acadlix'),
                    ['status' => 500, 'error' => $paragraphId->get_error_message()]
                );
            }
            // Retrieve and return the paragraph data
            $paragraph = get_post($paragraphId);
            if (!$paragraph) {
                return new WP_Error(
                    'paragraph_not_found',
                    __('Created paragraph not found.', 'acadlix'),
                    ['status' => 500]
                );
            }

            $res['paragraph'] = $paragraph;
            return rest_ensure_response($res);
        } catch (Exception $e) {
            return new WP_Error(
                'exception_occurred',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    public function delete_quiz_paragraph_by_id($request)
    {
        $res = [];
        $paragraph_id = $request['paragraph_id'];

        // Validate required fields
        if (empty($paragraph_id)) {
            return new WP_Error(
                'missing_paragraph_id',
                __('Paragraph ID is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $paragraph = Paragraph::deleteParagraph($paragraph_id);
        if (is_wp_error($paragraph)) {
            return new WP_Error(
                'paragraph_deletion_failed',
                __('Failed to delete the paragraph.', 'acadlix'),
                ['status' => 500, 'error' => $paragraph->get_error_message()]
            );
        }
        $res['message'] = __('Paragraph successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function delete_bulk_paragraph($request)
    {
        $res = [];
        $params = $request->get_json_params();

        // Validate required fields
        if (!is_array($params['paragraph_ids']) || count($params['paragraph_ids']) == 0) {
            return new WP_Error(
                'missing_ids',
                __('Paragraph ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        foreach ($params['paragraph_ids'] as $paragraph_id) {
            if (empty($paragraph_id)) {
                return new WP_Error(
                    'missing_paragraph_id',
                    __('Paragraph ID is required.', 'acadlix'),
                    ['status' => 400]
                );
            }
            $paragraph = Paragraph::deleteParagraph($paragraph_id);
            if (is_wp_error($paragraph)) {
                return new WP_Error(
                    'paragraph_deletion_failed',
                    __('Failed to delete the paragraph.', 'acadlix'),
                    ['status' => 500, 'error' => $paragraph->get_error_message()]
                );
            }
        }
        $res['message'] = __('Paragraph successfully deleted', 'acadlix');
        return rest_ensure_response($res);
    }

    public function check_permission()
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