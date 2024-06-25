<?php

namespace Yuvayana\Acadlix\REST\Front;

use Illuminate\Contracts\Database\Query\Builder;
use WP_REST_Server;
use Yuvayana\Acadlix\Models\Prerequisite;
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

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/check-prerequisite/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_check_prerequisite_by_id'],
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
        $quiz = Quiz::with([
            'questions' => function (Builder $query) {
                $query->where('online', 1);
            }
        ])->find($quiz_id);
        $quiz['description'] = $this->renderShortCode($quiz['description']);
        $quiz['result_text'] = $quiz['percent_based_result_text'] ? $quiz['result_text'] : $this->renderShortCode($quiz['result_text']);

        foreach($quiz->questions as $qkey => $question){
            foreach($question->question_languages as $lkey => $lang){
                $lang['question'] = $this->renderShortCode($lang['question']);
                $lang['hint_msg'] = $this->renderShortCode($lang['hint_msg']);
                $lang['correct_msg'] = $this->renderShortCode($lang['correct_msg']);
                $lang['incorrect_msg'] = $this->renderShortCode($lang['incorrect_msg']);

                if(in_array($question['answer_type'], ['singleChoice', 'multipleChoice', 'sortingChoice'])){
                    $lang['answer_data'] = json_decode($lang['answer_data'], true);
                    $newLang['answer_data'] = $lang['answer_data'];
                    foreach($lang['answer_data'][$question['answer_type']] as $okey => $opt){
                        $opt['option'] = $this->renderShortCode($opt["option"]);
                        $newLang['answer_data'][$question['answer_type']][$okey] = $opt;
                    }
                    $lang['answer_data'] = json_encode($newLang['answer_data']);
                }
                $quiz['questions'][$qkey]['question_languages'][$lkey] = $lang;
            }
        }
        $res['quiz'] = $quiz;
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

    public function post_check_prerequisite_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        $i = 0;
        $prerquisite_quizzes = Prerequisite::where("quiz_id", $quiz_id)->get();
        if(count($prerquisite_quizzes) > 0){
            foreach($prerquisite_quizzes as $prerquisite_quiz){
                $statistic_ref = StatisticRef::where('quiz_id', $prerquisite_quiz->prerequisite_quiz_id)->where('user_id', $params['user_id']);
                if($statistic_ref->count() > 0){
                    if($statistic_ref->max('result') < $prerquisite_quiz->min_percentage){
                        $res[$i]['title'] = $prerquisite_quiz->prerequisite_quiz->title;
                        $res[$i]['min_percentage'] = $prerquisite_quiz->min_percentage;
                        $i++;
                    }
                }else{
                    $res[$i]['title'] = $prerquisite_quiz->prerequisite_quiz->title;
                    $res[$i]['min_percentage'] = $prerquisite_quiz->min_percentage;
                    $i++;
                }
            }
        }
        return rest_ensure_response( $res );
    }

    public function check_permission()
    {
        return true;
    }

    public function renderShortCode($data){
        return do_shortcode(apply_filters('comment_text',  $data));
    }
}