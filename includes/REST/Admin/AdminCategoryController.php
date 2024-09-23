<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;

use Yuvayana\Acadlix\Models\Category;

defined('ABSPATH') || exit();

class AdminCategoryController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-category';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_categories'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_category'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<category_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_category_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'category_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_category_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'category_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_category_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'category_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }

    public function get_categories($request)
    {
        $res = [];
        $res['categories'] = Category::get();
        return rest_ensure_response($res);
    }

    public function post_create_category($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $category = Category::create(["category_name" => $params["category"]]);
        $res['category_id'] = $category->id;
        $res['categories'] = Category::get();
        return rest_ensure_response($res);
    }

    public function get_category_by_id($request)
    {
        $res = [];
        $category_id = $request['category_id'];
        $res['category'] = Category::find($category_id);
        return rest_ensure_response($res);
    }

    public function update_category_by_id($request)
    {
        $category_id = $request['category_id'];
        return rest_ensure_response("Update category by ID: $category_id");
    }

    public function delete_category_by_id($request)
    {
        $category_id = $request['category_id'];
        return rest_ensure_response("Delete a category $category_id");
    }

    public function check_permission()
    {
        return true;
    }
}
