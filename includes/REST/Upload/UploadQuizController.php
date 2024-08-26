<?php

namespace Yuvayana\Acadlix\REST\Upload;

use WP_REST_Server;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Question;
use Yuvayana\Acadlix\Models\Quiz;

defined('ABSPATH') || exit();

class UploadQuizController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'upload-quiz';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quizes'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_upload_quiz_questions'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_quizes($request)
    {
        $res = [];
        $params = $request->get_params();
        $res['quizes'] = Quiz::select(['id', 'title'])->get();
        return rest_ensure_response($res);
    }

    public function post_upload_quiz_questions($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $i = 1;
        $i += Question::latest()->first()->sort;
        if (count($params['questions']) > 0) {
            foreach ($params['questions'] as $qkey => $ques) {
                $question = Question::create([
                    'sort' => $i++,
                    'quiz_id' => $params['quiz_id'],
                    'answer_type' => $ques['answer_type'],
                    'different_incorrect_msg' => $ques['different_incorrect_msg'],
                ]);
                foreach($ques['language'] as $lkey => $lang){
                    $helper = new Helper();
                    $ques['language'][$lkey]['question'] = $helper->upload_base64_image_to_wordpress($lang['question']);
                    $ques['language'][$lkey]['correct_msg'] = $helper->upload_base64_image_to_wordpress($lang['correct_msg']);
                    $ques['language'][$lkey]['incorrect_msg'] = $helper->upload_base64_image_to_wordpress($lang['incorrect_msg']);
                    $ques['language'][$lkey]['hint_msg'] = $helper->upload_base64_image_to_wordpress($lang['hint_msg']);
                    $answer_type = $ques['answer_type'];
                    if(in_array($ques['answer_type'], ['singleChoice', 'multipleChoice', 'sortingChoice'])){
                        $answer_data = json_decode($lang['answer_data'], true);
                        foreach($answer_data[$answer_type] as $okey => $opt){
                            $opt['option'] = $helper->upload_base64_image_to_wordpress($opt["option"]);
                            $answer_data[$answer_type][$okey] = $opt;
                        }
                        $ques['language'][$lkey]['answer_data'] = wp_json_encode($answer_data);
                    }
                    if(in_array($ques['answer_type'], ['fillInTheBlank'])){
                        $answer_data = json_decode($lang['answer_data'], true);
                        $answer_data[$answer_type]['option'] = $helper->upload_base64_image_to_wordpress($answer_data[$answer_type]['option']);
                        $ques['language'][$lkey]['answer_data'] = wp_json_encode($answer_data);
                    }
                }
                $question->question_languages()->createMany($ques['language']);
            }
        }
        $res['quiz'] = Quiz::find($params['quiz_id']);
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}