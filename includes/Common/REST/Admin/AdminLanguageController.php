<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

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
                    'permission_callback' => fn() => current_user_can('acadlix_show_quiz_language') && $this->check_permission(),
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_language'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_quiz_language') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_edit_quiz_language') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_edit_quiz_language') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_delete_quiz_language') && $this->check_permission(),
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

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/default-language/(?P<language_id>[\d]+)',
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'default_language_by_id'],
                'permission_callback' => fn() => current_user_can('acadlix_default_quiz_language') && $this->check_permission(),
                'args' => array(
                    'language_id' => array(
                        'validate_callback' => function ($param, $request, $key) {
                            return is_numeric($param);
                        }
                    ),
                ),
            ],
        );
    }

    public function get_languages($request)
    {
        $res = [];
        $res['languages'] = acadlix()->model()->language()->all();
        return rest_ensure_response($res);
    }

    public function post_create_language($request)
    {
        $res = [];
        $params = $request->get_json_params();

        if (empty($params["language_name"])) {
            return new WP_Error(
                'missing_language',
                __('Language name is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $language = acadlix()->model()->language()->create(["language_name" => $params["language_name"]]);

        if (is_wp_error($language)) {
            return new WP_Error(
                'language_not_created',
                __('Failed to create the language.', 'acadlix'),
                ['status' => 500]
            );
        }
        $res['language'] = $language;
        $res['languages'] = acadlix()->model()->language()->all();
        return rest_ensure_response($res);
    }

    public function get_language_by_id($request)
    {
        $res = [];
        $language_id = $request['language_id'];
        $res['language'] = acadlix()->model()->language()->find($language_id);
        return rest_ensure_response($res);
    }

    public function update_language_by_id($request)
    {
        $res = [];
        $language_id = $request['language_id'];
        $params = $request->get_json_params();

        if (empty($language_id)) {
            return new WP_Error(
                'missing_language',
                __('Language id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        if (empty($params["language_name"])) {
            return new WP_Error(
                'missing_language',
                __('Language name is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $language = acadlix()->model()->language()->update($language_id, [
            "language_name" => $params["language_name"]
        ]);

        if (is_wp_error($language)) {
            return new WP_Error(
                'language_not_updated',
                __('Failed to update the language.', 'acadlix'),
                ['status' => 500]
            );
        }
        $res['language'] = $language;
        $res['languages'] = acadlix()->model()->language()->all();
        return rest_ensure_response($res);
    }

    public function default_language_by_id($request)
    {
        $res = [];
        $language_id = $request['language_id'];

        if (empty($language_id)) {
            return new WP_Error(
                'missing_language',
                __('Language id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $language = acadlix()->model()->language()->update_default($language_id);
        if (is_wp_error($language)) {
            return new WP_Error(
                'language_not_updated',
                __('Failed to update the language.', 'acadlix'),
                ['status' => 500]
            );
        }

        $res['language'] = $language;
        $res['languages'] = acadlix()->model()->language()->all();
        return rest_ensure_response($res);
    }

    public function delete_language_by_id($request)
    {
        $res = [];
        $language_id = $request['language_id'];
        $language = acadlix()->model()->language()->delete($language_id);
        if (is_wp_error($language)) {
            return new WP_Error(
                'language_not_deleted',
                __('Failed to delete the language.', 'acadlix'),
                ['status' => 500]
            );
        }
        $res['language'] = $language;
        $res['categories'] = acadlix()->model()->language()->all();
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}
