<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

defined('ABSPATH') || exit();

use WP_REST_Server;
use WP_Error;

class AdminTemplateController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-template';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_templates'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_template');
          },
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_save_template'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_template');
          },
        ],
      ]
    );
    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<template_id>[\d]+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_template_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_template');
          },
          'args' => array(
            'template_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_template_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_template');
          },
          'args' => array(
            'template_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_template_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_template');
          },
          'args' => array(
            'template_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
      ]
    );
  }

  public function get_templates($request)
  {
    $res = [];
    $params = $request->get_params();
    if ($params['type']) {
      $res["templates"] = acadlix()->model()->template()->where('type', $params['type'])->get();
    }
    return rest_ensure_response($res);
  }

  public function post_save_template($request)
  {
    $res = [];
    $params = $request->get_json_params();
    if ($params['id'] && $params['id'] > 0) {
      $template = acadlix()->model()->template()->find($params['id']);
      $template->update([
        'type' => $params['type'],
        'data' => $params['data']
      ]);
    } elseif ($params['name']) {
      acadlix()->model()->template()->create([
        'name' => $params['name'],
        'type' => $params['type'],
        'data' => $params['data']
      ]);
    }
    $res['templates'] = acadlix()->model()->template()->where('type', $params['type'])->get(['id', 'name']);
    return rest_ensure_response($res);
  }

  public function get_template_by_id($request)
  {
    $res = [];
    $id = $request['template_id'];
    $res['template'] = acadlix()->model()->template()->find($id);
    return rest_ensure_response($res);
  }

  public function update_template_by_id($request)
  {
    $res = [];
    $id = $request['template_id'];
    $params = $request->get_json_params();
    $template = acadlix()->model()->template()->find($id);
    if ($template) {
      $template->update([
        'name' => $params['name'],
      ]);
    }
    if ($params['type']) {
      $res["templates"] = acadlix()->model()->template()->where('type', $params['type'])->get();
    }
    return rest_ensure_response($res);
  }

  public function delete_template_by_id($request)
  {
    $res = [];
    $id = $request['template_id'];
    $params = $request->get_params();
    $template = acadlix()->model()->template()->find($id);
    if ($template) {
      $template->delete();
      $res['message'] = __('Template deleted successfully', 'acadlix');
    } else {
      return new WP_Error('template_not_found', __('Template not found', 'acadlix'), array('status' => 404));
    }
    if($params['type']) {
      $res["templates"] = acadlix()->model()->template()->where('type', $params['type'])->get();
    }
    return rest_ensure_response($res);
  }
}