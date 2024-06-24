<?php

namespace Yuvayana\Acadlix\REST\Front;

use Illuminate\Contracts\Database\Query\Builder;
use WP_REST_Server;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\QuizAttempt;
use Yuvayana\Acadlix\Models\Statistic;
use Yuvayana\Acadlix\Models\StatisticRef;
use Yuvayana\Acadlix\Models\Toplist;

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

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/load-more-leaderboard/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_load_more_toplist_by_id'],
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
                    $stat_ref?->statistics()?->create([
                        "question_id" => $question["question_id"],
                        "correct_count" => $question["result"]["correct_count"],
                        "incorrect_count" => $question["result"]["incorrect_count"],
                        "hint_count" => $question["result"]["hint_count"],
                        "solved_count" => $question["result"]["solved_count"],
                        "points" => $question["points"],
                        "negative_points" => $question["negative_points"],
                        "question_time" => $question["result"]["time"],
                        "answer_data" => wp_json_encode($question["result"]["answer_data"])
                    ]);
                }
            }
            $res['statistic_ref'] = $statistic_ref->get();

            // Allowed attempt
            $quiz_attempt = QuizAttempt::where("quiz_id", $quiz_id)->where("user_id", $params['user_id']);
            if($params["login_register_type"] == "at_start_of_quiz" && ($params['per_user_allowed_attempt'] == 0 || $params['per_user_allowed_attempt'] > $quiz_attempt->count())){
                QuizAttempt::create([
                    "quiz_id" => $quiz_id,
                    "user_id" => $params["user_id"]
                ]);
            }
            $res['quiz_attempt'] = $quiz_attempt->get();

            // Leaderboard/ Toplist
            if($params['leaderboard']){
                $toplist = Toplist::where("quiz_id", $quiz_id)->where("user_id", $params['user_id']);
                $toplist_data = [
                    "quiz_id" => $quiz_id,
                    "user_id" => $params["user_id"],
                    "name" => $params["name"],
                    "email" => $params["email"],
                    "points" => $params["points"],
                    "result" => $params["result"],
                    "ip" => filter_var($_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP),
                    "quiz_time" => $params["time_taken"],
                    "accuracy" => $params["accuracy"],
                    "status" => $params["status"],
                ];
                if($params["leaderboard_user_can_apply_multiple_times"] && ($params["leaderboard_apply_multiple_number_of_times"] == 0 || $params["leaderboard_apply_multiple_number_of_times"] > $toplist->count())){
                    $top = Toplist::create($toplist_data);
                }elseif(!$params["leaderboard_user_can_apply_multiple_times"] && $toplist->count() == 0){
                    $top = Toplist::create($toplist_data);
                }
                $toplist = Toplist::where('quiz_id', $quiz_id)->orderBy("points", "desc")->orderBy("quiz_time", "asc")->orderBy('created_at', 'asc');
                $res['rank'] = $params['show_rank'] && $toplist->count() > 0 ? array_flip($toplist->pluck("id")->toArray())[$top->id] + 1 : 1;
                $res["toplist_count"] = $toplist->count();
                if($params['leaderboard_total_number_of_entries'] > 0 && $params['leaderboard_total_number_of_entries'] < 10){
                    $res["toplist"] = $toplist->take($params['leaderboard_total_number_of_entries'])->get();
                }else{
                    $res["toplist"] = $toplist->take(10)->get();
                }
            }
        }

        $statistic_ref = StatisticRef::where('quiz_id', $quiz_id);
        $res['average_score'] = $statistic_ref->count() > 0 && $params['show_average_score'] ? $statistic_ref->avg('points') : 0;
        $res['percentile'] = $statistic_ref->count() > 0 && $params['show_percentile'] ? round($params['points'] / $statistic_ref->max('points') * 100, 2) : 0;

        return rest_ensure_response($res);
    }

    public function post_load_more_toplist_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        $toplist = Toplist::where('quiz_id', $quiz_id)->orderBy("points", "desc")->orderBy("quiz_time", "asc")->orderBy('created_at', 'asc');
        $res["toplist_count"] = $toplist->count();
        if($params['leaderboard_total_number_of_entries'] - $params["toplist_view_count"] < 10){
            $res["toplist"] = $toplist->skip($params["toplist_view_count"])->take($params['leaderboard_total_number_of_entries'] - $params["toplist_view_count"])->get();
        }else{
            $res["toplist"] = $toplist->skip($params["toplist_view_count"])->take(10)->get();
        }
        return rest_ensure_response( $res );
    }

    public function check_permission()
    {
        return true;
    }
}