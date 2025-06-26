<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class AdminTemplateController {

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-template';

    public function register_routes(){
        register_rest_route(
            $this->namespace, '/' . $this->base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_templates' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'post_save_template' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );
        register_rest_route( 
            $this->namespace, '/' . $this->base . '/(?P<template_id>[\d]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_template_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args' => array(
                        'quiz_id' => array(
                          'validate_callback' => function($param, $request, $key) {
                            return is_numeric( $param );
                          }
                        ),
                    ),
                ],
            ]
         );
    }

    public function get_templates($request) {
        $res = [];
        $params = $request->get_params();
        if($params['type']){
            $res[] = acadlix()->model()->template()->where('type', $params['type'])->get();
        }
        return rest_ensure_response( $res );
    }

    public function post_save_template($request){
        $res = [];
        $params = $request->get_json_params();
        if($params['id'] && $params['id'] > 0){
            $template = acadlix()->model()->template()->find($params['id']);
            $template->update([
                'type' => $params['type'],
                'data' => $params['data']
            ]);
        }elseif($params['name']){
            acadlix()->model()->template()->create([
                'name' => $params['name'],
                'type' => $params['type'],
                'data' => $params['data']
            ]);
        }
        $res['templates'] = acadlix()->model()->template()->where('type', $params['type'])->get(['id', 'name']);
        return rest_ensure_response( $res );        
    }

    public function get_template_by_id($request){
        $res = [];
        $id = $request['template_id'];
        $res['template'] = acadlix()->model()->template()->find($id);
        return rest_ensure_response( $res );
    }

    public function check_permission() {
        return true;
    }
}