<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;

use Yuvayana\Acadlix\Models\Language;

defined( 'ABSPATH' ) || exit();

class AdminLanguageController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-language';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_languages'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_language'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<language_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_language_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'language_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_language_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'language_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_language_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'language_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }

    public function get_languages($request)
    {
        
    }

    public function post_create_language($request)
    {
        return rest_ensure_response($request->get_url_params());
    }

    public function get_language_by_id($request)
    {
        $res = [];
        $language_id = $request['language_id'];
        $res['language'] = Language::find($language_id);
        return rest_ensure_response($res);
    }

    public function update_language_by_id($request)
    {
        $language_id = $request['language_id'];
        return rest_ensure_response("Update language by ID: $language_id");
    }

    public function delete_language_by_id($request)
    {
        $language_id = $request['language_id'];
        return rest_ensure_response("Delete a language $language_id");
    }

    public function check_permission()
    {
        return true;
    }
}
