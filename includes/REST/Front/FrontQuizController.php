<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use WP_Error;
use Illuminate\Contracts\Database\Query\Builder;
use Yuvayana\Acadlix\Helper\EmailHelper;
use Yuvayana\Acadlix\Models\Prerequisite;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\StatisticRef;
use Yuvayana\Acadlix\Models\Toplist;
use Yuvayana\Acadlix\Models\UserActivityMeta;

defined('ABSPATH') || exit();

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
            '/' . $this->base . '/(?P<quiz_id>[\d]+)' . '/save-quiz-attempt',
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'post_save_quiz_attempt_by_id'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => array(
                    'quiz_id' => array(
                        'validate_callback' => function ($param, $request, $key) {
                            return is_numeric($param);
                        }
                    ),
                ),
            ],
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
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/check-quiz',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_check_quiz_by_id'],
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

        // Validate required fields
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $quiz = Quiz::ofQuiz()->find($quiz_id)->setAppends([
            'rendered_post_content',
            'rendered_metas',
            'category',
            'languages',
            'subject_times',
            'rendered_questions',
        ]);
        $custom_logo_id = get_theme_mod('custom_logo');
        $res['logo'] = wp_get_attachment_image_url($custom_logo_id, 'full');

        $res['quiz'] = $quiz;
        return rest_ensure_response($res);
    }

    public function post_check_quiz_by_id($request)
    {
        $res = [];
        $errors = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $quiz = Quiz::ofQuiz()->find($quiz_id);
        $user_id = $params['user_id'];
        $user_token = $params['user_token'];

        // check quiz attempt
        $per_user_allowed_attempt = $quiz->rendered_metas['quiz_settings']['per_user_allowed_attempt'] ?? 0;
        if ($per_user_allowed_attempt > 0) {
            $user_attempts = UserActivityMeta::ofQuiz()
                ->ofQuizAttempt()
                ->where('type_id', $quiz_id)
                ->when($user_id > 0, fn($query) => $query->where('user_id', $params['user_id']))
                ->when($user_id == 0 && $user_token != '', fn($query) => $query->where('user_token', $params['user_token']))
                ->first();
            ;

            if ($user_attempts && $user_attempts->meta_value >= $per_user_allowed_attempt) {
                $errors[] = __('You have reached your maximum limit of attempts.', 'acadlix');
            }
        }

        // check prerequisite for future

        // $i = 0;
        // $prerquisite_quizzes = Prerequisite::where("quiz_id", $quiz_id)->get();
        // if (count($prerquisite_quizzes) > 0) {
        //     foreach ($prerquisite_quizzes as $prerquisite_quiz) {
        //         $statistic_ref = StatisticRef::where('quiz_id', $prerquisite_quiz->prerequisite_quiz_id)->where('user_id', $params['user_id']);
        //         if ($statistic_ref->count() > 0) {
        //             if ($statistic_ref->max('result') < $prerquisite_quiz->min_percentage) {
        //                 $res['prerequisite'][$i]['title'] = $prerquisite_quiz->prerequisite_quiz->title;
        //                 $res['prerequisite'][$i]['min_percentage'] = $prerquisite_quiz->min_percentage;
        //                 $i++;
        //             }
        //         } else {
        //             $res['prerequisite'][$i]['title'] = $prerquisite_quiz->prerequisite_quiz->title;
        //             $res['prerequisite'][$i]['min_percentage'] = $prerquisite_quiz->min_percentage;
        //             $i++;
        //         }
        //     }
        // }

        // Handle error
        $html = '';
        if (count($errors) > 0) {
            $html .= "<ul>";
            foreach ($errors as $error) {
                $html .= "<li>{$error}</li>";
            }
            $html .= "</ul>";
        }

        $res['errors'] = $html;
        return rest_ensure_response($res);
    }

    public function post_save_quiz_attempt_by_id($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $quiz_id = $request['quiz_id'];

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $user_id = $params['user_id'];
        $user_token = $params['user_token'];

        $attempts = UserActivityMeta::ofQuiz()
            ->ofQuizAttempt()
            ->where("type_id", $quiz_id)
            ->when($user_id > 0, fn($query) => $query->where('user_id', $params['user_id']))
            ->when($user_id == 0 && $user_token != '', fn($query) => $query->where('user_token', $params['user_token']))
            ->first();

        if ($attempts) {
            $attempts->update([
                'meta_value' => (int) $attempts->meta_value + 1
            ]);
        } else {
            $attempts = UserActivityMeta::create([
                "user_token" => $params['user_token'],
                "user_id" => $params['user_id'],
                "type" => "quiz",
                "type_id" => $quiz_id,
                "meta_key" => "quiz_attempt",
                "meta_value" => 1
            ]);
        }
        $res['attempts'] = $attempts;

        return rest_ensure_response($res);
    }

    public function post_save_result_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $quiz = Quiz::ofQuiz()->find($quiz_id);
        $user_id = $params['user_id'];
        $user_token = $params['user_token'];
        $data = [
            "quiz_id" => $quiz_id,
            "user_token" => $params["user_token"],
            "user_id" => $params["user_id"],
            "points" => $params["points"],
            "result" => $params["result"],
            "quiz_time" => $params["time_taken"],
            "accuracy" => $params["accuracy"],
            "status" => $params["status"],
        ];
        $remote_addr = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
        $ip = filter_var($remote_addr, FILTER_VALIDATE_IP);
        // Check and save statistic
        $save_statistic = $quiz->rendered_metas['quiz_settings']['save_statistic'] ?? false;
        $statistic_ip_lock = $quiz->rendered_metas['quiz_settings']['statistic_ip_lock'] ?? 0;
        $save_statistic_number_of_times = $quiz->rendered_metas['quiz_settings']['save_statistic_number_of_times'] ?? 0;

        if ($save_statistic) {
            $statistic_ref = StatisticRef::where("quiz_id", $quiz_id)
                ->when($user_id > 0, fn($query) => $query->where("user_id", $user_id))
                ->when($user_id == 0 && $user_token != '', fn($query) => $query->where("user_token", $user_token));
            $check_ip_lock = $statistic_ip_lock == 0 || round((time() - strtotime($statistic_ref->latest()->first()->created_at)) / 60) > $statistic_ip_lock;
            $check_multiple_entry = $save_statistic_number_of_times == 0 || $save_statistic_number_of_times > $statistic_ref->count();
            if ($statistic_ref->count() == 0 || ($check_ip_lock && $check_multiple_entry)) {
                $stat_ref = StatisticRef::create($data);
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
                        "answer_data" => $question["result"]["answer_data"]
                    ]);
                }
            }
            $show_average_score = $quiz->rendered_metas['quiz_settings']['show_average_score'] ?? false;
            $show_percentile = $quiz->rendered_metas['quiz_settings']['show_percentile'] ?? false;
            $statistic_ref = StatisticRef::where('quiz_id', $quiz_id);
            $res['average_score'] = $statistic_ref->count() > 0 && $show_average_score ? $statistic_ref->avg('points') : 0;
            $res['percentile'] = $statistic_ref->count() > 0 && $show_percentile ? round($params['result'] / $statistic_ref->max('result') * 100, 2) : 0;
        }

        // Check and save toplist
        $leaderboard = $quiz->rendered_metas['quiz_settings']['leaderboard'] ?? false;
        $leaderboard_user_can_apply_multiple_times = $quiz->rendered_metas['quiz_settings']['leaderboard_user_can_apply_multiple_times'] ?? false;
        $leaderboard_apply_multiple_number_of_times = $quiz->rendered_metas['quiz_settings']['leaderboard_apply_multiple_number_of_times'] ?? 0;
        if ($leaderboard) {
            $toplist_count = Toplist::where("quiz_id", $quiz_id)
                ->when($user_id > 0, fn($query) => $query->where("user_id", $user_id))
                ->when($user_id == 0 && $user_token != '', fn($query) => $query->where("user_token", $user_token))
                ->count();
            $check_multiple_leaderboard_entry = $leaderboard_user_can_apply_multiple_times && ($leaderboard_apply_multiple_number_of_times == 0 || $leaderboard_apply_multiple_number_of_times > $toplist_count);
            if ($toplist_count == 0 || $check_multiple_leaderboard_entry) {
                $top = Toplist::create([
                    ...$data,
                    "name" => $params["name"],
                    "email" => $params["email"],
                    "ip" => $ip,
                ]);
            }
            $show_rank = $quiz->rendered_metas['quiz_settings']['show_rank'] ?? false;
            $result_comparision_with_topper = $quiz->rendered_metas['quiz_settings']['result_comparision_with_topper'] ?? false;
            $leaderboard_total_number_of_entries = $quiz->rendered_metas['quiz_settings']['leaderboard_total_number_of_entries'] ?? 10;
            $res['toplist_id'] = $top->id;
            $toplist = new Toplist();
            if ($show_rank) {
                $res['rank'] = $toplist->getEntryRank($quiz_id, $top->id);
            }
            if ($result_comparision_with_topper) {
                $res['topper'] = $toplist->getTopper($quiz_id);
            }
            if ($leaderboard_total_number_of_entries > 0 && $leaderboard_total_number_of_entries < 10) {
                $res['toplist'] = $toplist->getTopList($quiz_id, 0, $leaderboard_total_number_of_entries);
            } else {
                $res['toplist'] = $toplist->getTopList($quiz_id, 0, 10);
            }
            $res["toplist_count"] = $toplist->where("quiz_id", $quiz_id)->count();
        }

        // handle email
        $quiz_name = $quiz->post_title ?? '';
        $r = array(
            '$userId' => $user_id,
            '$username' => $params['name'] ?? "Anonymous",
            '$quizname' => $quiz_name,
            '$result' => $params['result'] . '%',
            '$points' => $params['points'],
            '$ip' => $ip,
            '$categories' => "",
        );
        $admin_email = $quiz->rendered_metas['quiz_settings']['admin_email_notification'] ?? false;
        if ($admin_email && $user_id > 0) {
            $admin_to = $quiz->rendered_metas['quiz_settings']['admin_to'];
            $admin_from = $quiz->rendered_metas['quiz_settings']['admin_from'];
            $admin_subject = $quiz->rendered_metas['quiz_settings']['admin_subject'];
            $admin_message = $quiz->rendered_metas['quiz_settings']['admin_message'];

            $admin_msg = str_replace(array_keys($r), $r, $admin_message);
            EmailHelper::instance()->sendEmail(
                $admin_to,
                $admin_subject,
                $admin_msg,
                $admin_from,
            );
        }

        $student_email = $quiz->rendered_metas['quiz_settings']['student_email_notification'] ?? false;
        if ($student_email && $user_id > 0) {
            $student_to = $params["email"];
            $student_from = $quiz->rendered_metas['quiz_settings']['student_from'];
            $student_subject = $quiz->rendered_metas['quiz_settings']['student_subject'];
            $student_message = $quiz->rendered_metas['quiz_settings']['student_message'];

            $student_msg = str_replace(array_keys($r), $r, $student_message);
            EmailHelper::instance()->sendEmail(
                $student_to,
                $student_subject,
                $student_msg,
                $student_from,
            );
        }

        return rest_ensure_response($res);
    }

    public function post_load_more_toplist_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $toplist = new Toplist();
        $res["toplist_count"] = $toplist->count();
        if ($params['leaderboard_total_number_of_entries'] - $params["toplist_view_count"] < 10) {
            $res["toplist"] = $toplist->getTopList($quiz_id, $params["toplist_view_count"], $params['leaderboard_total_number_of_entries'] - $params["toplist_view_count"])->get();
        } else {
            $res["toplist"] = $toplist->getTopList($quiz_id, $params["toplist_view_count"], 10)->get();
        }
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}