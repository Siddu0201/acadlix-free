<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

defined('ABSPATH') || exit();

class AdminSettingController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-setting';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/create-page',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_page'],
                    'permission_callback' => fn() => current_user_can('acadlix_create_page_setting') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_update_settings'],
                    'permission_callback' => fn() => current_user_can('acadlix_update_setting') && $this->check_permission(),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_update_settings'],
                    'permission_callback' => fn() => current_user_can('acadlix_update_setting') && $this->check_permission(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/test-email',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_test_email'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function post_create_page($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $res['page_id'] = wp_insert_post([
            'post_title' => $params['title'],
            'post_status' => 'publish',
            'post_author' => $params['user_id'] ?? 0,
            'post_type' => 'page',
        ]);
        $res['all_pages'] = get_pages();
        return rest_ensure_response($res);
    }

    public function get_update_settings($request)
    {
        $res = [];
        $res['options'] = acadlix()->helper()->acadlix_get_all_options(
            array_merge(
                acadlix()->helper()->acadlix_options(),
                acadlix()->helper()->acadlix_advance_options()
            )
        );
        $res['all_pages'] = get_pages();
        $res['currencies_with_symbol'] = acadlix()->helper()->acadlix_get_currency_with_symbols();
        return rest_ensure_response($res);
    }

    public function post_update_settings($request)
    {
        $res = [];
        $params = $request->get_json_params();

        $old_course_base = acadlix()->helper()->acadlix_get_option('acadlix_course_base') ?? null;
        $new_course_base = array_key_exists('acadlix_course_base', $params) ? $params['acadlix_course_base'] : null;

        $old_course_category_base = acadlix()->helper()->acadlix_get_option('acadlix_course_category_base') ?? null;
        $new_course_category_base = array_key_exists('acadlix_course_category_base', $params) ? $params['acadlix_course_category_base'] : null;

        $old_course_tag_base = acadlix()->helper()->acadlix_get_option('acadlix_course_tag_base') ?? null;
        $new_course_tag_base = array_key_exists('acadlix_course_tag_base', $params) ? $params['acadlix_course_tag_base'] : null;

        if ($old_course_base && $new_course_base && $old_course_base != $new_course_base) {
            acadlix()->helper()->acadlix_update_option('acadlix_flush_rewrite', true);
        }
        if ($old_course_category_base && $new_course_category_base && $old_course_category_base != $new_course_category_base) {
            acadlix()->helper()->acadlix_update_option('acadlix_flush_rewrite', true);
        }
        if ($old_course_tag_base && $new_course_tag_base && $old_course_tag_base != $new_course_tag_base) {
            acadlix()->helper()->acadlix_update_option('acadlix_flush_rewrite', true);
        }
        if (is_array($params)) {
            foreach ($params as $key => $value) {
                acadlix()->helper()->acadlix_update_option($key, $value);
            }
        }
        $res['options'] = acadlix()->helper()->acadlix_get_all_options();
        return rest_ensure_response($res);
    }

    public function post_test_email($request)
    {
        $res = [];
        $params = $request->get_json_params();

        $mail = acadlix()->helper()->email()->sendEmail($params['to'], $params['subject'], $params['message'], "siddu@gmail.com");
        if (is_wp_error($mail)) {
            return $mail;
        }
        $res['message'] = __('Email sent successfully', 'acadlix');
        return rest_ensure_response($res);
    }


    public function check_permission()
    {
        return true;
    }
}