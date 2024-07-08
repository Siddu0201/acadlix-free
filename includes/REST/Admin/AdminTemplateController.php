<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\Category;
use Yuvayana\Acadlix\Models\Language;
use Illuminate\Contracts\Database\Query\Builder;
use Yuvayana\Acadlix\Models\Template;

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
            $res[] = Template::where('type', $params['type'])->get();
        }
        return rest_ensure_response( $res );
    }

    public function post_save_template($request){
        $res = [];
        $params = $request->get_json_params();
        if($params['id'] && $params['id'] > 0){
            $template = Template::find($params['id']);
            $template->update([
                'type' => $params['type'],
                'data' => $params['data']
            ]);
        }elseif($params['name']){
            Template::create([
                'name' => $params['name'],
                'type' => $params['type'],
                'data' => $params['data']
            ]);
        }
        $res['templates'] = Template::where('type', $params['type'])->get(['id', 'name']);
        return rest_ensure_response( $res );        
    }

    public function get_template_by_id($request){
        $res = [];
        $id = $request['template_id'];
        $res['template'] = Template::find($id);
        return rest_ensure_response( $res );
    }

    public function check_permission() {
        return true;
    }
}