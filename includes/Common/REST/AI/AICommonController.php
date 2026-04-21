<?php

namespace Yuvayana\Acadlix\Common\REST\AI;

defined('ABSPATH') || exit();

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;


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
          'permission_callback' => function() {
            return current_user_can('acadlix_ai_generate_description');
          },
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
          'permission_callback' => function() {
            return current_user_can('acadlix_ai_improve_description');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/validate-questions',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_validate_questions'],
          'permission_callback' => function() {
            return current_user_can('acadlix_question_ai_validation');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/generate-questions',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_generate_questions'],
          'permission_callback' => function() {
            return current_user_can('acadlix_question_ai_generate');
          },
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

    $suggestions = acadlix()->ai()->openAi()->getSuggestions(
      acadlix()->helper()->ai()->getDescriptionInstruction($type, $language),
      acadlix()->helper()->ai()->getDescriptionUserInput($type, $title, $prompt, $minWords, $maxWords, $level, $tone)
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
    $suggestions = acadlix()->ai()->openAi()->getSuggestions(
      "You are a helpful assistant that improves descriptions for my quiz.",
      $description
    );
    if (is_wp_error($suggestions)) {
      return $suggestions;
    }
    $res['suggestions'] = $suggestions;
    return rest_ensure_response($res);
  }

  public function post_validate_questions(WP_REST_Request $request)
  {
    $res = [];
    $params = $request->get_json_params();
    $questions = $params['questions'];

    if (empty($questions) || !is_array($questions)) {
      return new WP_Error(
        'missing_questions',
        __('Questions are required for AI validation.', 'acadlix'),
        ['status' => 400]
      );
    }
    $instruction = acadlix()->helper()->ai()->getValidateQuestionsInstruction();
    $userInput = acadlix()->helper()->ai()->getValidateQuestionsUserInput($questions);
    $feedback = acadlix()->ai()->openAi()
      ->maxTokens(10000)
      ->model('gpt-5-mini')
      ->slug('responses')
      ->byPassCleanup(true)
      ->getSuggestions(
        $instruction,
        $userInput
      );
    if (is_wp_error($feedback)) {
      return $feedback;
    }
    $feedback = json_decode($feedback, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      return new WP_Error(
        'invalid_response',
        __('Received invalid response from AI model.', 'acadlix'),
        ['status' => 500]
      );
    }

    $res['feedback'] = $feedback;
    $res['instruction'] = $instruction;
    $res['user_input'] = $userInput;
    return rest_ensure_response($res);
  }

  public function post_generate_questions(WP_REST_Request $request)
  {
    $res = [];
    $params = $request->get_json_params();

    if (empty($params)) {
      return new WP_Error(
        'missing_parameters',
        __('Parameters are required for generating questions.', 'acadlix'),
        ['status' => 400]
      );
    }

    if (!isset($params['quiz_id'])) {
      return new WP_Error(
        'missing_quiz_id',
        __('Quiz ID is required for generating questions.', 'acadlix'),
        ['status' => 400]
      );
    }

    $quiz = acadlix()->model()->quiz()
      ->ofQuiz()
      ->find($params['quiz_id']);

    $instruction = acadlix()->helper()->ai()->getGenerateQuestionsInstruction();
    $userInput = acadlix()->helper()->ai()->getGenerateQuestionsUserInput($quiz, $params);
    // return new WP_Error(
    //     'ai_generation_failed',
    //     __('AI failed to generate questions. Please try again.', 'acadlix'),
    //     ['status' => 500]
    // );
    $questions = acadlix()->ai()->openAi()
      ->maxTokens(50000)
      ->model('gpt-5-mini')
      ->slug('responses')
      ->byPassCleanup(true)
      ->getSuggestions(
        $instruction,
        $userInput
      );
    if (is_wp_error($questions)) {
      return $questions;
    }
    $questions = json_decode($questions, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      return new WP_Error(
        'invalid_response',
        __('Received invalid response from AI model.', 'acadlix'),
        ['status' => 500]
      );
    }
    $res['quiz'] = $quiz;
    $res['instruction'] = $instruction;
    $res['user_input'] = $userInput;
    $res['questions'] = $questions;
    return rest_ensure_response($res);
  }
}