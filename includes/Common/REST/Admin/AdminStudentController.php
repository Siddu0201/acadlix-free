<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
defined('ABSPATH') || exit();
class AdminStudentController
{

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-student';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_students'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_students($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];
        $skip = $params['page'] * $params['pageSize'];
        $student = acadlix()->model()->wpUsers()->withCount([
            'coursesPurchased as course_count' => function ($query) {
                $query->distinct('course_id');
            }
        ])
            ->whereHas('orders', function ($q) {
                $q->ofSuccess(); // optional status filter
            })
            ->orderBy('course_count', 'desc'); // or 'asc'
        if (!empty($search)) {
            $student->where('display_name', 'like', "%$search%")
                ->orWhere("user_email", "like", "%$search%");
        }
        $res['total'] = $student->count();
        $res['students'] = $student->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}
