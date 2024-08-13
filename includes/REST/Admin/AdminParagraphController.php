<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Paragraph;
use Yuvayana\Acadlix\Models\Quiz;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

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
        $skip = $params['page'] * $params['pageSize'];
        $paragraph = Paragraph::withCount(['questions' => function ($query){
            $query->where('online', 1);
        }])->where('quiz_id', $quiz_id)->orderBy('created_at', 'desc');
        $res['total'] = $paragraph->count();
        $res['paragraphs'] = $paragraph->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_quiz_paragraph($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['quiz'] = Quiz::find($quiz_id);
        return rest_ensure_response($res);
    }

    public function post_create_quiz_paragraph($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $paragraph = Paragraph::create($params);
        $paragraph->paragraph_languages()->createMany($params['language']);
        $res['paragraph'] = $paragraph;
        return rest_ensure_response($res);
    }

    public function get_quiz_paragraph_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $paragraph_id = $request['paragraph_id'];
        $res['quiz'] = Quiz::find($quiz_id);
        $res['paragraph'] = Paragraph::find($paragraph_id);
        return rest_ensure_response($res);
    }

    public function update_quiz_paragraph_by_id($request)
    {
        $res = [];
        $paragraph_id = $request['paragraph_id'];
        $params = $request->get_json_params();
        $paragraph = Paragraph::find($paragraph_id);
        $paragraph->update($params);
        foreach($params['language'] as $lang){
            $paragraph->paragraph_languages()->updateOrCreate(
                ['language_id' => $lang['language_id']],
                $lang
            );
        }
        $res['paragraph'] = $paragraph;
        return rest_ensure_response($res);
    }

    public function delete_quiz_paragraph_by_id($request)
    {
        $res = [];
        $paragraph_id = $request['paragraph_id'];
        $paragraph = Paragraph::find($paragraph_id);
        $paragraph->delete();
        return rest_ensure_response($res);
    }

    public function delete_bulk_paragraph($request)
    {
        $res = [];
        $params = $request->get_json_params();
        if (count($params['paragraph_ids']) > 0) {
            foreach ($params['paragraph_ids'] as $paragraph_id) {
                $paragraph = Paragraph::find($paragraph_id);
                $paragraph->delete();
            }
        }
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}