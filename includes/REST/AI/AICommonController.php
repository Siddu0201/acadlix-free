<?php

namespace Yuvayana\Acadlix\REST\AI;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
use Yuvayana\Acadlix\Ai\Ai;
use Yuvayana\Acadlix\Helper\AiHelper;


defined('ABSPATH') || exit();

class AICommonController
{
    protected $namespace = 'acadlix/v1';
    protected $base = 'ai-common';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/generate-description',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_generate_description'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/improve-description',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_improve_description'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/result-feedback',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_result_feedback'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }


    public function post_generate_description(WP_REST_Request $request)
    {
        $res = [];
        $type = $request->get_param('type') ?? "quiz";
        $title = $request->get_param('title') ?? "";
        $prompt = $request->get_param('prompt') ?? "";
        $minWords = $request->get_param('min_words') ?? 250;
        $maxWords = $request->get_param('max_words') ?? 500;
        $level = $request->get_param('level') ?? "All Level";
        $tone = $request->get_param('tone') ?? "Formal & Professional";
        $language = $request->get_param('language');

        $ai = new Ai();
        $suggestions = $ai->getSuggestions(
            AiHelper::instance()->getDescriptionInstruction($type, $language),
            AiHelper::instance()->getDescriptionUserInput($type, $title, $prompt, $minWords, $maxWords, $level, $tone)
        );
        if (is_wp_error($suggestions)) {
            return $suggestions;
        }
        $res['description'] = $suggestions;
        return rest_ensure_response($res);
    }

    public function post_improve_description(WP_REST_Request $request)
    {
        $res = [];
        $description = 'This is a generated description.';
        $ai = new Ai();
        $suggestions = $ai->getSuggestions(
            "You are a helpful assistant that improves descriptions for my quiz.",
            $description
        );
        if (is_wp_error($suggestions)) {
            return $suggestions;
        }
        $res['suggestions'] = $suggestions;
        return rest_ensure_response($res);
    }

    public function post_result_feedback(WP_REST_Request $request)
    {
        $res = [];
        $quizTitle = $request->get_param('quiz_title') ?? "";
        $questions = $request->get_param('questions') ?? [];
        $correctCount = $request->get_param('correct_count') ?? 0;
        $incorrectCount = $request->get_param('incorrect_count') ?? 0;
        $skippedCount = $request->get_param('skipped_count') ?? 0;
        $totalQuestion = $request->get_param('total_question') ?? 0;
        $result = $request->get_param('result') ?? 0;
        $prompt = $request->get_param('prompt') ?? "";
        
        $ai = new Ai();
        $feedback = $ai->getSuggestions(
            AiHelper::instance()->getResultFeedbackInstruction(),
            AiHelper::instance()->getResultFeedbackUserInput(
                $quizTitle,
                $questions,
                $correctCount,
                $incorrectCount,
                $skippedCount,
                $totalQuestion,
                $result,
                $prompt,
            )
        );
        if (is_wp_error($feedback)) {
            return $feedback;
        }
        $res['feedback'] = $feedback;
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}