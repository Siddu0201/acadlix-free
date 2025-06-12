<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

use Yuvayana\Acadlix\Common\Models\Subject;

defined( 'ABSPATH' ) || exit();

class AdminSubjectController {

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-subject';

    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base ,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_subjects' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'post_create_subject' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                ]
            );
            
            register_rest_route(
                $this->namespace, '/' . $this->base . '/(?P<subject_id>[\d]+)',
                [
                    [
                        'methods'             => WP_REST_Server::READABLE,
                        'callback'            => [ $this, 'get_subject_by_id' ],
                        'permission_callback' => [ $this, 'check_permission' ],
                        'args' => array(
                            'subject_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                        ),
                    ],
                    [
                        'methods'             => WP_REST_Server::EDITABLE,
                        'callback'            => [ $this, 'update_subject_by_id' ],
                        'permission_callback' => [ $this, 'check_permission' ],
                        'args' => array(
                            'subject_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                        ),
                    ],
                    [
                        'methods'             => WP_REST_Server::DELETABLE,
                        'callback'            => [ $this, 'delete_subject_by_id' ],
                        'permission_callback' => [ $this, 'check_permission' ],
                        'args' => array(
                            'subject_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                        ),
                    ],
            ]
        );
    }

    public function get_subjects($request) {
        $res = [];
        $res['subjects'] = Subject::get();
        return rest_ensure_response($res);
    }

    public function post_create_subject($request) {
        $res = [];
        $params = $request->get_json_params();
        $subject = Subject::create(["subject_name" => $params["subject"]]);
        $res['subject_id'] = $subject->id;
        $res['subjects'] = Subject::get();
        return rest_ensure_response($res);
    }
    
    public function get_subject_by_id($request) {
        $res = [];
        $subject_id = $request['subject_id'];
        $res['subject'] = Subject::find($subject_id);
        return rest_ensure_response($res);
    }
    
    public function update_subject_by_id($request) {
        $subject_id = $request['subject_id'];
        return rest_ensure_response("Update subject by ID: $subject_id");
    }
    
    public function delete_subject_by_id($request) {
        $subject_id = $request['subject_id'];
        return rest_ensure_response("Delete a subject $subject_id");
    }

    public function check_permission() {
        return true;
    }
}
