<?php

namespace Yuvayana\Acadlix\Common\Helper;

use WP_Error;

if (!class_exists('AiHelper')) {
    class AiHelper
    {
        protected static $instance = null;

        public static function instance()
        {
            if (!self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function getDescriptionInstruction(
            $type = 'quiz',
            $language = '',
        ) {
            $languageCode = get_locale();
            $instructions = [];
            switch ($type) {
                case 'quiz':
                    $instructions[0] = 'You are an AI assistant that generates quiz descriptions for an LMS. Your role is to provide clear and engaging descriptions that help students understand the purpose of a quiz.';
                    $instructions[1] = "
                        **Guidelines:**
                        - Clearly state **what the quiz tests** (concepts, skills, topics).
                        - Keep the description **brief but informative**.
                        - Content should be SEO-friendly and properly h1, h2, h3 tags.
                        - If required also use bullet points.
                        - Do not include title in response.
                    ";
                    break;
                case 'paragraph':
                    break;
                case 'lesson':
                    $instructions[0] = 'You are an AI that generates well-structured lesson content for an LMS. Your goal is to provide clear, engaging, and informative lesson content.';
                    $instructions[1] = "
                        **Guidelines:**
                        - **Start with an introduction** explaining what the lesson covers.
                        - Break down concepts **step by step** with clear explanations.
                        - **Include examples, use cases, or real-world applications**.
                        - Summarize key takeaways at the end.
                        - If required also use bullet points.
                        - Do not include title in response.
                        ";
                    break;
                case 'course':
                    $instructions[0] = 'You are an AI assistant that generates course descriptions for an LMS. Your role is to provide clear and engaging descriptions that help students understand the purpose of a course.';
                    $instructions[1] = "
                        **Guidelines:**
                        - Keep the description **brief but informative**.
                        - Content should be SEO-friendly and properly h1, h2, h3 tags.
                        - If required also use bullet points.
                        - Do not include title in response.
                        ";
                    break;
                default:
                    break;
            }

            if (!empty($language)) {
                $instructions[2] = "Make sure each suggestion is in the same language. The relevant language name is {$language}.";
            } else {
                if ('en_US' !== $languageCode) {
                    $instructions[2] = "Make sure each suggestion is in the same language. The relevant language code is {$languageCode}.";
                }
            }

            // $instructions[4] = 'Finally, make sure every suggestion starts and ends with triple double quotes in order to delimit them.';

            ksort($instructions, SORT_NUMERIC);

            return implode("\n", array_filter($instructions));
        }

        public function getDescriptionUserInput(
            $type = 'quiz',
            $title = '',
            $prompt = '',
            $minWords = 250,
            $maxWords = 500,
            $level = 'All Level',
            $tone = 'Formal & Professional',
        ) {
            $userInput = "";
            if (!empty($title)) {
                switch ($type) {
                    case 'quiz':
                    case 'course':
                        $userInput .= "Generate a professional and structured {$type} description for the {$type} {$title}. ";
                        break;
                    case 'lesson':
                        $userInput .= "Generate a professional and structured {$type} content for the {$type} {$title}. ";
                        break;
                    default:
                        break;
                }
            }

            if ($maxWords > 0) {
                $userInput .= "Ensure the response is between {$minWords} and {$maxWords} words. ";
            }

            if (!empty($level)) {
                $userInput .= "The {$type} should be suitable for {$level} students. ";
            }

            if (!empty($tone)) {
                $userInput .= "Maintain a {$tone} tone throughout the response.. ";
            }

            if (!empty($prompt)) {
                $userInput .= $prompt;
            }
            return $userInput;
        }

        public function getResultFeedbackInstruction($language = '')
        {
            $languageCode = get_locale();

            $instructions = [];
            $instructions[0] = 'You are a quiz review assistant.';
            $instructions[1] = "I will provide you with questions, is question correct or incorrect, but in your review, do not include the questions and answers. Based on the provided data, generate a detailed review for the student.
                1. **Introduction**: Summarize the student's overall performance, including the number of correct and incorrect answers and a general comment on their performance.
                2. **Overview of Performance**: 
                - Identify the areas where the student performed well.
                - Highlight any patterns in incorrect answers, pointing out specific areas for improvement.

                3. **Recommendations**: Provide actionable advice for improving their understanding and their performance.

                4. **Encouragement**: End with positive feedback and encouragement for continued learning.
            ";

            if (!empty($language)) {
                $instructions[2] = "Make sure each suggestion is in the same language. The relevant language name is {$language}.";
            } else {
                if ('en_US' !== $languageCode) {
                    $instructions[2] = "Make sure each suggestion is in the same language. The relevant language code is {$languageCode}.";
                }
            }
            ksort($instructions, SORT_NUMERIC);

            return implode("\n", array_filter($instructions));
        }

        public function getResultFeedbackUserInput(
            $quizTitle = "",
            $questions = [],
            $correctCount = 0,
            $incorrectCount = 0,
            $skippedCount = 0,
            $totalQuestion = 0,
            $result = 0,
            $prompt = ""
        ) {
            $questionData = "";
            $userInput = "";

            if (is_array($questions) && count($questions) > 0) {
                foreach ($questions as $question) {
                    if (!empty($question['question'])) {
                        $questionData .= "Question: {$question['question']}, ";
                    }

                    if (!empty($question['answer_type'])) {
                        $questionData .= "Question Type: {$question['answer_type']}, ";
                    }

                    if (!empty($question['isSolved']) && $question['isSolved'] == 1) {
                        if (!empty($question['isCorrect']) && $question['isCorrect'] == 1) {
                            $questionData .= "Your Question is Correct., ";
                        } else {
                            $questionData .= "Your Question is Incorrect., ";
                        }
                    } else {
                        $questionData .= "You skipped this question., ";
                    }
                }
            }

            if (!empty($quizTitle)) {
                $userInput .= "Quiz Title: {$quizTitle}, ";
            }

            if (!empty($questionData)) {
                $userInput .= "Question Data: {$questionData}, ";
            }

            $userInput .= "Correct Question: {$correctCount}, ";
            $userInput .= "Incorrect Question: {$incorrectCount}, ";
            $userInput .= "Skipped Question: {$skippedCount}, ";
            $userInput .= "Total Question: {$totalQuestion}, ";
            $userInput .= "Result: {$result}% ";

            if (!empty($prompt)) {
                $userInput .= $prompt;
            }

            return $userInput;
        }
    }
}