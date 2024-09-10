<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Lesson;
defined('ABSPATH') || exit();

class AdminLessonController
{

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-lesson';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_lessons'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_lesson'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<lesson_id>[\d]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_lesson_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args' => array(
                        'lesson_id' => array(
                          'validate_callback' => function($param, $request, $key) {
                            return is_numeric( $param );
                          }
                        ),
                    ),
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_lesson_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args' => array(
                        'lesson_id' => array(
                          'validate_callback' => function($param, $request, $key) {
                            return is_numeric( $param );
                          }
                        ),
                    ),
                ],
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_lesson_by_id' ],
                    'permission_callback' => function (WP_REST_Request $request){
                        if(wp_verify_nonce( $request->get_header('X-WP-Nonce'), 'wp_rest' )){
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'lesson_id' => array(
                          'validate_callback' => function($param, $request, $key) {
                            return is_numeric( $param );
                          }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route( 
            $this->namespace, '/' . $this->base . '/delete-bulk-lesson', 
            [
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_bulk_lesson' ],
                    'permission_callback' => function (WP_REST_REQUEST $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                ],
            ]
        );
    }

    public function get_lessons($request) {
        $res = [];
        $params = $request->get_params();
        $skip = $params['page'] * $params['pageSize'];
        $lesson = Lesson::withCount(['lesson_resources'])->orderBy('created_at', 'desc');
        $res['total'] = $lesson->count();
        $res['lessons'] = $lesson->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function post_create_lesson($request){
        $res = [];
        $params = $request->get_json_params();
        $lesson = Lesson::create($params);
        if(count($params['resources']) > 0){
            $lesson->lesson_resources()->createMany($params['resources']);
        }
        $res['lesson'] = $lesson;
        return rest_ensure_response($res);
    }

    public function get_lesson_by_id($request){
        $res = [];
        $lesson_id = $request['lesson_id'];
        $res['lesson'] = Lesson::find($lesson_id);
        return rest_ensure_response($res);
    }

    public function update_lesson_by_id($request){
        $res = [];
        $lesson_id = $request['lesson_id'];
        $params = $request->get_json_params();
        $lesson = Lesson::find($lesson_id);
        $lesson->update($params);
        foreach($params['resources'] as $resource){
            $lesson->lesson_resources()->updateOrCreate(
                ['id' => $resource['id']],
                $resource
            );
        }
        $lesson->lesson_resources()->whereNotIn('id', array_column($params['resources'], 'id'))->delete();
        $res['lesson'] = Lesson::find($lesson_id);
        return rest_ensure_response($res);
        
    }

    public function delete_lesson_by_id($request){
        $res = [];
        $lesson_id = $request['lesson_id'];
        $lesson = Lesson::find($lesson_id);
        $lesson->delete();
        $res['lesson'] = $lesson;
        return rest_ensure_response($res);
    }

    public function delete_bulk_lesson($request){
        $res = [];
        $params = $request->get_json_params();
        if(count($params['lesson_ids']) > 0){
            foreach($params['lesson_ids'] as $lesson_id){
                $lesson = Lesson::find($lesson_id);
                $lesson->delete();
            }
        }
        return rest_ensure_response( $res );
    }

    public function check_permission(){
        return true;
    }
}