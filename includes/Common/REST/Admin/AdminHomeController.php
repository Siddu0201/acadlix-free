<?php 

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

defined('ABSPATH') || exit();

class AdminHomeController
{
    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-home';
    
    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_home_data'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_home_data($request)
    {
        $res = [];
        $res['quizes'] = acadlix()->model()->quiz()->ofQuiz()->count();
        $res['courses'] = acadlix()->model()->course()->ofCourse()->count();
        $res['lessons'] = acadlix()->model()->lesson()->ofLesson()->count();
        $res['questions'] = acadlix()->model()->question()->ofOnline()->count();        
        $res['today_sale'] = acadlix()->model()->order()->getTodaySalesTotal();
        $res['total_sale'] = acadlix()->model()->order()->getTotalSales();
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}
