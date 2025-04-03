<?php
namespace Yuvayana\Acadlix\Ai;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Class to handle AI via OpenAI.
 */
class Ai
{
	/**
	 * The OpenAI API key.
	 *
	 * @var string
	 */
	private $openAiKey = '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';

	/**
	 * The temperature parameter controls randomness in Boltzmann distributions.
	 * The higher the temperature, the more random the completions.
	 *
	 * @var float
	 */
	private $temperature = 0.7;

	/**
	 * The AI model to use.
	 *
	 * @var string
	 */
	private $model = 'gpt-4o';

	/**
	 * The slug for the API.
	 *
	 * @var string
	 */
	private $slug = 'chat/completions';

	/**
	 * The maximum number of tokens to return.
	 *
	 * @var int
	 */
	private $maxTokens = 1500;

	/**
	 * The maximum number of results to return.
	 *
	 * @var int
	 */
	private $amountOfResults = 1;

	/**
	 * The post content.
	 *
	 * @var string
	 */
	private $postContent = '';

	/**
	 * The instruction.
	 *
	 * @var string
	 */
	private $instruction = '';

	private $images = [];

	/**
	 * The base URL for the API.
	 *
	 * @var string
	 */
	private $baseUrl = 'https://api.openai.com/v1/';

	public function __construct(
		int $maxTokens = 1500,
		float $temperature = 0.7,
		int $amountOfResults = 1,
		string $model = 'gpt-4o',
		string $slug = 'chat/completions',
	) {
		
		$this->maxTokens = $maxTokens;
		$this->temperature = $temperature;
		$this->amountOfResults = $amountOfResults;
		$this->model = $model;
		$this->slug = $slug;
	}

	/**
	 * Returns suggestions for the current target.
	 *
	 * @return array|\WP_Error The suggestions or the WP error.
	 */
	public function getSuggestions(
		string $instruction, 
		string $postContent, 
		string|array $images = []
	)
	{
		if (empty($instruction) || empty($postContent)) {
			return new \WP_Error(
				'acadlix_ai_error',
				__('Instruction and post content are required for AI to generate suggestions.', 'acadlix')
			);
		}
		$this->instruction = $instruction;
		$this->postContent = $postContent;
		$this->images = is_array($images) ? $images : [$images];


		$messages = $this->getMessages();
		$responseData = $this->sendRequest($messages);
		if (is_wp_error($responseData)) {
			return $responseData;
		}

		$result = $this->extractSuggestions($responseData);

		return $result;
	}

	/**
	 * Sends a stream of requests to OpenAI in order to get suggestions for the title or meta description.
	 *
	 * @param  string               $messages The messages to send to the AI.
	 * @return array|bool|\WP_Error           The response data or the WP error.
	 */
	public function sendRequest($messages)
	{
		$response = wp_remote_post($this->getUrl() . $this->slug, $this->getRequestArgs($messages));
		if (is_wp_error($response)) {
			return $response;
		}

		$body = wp_remote_retrieve_body($response);
		$data = json_decode($body);
		if (isset($data->error)) {
			return new \WP_Error(
				$data->error->type,
				$data->error->message
			);
		}

		return $data;
	}

	/**
	 * Extracts the suggestions from the response.
	 *
	 * @param  object $response The response data.
	 * @return string            The suggestions.
	 */
	private function extractSuggestions($response)
	{
		if (empty($response->choices[0]->message->content)) {
			return "";
		}

		$rawSuggestions = $response->choices[0]->message->content;

		return $this->cleanSuggestion($rawSuggestions);
	}

	/**
	 * Cleans the given title/description suggestion.
	 *
	 * @param  string $suggestion The suggestion to clean.
	 * @return string             The cleaned suggestion.
	 */
	private function cleanSuggestion($suggestion)
	{
		$responseText = $suggestion;

        // Convert Headings
        $responseText = preg_replace('/^### (.*$)/m', '<h3>$1</h3>', $responseText);
        $responseText = preg_replace('/^## (.*$)/m', '<h2>$1</h2>', $responseText);
        $responseText = preg_replace('/^# (.*$)/m', '<h1>$1</h1>', $responseText);

        // Convert Lists (Unordered and Ordered)
        $responseText = preg_replace('/^\s*-\s+(.*$)/m', '<li>$1</li>', $responseText);
        $responseText = preg_replace('/^\s*\d+\.\s+(.*$)/m', '<li>$1</li>', $responseText);
        $responseText = preg_replace('/(<li>.*<\/li>)/m', '<ul>$1</ul>', $responseText);

        // Convert Bold Text
        $responseText = preg_replace('/\*\*(.+?)\*\*/', '<strong>$1</strong>', $responseText);

        // Convert Paragraphs
        $responseText = preg_replace("/\n\s*\n/m", '</p><p>', $responseText);
        $responseText = '<p>' . $responseText . '</p>';

        // Convert Links (Markdown-style [text](url))
        $responseText = preg_replace('/\[(.*?)\]\((.*?)\)/', '<a href="$2">$1</a>', $responseText);

        return $responseText;
	}


	/**
	 * Prepares the messages to be sent to the AI for generating suggestions.
	 *
	 * Checks if the instruction and post content are provided, and returns
	 * a structured array of messages for the AI. If either is missing, it
	 * returns a WP_Error indicating the requirement.
	 *
	 * @return array|\WP_Error The array of messages or a WP_Error if inputs are missing.
	 */

	private function getMessages()
	{
		return [
			[
				'role' => 'system',
				'content' => $this->instruction
			],
			[
				'role' => 'user',
				'content' => $this->postContent
			]
		];
	}


	private function getRequestArgs($messages)
	{
		$args = [
			'timeout' => 120,
			'headers' => [
				'Authorization' => "Bearer {$this->openAiKey}",
				'Content-Type' => 'application/json'
			],
			'body' => [
				'max_tokens' => $this->maxTokens,
				'temperature' => $this->temperature,
				'model' => $this->model,
				'stop' => null,
				'n' => $this->amountOfResults,
				'messages' => $messages
			],
			'sslverify' => false
		];

		$args['body'] = wp_json_encode($args['body']);
		return $args;
	}
	public function getUrl()
	{
		return $this->baseUrl;
	}
}
