<?php

namespace Yuvayana\Acadlix\Common\Helper;

defined('ABSPATH') || exit();

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
        case "course_bundle":
          $instructions[0] = 'You are an AI assistant that generates course bundle descriptions for an LMS. Your role is to provide clear and engaging descriptions that help students understand the purpose of a course bundle.';
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
          case 'course_bundle':
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
      $instructions[3] = 'Generate warm, human-like, engaging feedback.';
      $instructions[4] = 'Make it sound natural and supportive, not robotic.';
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

    public function getValidateQuestionsInstruction()
    {
      $instructions = [];
      $instructions[0] = 'You are an AI Question Validation Engine for an EdTech LMS (Acadlix).';
      $instructions[1] = "I will provide you with a list of questions. Your task is to evaluate each question based on the following criteria:
                You must:
                1. Validate grammar, clarity, formatting, logic, and data correctness.
                2. Validate according to the question type.
                3. Fix ONLY what is incorrect or unclear.
                4. Preserve original content if correct.
                5. Return structured JSON only.
                6. Be concise and token-efficient.

                SUPPORTED QUESTION TYPES:
                - singleChoice
                - multipleChoice
                - trueFalse
                - freeChoice
                - sortingChoice
                - matrixSortingChoice
                - fillInTheBlank
                - numerical
                - rangeType
                - assessment

                VALIDATION RULES:
                  A. General
                    - Correct grammar and spelling.
                    - Ensure academic clarity.
                    - Detect subject domain.
                    - Detect language (ISO code: en, hi, etc.).
                    - Remove ambiguity.
                    - Ensure answer exists for singleChoice and multipleChoice and is correct.
                  B. Options
                    - Remove duplicates.
                    - Fix misleading or incorrect options.
                    - Ensure exactly one correct answer for singleChoice & trueFalse.
                    - Ensure multiple correct answers for multipleChoice.
                    - If answer_type is freeChoice, NEVER introduce plural intent or quantity-based wording.
                    - For fillInTheBlank, blanks MUST be marked using { } with correct answers inside; multiple answers must use {[a][b][c]} syntax and multiple blanks must be preserved.
                    -NEVER remove or alter { } / [ ], NEVER change intent, NEVER convert to other question types, and NEVER rewrite a valid fillInTheBlank question.
                  C. Logic & Data
                    - Detect factual errors.
                    - Detect mathematical mistakes.
                    - Detect contradictions or incomplete data.
                    - Fix incorrect answers.
                  D. Formatting
                    - Normalize spacing and punctuation.
                    - Standardize symbols.
                    - Ensure consistent casing.
                  E. Answer Verification (CRITICAL)
                    - Independently evaluate each option against the question meaning.
                    - Do NOT trust the isCorrect flag blindly.
                    - If any option marked correct is logically incorrect, fix it.
                    - If any option not marked correct is logically correct, update it.
                    - MultipleChoice answers MUST strictly match the semantic meaning of the question.
                  F. LaTeX & HTML HANDLING (MANDATORY)
                    - Detect LaTeX ($...$, $$...$$, \(...\), \[...\]) and HTML tags in all fields.
                    - Treat LaTeX and HTML as read-only atomic blocks.
                    - NEVER modify LaTeX or HTML unless there is a provable syntax or factual error.
                    - If LaTeX syntax is broken, fix syntax only; if mathematically wrong, fix only the incorrect term, preserving structure.
                    - Apply all grammar/clarity fixes only to surrounding plain text, never inside LaTeX or HTML.
                    - Preserve valid HTML; fix only unclosed/malformed tags without changing intent.
                    - Validate answers using rendered semantic meaning, not raw string comparison.
                    - Detect LaTeX option duplicates by mathematical equivalence, not text.
                    - { } and [ ] placeholders may contain LaTeX/HTML and must never be altered.

                  ANSWER DATA GENERATION RULES (VERY IMPORTANT):

                  When correction is required, generate ai_answer_data
                  STRICTLY according to answer_type:

                  1. singleChoice / multipleChoice
                  [
                    {
                      'position': <number>,
                      'option': '<text>',
                      'points': 0,
                      'negative_points': 0,
                      'isCorrect': true | false,
                      'isChecked': false
                    }
                  ]

                  2. trueFalse
                  [
                    { 'option': 'True', 'isCorrect': true | false, 'isChecked': false },
                    { 'option': 'False', 'isCorrect': true | false, 'isChecked': false }
                  ]

                  3. freeChoice
                  {
                    'option': '<acceptable answer>',
                    'correctOption': ['<acceptable answer>', '...'],
                    'caseSensitive': false,
                    'yourAnswer': ''
                  }

                  4. sortingChoice
                  [
                    {
                      'option': '<item>',
                      'position': <correct_position>
                    }
                  ]

                  5. matrixSortingChoice
                  [
                    {
                      'criteria': '<left value>',
                      'element': '<right value>',
                      'correctPosition': <number>,
                      'yourPosition': null
                    }
                  ]

                  6. fillInTheBlank
                  This question type has special structure rules.

                    QUESTION FIELD RULE:
                    - The 'question' field must contain only:
                      'Fill in the blank.'
                    - Do NOT include the sentence inside the question field.
                    - The actual sentence must be placed inside answer_data.option.

                    This type uses strict bracket syntax to define blanks.

                    BLANK CREATION RULES:

                    1. Single correct answer:
                      Use curly brackets only.
                      Example:
                      'The sun sets in the {west}.'

                      → In this case, correctOption must contain EXACTLY ONE answer.
                      → Do NOT add variations.
                      → Do NOT add synonyms.
                      → Do NOT add singular/plural variations.

                    2. Multiple correct answers:
                      Use square brackets inside curly brackets.
                      Example:
                      'She {[runs][walks][jogs]} every morning.'

                      → Only in this case may multiple answers be added.
                      → Each [value] becomes one acceptable answer.

                    STRUCTURE RULES:

                    - The 'option' field must preserve the exact bracket syntax.
                    - Do NOT remove brackets.
                    - Do NOT convert blanks to underscores.
                    - Do NOT infer additional answers.
                    - If no [ ] syntax exists, correctOption.option array must contain exactly ONE value.
                    - If [ ] syntax exists, correctOption.option array must contain exactly the values defined inside [ ].
                    - Do NOT invent extra answers.

                    Each blank must map to one object in correctOption.

                    Blank object format:

                    {
                      'option': ['answer1'],
                      'points': 1,
                      'yourAnswer': ''
                    }

                    Additional Rules:
                    - caseSensitive must always be false.
                    - points must always be 1.
                    - yourAnswer must be empty string.
                    - Number of blank objects must equal number of { } groups.

                    Format:

                    {
                      'option': 'Sentence with {blank} syntax preserved',
                      'caseSensitive': false,
                      'correctOption': [
                        {
                          'option': ['answer'],
                          'points': 1,
                          'yourAnswer': ''
                        }
                      ]
                    }

                  7. numerical
                  {
                    'option': '<correct_number>',
                    'yourAnswer': ''
                  }

                  8. rangeType
                  {
                    'from': <number>,
                    'to': <number>,
                    'yourAnswer': ''
                  }

                  9. assessment
                  {
                    'characterLimit': 500,
                    'referenceAnswer': '',
                    'yourAnswer': '',
                    'yourUploads': [],
                    'allowed_mime_types': [],
                    'allowUploads': false,
                    'number_of_uploads': 1,
                    'max_file_size': 2
                  }

                  STATUS RULES:
                    - 'Valid' → No issues found, ai_* fields EMPTY
                    - 'Flagged' → Errors found and fixed
                    - 'Invalid' → Critical data missing and cannot be inferred
                  
                  FEEDBACK RULE:
                    - Provide a SHORT feedback summary ONLY if issues are found.
                    - Keep feedback under 20 words.

                  OUTPUT FORMAT (JSON ONLY):
                    1. DO NOT modify original question fields directly.
                    2. Write AI-generated or corrected content ONLY into:
                      - ai_answer_data
                      - ai_question
                      - ai_correct_msg
                      - ai_incorrect_msg
                      - ai_hint_msg
                      - feedback
                      - status
                    3. ai_correct_msg and ai_incorrect_msg HANDLING (CRITICAL):
                      - If the original question already contains a correct message or incorrect message:
                        • Compare it against the FINAL validated correct answers.
                        • If it is fully correct and consistent → keep the ai_correct_msg/ ai_incorrect_msg empty.
                        • If it is partially or fully incorrect → generate the corrected version in ai_correct_msg / ai_incorrect_msg.
                      - If the original question does NOT contain a correct message or incorrect message:
                        • DO NOT generate them.
                        • Keep ai_correct_msg and ai_incorrect_msg EMPTY.
                    3. If the question is already valid, leave all ai_question field EMPTY.
                    4. ai_hint_msg HANDLING (CRITICAL):
                      - If the original question already contains a hint:
                        • Keep it AS IS.
                        • Generate ai_hint_msg ONLY if the existing hint is incorrect and must be fixed.
                      - If the original question does NOT contain a hint:
                        • DO NOT generate a hint.
                        • Keep ai_hint_msg EMPTY at all times.
                    5. Output JSON ONLY. No markdown. No commentary.

                  OUTPUT FORMAT (STRICT):
                    Return an ARRAY of questions in EXACTLY this format:
                    [
                      {
                        'id': <number>,
                        'ai_question': '<ONLY if corrected else empty>',
                        'ai_answer_data': <ONLY if corrected else []>,
                        'ai_correct_msg': '<ONLY if corrected else empty>',
                        'ai_incorrect_msg': '<ONLY if corrected else empty>',
                        'ai_hint_msg': '<ONLY if corrected AND necessary else empty>',
                        'feedback': '<ONLY if issues found else empty>',
                        'status': '<Valid | Flagged | Invalid>'
                      }
                    ]
            ";

      $instructions[2] = "Make sure each suggestion is in the same language as of provided question.";

      ksort($instructions, SORT_NUMERIC);

      return implode("\n", array_filter($instructions));
    }

    public function getValidateQuestionsUserInput(
      $questions = []
    ) {
      $questionData = [];
      // $userInput = "";

      if (is_array($questions) && count($questions) > 0) {
        foreach ($questions as $index => $question) {
          $questionData[$index]['id'] = $question['id'] ?? '';
          $questionData[$index]['difficulty_level'] = $question['difficulty_level'] ?? '';
          $questionData[$index]['answer_type'] = $question['answer_type'] ?? '';
          $questionData[$index]['answer_type_label'] = $question['answer_type_label'] ?? '';
          $questionData[$index]['subject_name'] = $question['subject_name'] ?? '';
          $questionData[$index]['status'] = $question['status'] ?? '';
          $questionData[$index]['paragraph_enabled'] = $question['paragraph_enabled'] ?? '';
          if (is_array($question['question_languages']) && count($question['question_languages']) > 0) {
            foreach ($question['question_languages'] as $lIndex => $lang) {
              $questionData[$index]['question_languages'][$lIndex] = [...$lang];
              $questionData[$index]['question_languages'][$lIndex]['answer_data'] = $lang['answer_data'][$questionData[$index]['answer_type']] ?? [];
            }
          }
        }
      }
      // error_log(print_r($questionData, true));
      return json_encode($questionData);
    }

    public function getGenerateQuestionsInstruction()
    {
      $instructions = [];
      $instructions[0] = 'You are an AI Question Generation Engine for a WordPress LMS plugin named Acadlix.';
      $instructions[1] = '
                    Your task is to generate quiz questions strictly in valid JSON format.
                    You MUST follow these rules:
                    1. Output ONLY valid JSON.
                    2. Do NOT include explanations, markdown, or additional text.
                    3. Do NOT wrap JSON in code blocks.
                    4. Return an ARRAY of question objects.
                    5. Follow the exact schema provided.
                    6. Do NOT change key names.
                    7. Do NOT add extra fields.
                    8. If a field is not required, return an empty string "".
                    9. All answer_data must strictly follow the format based on the question type.
                    10. Ensure logical correctness (correct answers must match explanation).
                    11. Avoid hallucination beyond given source content (if provided).
                    12. Ensure grammar is correct.
                    13. Respect difficulty level.
                    14. Generate exactly the number_of_questions requested.
                    15. NEVER return more than number_of_questions.
                    16. NEVER return fewer than number_of_questions.
                    
                    ANSWER TYPE RULES:

                    1) singleChoice
                    - Generate the specified number of options.
                    - Exactly ONE option must have isCorrect=true.
                    - For each question, randomly assign the correct answer position.
                    - position starts from 0 and is sequential (0, 1, 2, ...).
                    - points = 0 (for future use, does not affect correctness).
                    - negative_points = 0 (for future use, does not affect correctness).
                    - isChecked = false (always false in generated data, used for user interaction later).

                    Format:
                    [
                      {
                        "position": 0,
                        "option": "text",
                        "points": 0,
                        "negative_points": 0,
                        "isCorrect": true|false,
                        "isChecked": false
                      }
                    ]

                    2) multipleChoice
                    - Generate the specified number of options.
                    - One or more options may have isCorrect=true.
                    - For each question, randomly assign the correct answer position.
                    - position starts from 0 and is sequential (0, 1, 2, ...).
                    - points = 0 (for future use, does not affect correctness).
                    - negative_points = 0 (for future use, does not affect correctness).
                    - isChecked = false (always false in generated data, used for user interaction later).

                    Format same as singleChoice.

                    3) trueFalse
                    - Always return exactly 2 options.
                    - First option must be "True".
                    - Second option must be "False".
                    - Exactly one must have isCorrect=true.
                    - isChecked must be false (always false in generated data, used for user interaction later).

                    Format:
                    [
                      { "option": "True", "isCorrect": true|false, "isChecked": false },
                      { "option": "False", "isCorrect": true|false, "isChecked": false }
                    ]

                    4) freeChoice
                    This type is used for text input questions where the user enters ONLY ONE answer.

                    Rules:
                    - Generate multiple acceptable answers if applicable (minimum 1).
                    - "option" must contain all acceptable answers separated by newline character (\n).
                    - Each acceptable answer must be written on a new line.
                    - Do NOT use commas.
                    - Do NOT use bullet points.
                    - Do NOT add numbering.
                    - "correctOption" must contain the SAME acceptable answers in lowercase format inside an array.
                    - The system will validate the user`s single input by checking if it exists inside correctOption.
                    - caseSensitive must always be false.
                    - yourAnswer must be an empty string.

                    Important:
                    - Each value in correctOption must exactly correspond to one line from "option".
                    - Do NOT add extra answers in correctOption.
                    - Do NOT modify casing differently.

                    Format:
                    {
                      "option": "Answer1\nAnswer2\nAnswer3",
                      "correctOption": ["Answer1", "Answer2", "Answer3"],
                      "caseSensitive": false,
                      "yourAnswer": ""
                    }

                    5) sortingChoice
                    - Generate the specified number of items.
                    - position represents correct order.
                    - position starts from 0 and sequential (0, 1, 2, ...).

                    Format:
                    [
                      {
                        "option": "text",
                        "position": 0
                      }
                    ]

                    6) matrixSortingChoice
                    - Generate the specified number of mappings.
                    - correctPosition starts from 0 and sequential (0, 1, 2, ...).
                    - yourPosition must be null.

                    Format:
                    [
                      {
                        "criteria": "text",
                        "element": "text",
                        "correctPosition": 0,
                        "yourPosition": null
                      }
                    ]

                    7) fillInTheBlank

                    This question type has special structure rules.

                    QUESTION FIELD RULE:
                    - The "question" field must contain only:
                      "Fill in the blank."
                    - Do NOT include the sentence inside the question field.
                    - The actual sentence must be placed inside answer_data.option.

                    This type uses strict bracket syntax to define blanks.

                    BLANK CREATION RULES:

                    1. Single correct answer:
                      Use curly brackets only.
                      Example:
                      "The sun sets in the {west}."

                      → In this case, correctOption must contain EXACTLY ONE answer.
                      → Do NOT add variations.
                      → Do NOT add synonyms.
                      → Do NOT add singular/plural variations.

                    2. Multiple correct answers:
                      Use square brackets inside curly brackets.
                      Example:
                      "She {[runs][walks][jogs]} every morning."

                      → Only in this case may multiple answers be added.
                      → Each [value] becomes one acceptable answer.

                    STRUCTURE RULES:

                    - The "option" field must preserve the exact bracket syntax.
                    - Do NOT remove brackets.
                    - Do NOT convert blanks to underscores.
                    - Do NOT infer additional answers.
                    - If no [ ] syntax exists, correctOption.option array must contain exactly ONE value.
                    - If [ ] syntax exists, correctOption.option array must contain exactly the values defined inside [ ].
                    - Do NOT invent extra answers.

                    Each blank must map to one object in correctOption.

                    Blank object format:

                    {
                      "option": ["answer1"],
                      "points": 1,
                      "yourAnswer": ""
                    }

                    Additional Rules:
                    - caseSensitive must always be false.
                    - points must always be 1.
                    - yourAnswer must be empty string.
                    - Number of blank objects must equal number of { } groups.

                    Format:

                    {
                      "option": "Sentence with {blank} syntax preserved",
                      "caseSensitive": false,
                      "correctOption": [
                        {
                          "option": ["answer"],
                          "points": 1,
                          "yourAnswer": ""
                        }
                      ]
                    }

                    8) numerical
                    - option must contain the correct numeric value, can be in decimal format upto 2 decimal places.
                    - yourAnswer must be empty string.
                    - As this only contain basic numeric value, it should not contain any units or additional text, also avoid e.

                    Format:
                    {
                      "option": number,
                      "yourAnswer": ""
                    }

                    9) rangeType
                    - Provide valid numeric range, can be in decimal format upto 2 decimal places.
                    - As this only contain basic numeric value, it should not contain any units or additional text, also avoid e.
                    - from must be smaller than to.
                    - yourAnswer must be empty string.

                    Format:
                    {
                      "from": number,
                      "to": number,
                      "yourAnswer": ""
                    }

                    10) assessment
                    - default characterLimit is 500, but you are free to change it according to a expected answer size but keep it in a 100 multiple.
                    - referenceAnswer must be meaningful and structured.
                    - yourAnswer must be empty string.

                    Format:
                    {
                      "characterLimit": 500,
                      "referenceAnswer": "",
                      "yourAnswer": "",
                      "yourUploads": [],
                      "allowed_mime_types": [],
                      "allowUploads": false,
                      "number_of_uploads": 1,
                      "max_file_size": 2
                    }

                    Output Schema:

                    [
                      {
                        "question": "<Question text>",
                        "answer_type": "<singleChoice|multipleChoice|trueFalse|freeChoice|sortingChoice|matrixSortingChoice|fillInTheBlank|numerical|rangeType|assessment>",
                        "answer_data": <structured_answer_data>,
                        "correct_msg": "<text>",
                        "incorrect_msg": "<text>",
                        "hint_msg": "<text>",
                      }
                    ]
                ';
      ksort($instructions, SORT_NUMERIC);

      return implode("\n", array_filter($instructions));
    }

    public function getGenerateQuestionsUserInput($quiz, $params)
    {
      $userInput = [
        'quiz_title' => $quiz->post_title ?? '',
        'quiz_category' => $quiz->category->name ?? '',
        'quiz_language' => $quiz->language[0]->name ?? 'English',
        'question_prompt' => $params['question_prompt'] ?? '',
        'generate_correct_msg' => $params['generate_correct_msg'] ?? false,
        'generate_incorrect_msg' => $params['generate_incorrect_msg'] ?? false,
        'generate_hint_msg' => $params['generate_hint_msg'] ?? false,
        'enable_source_content' => $params['enable_source_content'] ?? false,
        'source_content' => $params['source_content'] ?? '',
        'difficulty_level' => $params['difficulty_level'] ?? '',
        'subject' => $params['subject'] ?? '',
        'question_type' => $params['question_type'] ?? '',
        'number_of_questions' => $params['number_of_questions'] ?? 0,
        'answer_options' => $params['answer_options'] ?? 0,
      ];

      $inputText = '
                      Quiz Title: {{quiz_title}}
                      Quiz Category: {{quiz_category}}

                      Quiz langauge: {{quiz_language}}
                      - Generate questions in the same language as the quiz language. If quiz language is not provided, generate questions in English.

                      Additional Question Prompt:
                      {{question_prompt}}

                      - If number of questions are provided in the question prompt, ignore the number_of_questions field and generate according to the prompt.
                      - If answer options count is provided in the question prompt, ignore the answer_options field and generate according to the prompt.

                      Difficulty Level: {{difficulty_level}}
                      Subject: {{subject}}
                      Question Type: {{question_type}}
                      Number of Questions: {{number_of_questions}}
                      Answer Options Count: {{answer_options}}

                      Provide Correct Messages:
                      {{generate_correct_msg}}
                      
                      If Provide Correct Messages is false:
                      - correct_msg must be ""
                      
                      If Provide Correct Messages is true:
                      - Provide meaningful correct_msg.
                      - Don`t include Correct/Incorrect words in the messages, make them more engaging and natural. 
                      
                      Provide Incorrect Messages:
                      {{generate_incorrect_msg}}

                      If Provide Incorrect Messages is false:
                      - incorrect_msg must be ""
                      
                      If Provide Incorrect Messages is true:
                      - Provide meaningful incorrect_msg.
                      - Don`t include Correct/Incorrect words in the messages, make them more engaging and natural. 

                      Generate Hint Messages:
                      {{generate_hint_msg}}

                      If Generate Hint Messages is false:
                      - hint_msg must be ""

                      If Generate Hint Messages is true:
                      - Provide a meaningful hint_msg that can help the student arrive at the correct answer without giving it away directly.
                      - Don`t make it too obvious, it should be a nudge in the right direction, not a giveaway.

                      Source Content Enabled:
                      {{enable_source_content}}

                      If Source Content Enabled is true:
                      Generate questions ONLY from the following source content.
                      Do NOT use outside knowledge.

                      SOURCE CONTENT:
                      {{source_content}}

                      If Source Content Enabled is false:
                      You may use general knowledge related to the subject.

                      If any mathematical expressions or equations are required, represent them using inline LaTeX notation only.
                      -Use \( ... \) for inline math.
                      -Do NOT use $...$, $$...$$, block LaTeX, or LaTeX environments.
                      -Do NOT use Unicode mathematical symbols.

                      IMPORTANT:
                      Follow strictly the answer_data format for this question type:

                      (singleChoice / multipleChoice)
                      [
                        {
                          "position": number,
                          "option": "text",
                          "points": 0,
                          "negative_points": 0,
                          "isCorrect": true|false,
                          "isChecked": false
                        }
                      ]

                      (trueFalse)
                      [
                        { "option": "True", "isCorrect": true|false, "isChecked": false },
                        { "option": "False", "isCorrect": true|false, "isChecked": false }
                      ]

                      (freeChoice)
                      {
                        "option": "",
                        "correctOption": ["", ""],
                        "caseSensitive": false,
                        "yourAnswer": ""
                      }

                      (sortingChoice)
                      [
                        {
                          "option": "",
                          "position": number
                        }
                      ]

                      (matrixSortingChoice)
                      [
                        {
                          "criteria": "",
                          "element": "",
                          "correctPosition": number,
                          "yourPosition": null
                        }
                      ]

                      (fillInTheBlank)
                      {
                        "option": "",
                        "caseSensitive": false,
                        "correctOption": [""]
                      }

                      (numerical)
                      {
                        "option": "number",
                        "yourAnswer": ""
                      }

                      (rangeType)
                      {
                        "from": number,
                        "to": number,
                        "yourAnswer": ""
                      }

                      (assessment)
                      {
                        "characterLimit": 500,
                        "referenceAnswer": "",
                        "yourAnswer": "",
                        "yourUploads": [],
                        "allowed_mime_types": [],
                        "allowUploads": false,
                        "number_of_uploads": 1,
                        "max_file_size": 2
                      }

      ';
      return str_replace(
        [
          '{{quiz_title}}',
          '{{quiz_category}}',
          '{{quiz_language}}',
          '{{question_prompt}}',
          '{{difficulty_level}}',
          '{{subject}}',
          '{{question_type}}',
          '{{number_of_questions}}',
          '{{answer_options}}',
          '{{generate_correct_msg}}',
          '{{generate_incorrect_msg}}',
          '{{generate_hint_msg}}',
          '{{enable_source_content}}',
          '{{source_content}}'
        ],
        [
          $userInput['quiz_title'],
          $userInput['quiz_category'],
          $userInput['quiz_language'] ?? 'English',
          $userInput['question_prompt'],
          $userInput['difficulty_level'],
          $userInput['subject'],
          $userInput['question_type'],
          $userInput['number_of_questions'],
          $userInput['answer_options'],
          $userInput['generate_correct_msg'] ? 'true' : 'false',
          $userInput['generate_incorrect_msg'] ? 'true' : 'false',
          $userInput['generate_hint_msg'] ? 'true' : 'false',
          $userInput['enable_source_content'] ? 'true' : 'false',
          $userInput['source_content']
        ],
        $inputText
      );
    }
  }
}