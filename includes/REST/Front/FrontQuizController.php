<?php

namespace Yuvayana\Acadlix\REST\Front;

use Illuminate\Contracts\Database\Query\Builder;
use WP_REST_Server;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\Statistic;
use Yuvayana\Acadlix\Models\StatisticRef;

class FrontQuizController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-quiz';

    public function register_routes()
    {

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_front_quiz_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_save_result_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }

    public function get_front_quiz_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['quiz'] = Quiz::with([
            'questions' => function (Builder $query) {
                $query->where('online', 1);
            }
        ])->find($quiz_id);
        return rest_ensure_response($res);
    }

    public function post_save_result_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        if ($params['user_id'] > 0 && $params['enable_login_register']) {

            // Statistic check and save
            $statistic_ref = StatisticRef::where("quiz_id", $quiz_id)->where("user_id", $params['user_id']);
            if ($params['save_statistic'] && ($params['statistic_ip_lock'] == 0 || round((time() - strtotime($statistic_ref->latest()->first()->created_at)) / 60) > $params["statistic_ip_lock"]) && ($params['save_statistic_number_of_times'] == 0 || $params['save_statistic_number_of_times'] > $statistic_ref->count())) {
                $stat_ref = StatisticRef::create([
                    "quiz_id" => $quiz_id,
                    "user_id" => $params["user_id"],
                    "points" => $params["points"],
                    "result" => $params["result"],
                    "quiz_time" => $params["time_taken"]
                ]);
                foreach ($params['questions'] as $question) {
                    $stat_ref->statistic()->create([
                        "statistic_ref_id" => $stat_ref->id,
                        "question_id" => $question["question_id"],
                        "correct_count" => $question["result"]["correct_count"],
                        "incorrect_count" => $question["result"]["incorrect_count"],
                        "hint_count" => $question["result"]["hint_count"],
                        "solved_count" => $question["result"]["solved_count"],
                        "points" => $question["points"],
                        "negative_points" => $question["negative_points"],
                        "question_time" => $question["result"]["time"],
                        "answer_data" => json_encode($question["result"]["answer_data"])
                    ]);
                }
            }
            $res['statistic_ref'] = $statistic_ref->get();

            // Allowed attempt
        }
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}