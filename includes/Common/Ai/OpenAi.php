<?php

namespace Yuvayana\Acadlix\Common\Ai;

defined('ABSPATH') || exit();

class OpenAi
{
	/**
	 * The OpenAI API key.
	 *
	 * @var string
	 */
	private $openAiKey = '';

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

	private $byPassCleanup = false;

	/**
	 * The base URL for the API.
	 *
	 * @var string
	 */
	private $baseUrl = 'https://api.openai.com/v1/';

	public function __construct()
	{
		$this->openAiKey = acadlix()->helper()->acadlix_get_option('acadlix_openai_api_key');
	}

	public function maxTokens(int $value): self
	{
		$this->maxTokens = $value;
		return $this;
	}

	public function temperature(float $value): self
	{
		$this->temperature = $value;
		return $this;
	}

	public function amountOfResults(int $value): self
	{
		$this->amountOfResults = $value;
		return $this;
	}

	public function model(string $value): self
	{
		$this->model = $value;
		return $this;
	}

	public function slug(string $value): self
	{
		$this->slug = $value;
		return $this;
	}

	public function baseUrl(string $value): self
	{
		$this->baseUrl = $value;
		return $this;
	}

	public function byPassCleanup(bool $value): self
	{
		$this->byPassCleanup = $value;
		return $this;
	}

	/**
	 * Returns suggestions for the current target.
	 *
	 * @return array|string|\WP_Error The suggestions or the WP error.
	 */
	public function getSuggestions(
		string $instruction,
		string|array $postContent,
		string|array $images = []
	) {
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

		// error_log('OpenAI Response: ' . print_r($responseData, true));
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
		$url = $this->getUrl() . $this->slug;
		$response = wp_remote_post($url, $this->getRequestArgs($messages));
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
		// if (empty($response->choices[0]->message->content)) {
		// 	return "";
		// }

		// $rawSuggestions = $response->choices[0]->message->content;

		// return $this->cleanSuggestion($rawSuggestions);
		// GPT-5 Responses API
		if (isset($response->output_text)) {
			return $this->cleanSuggestion($response->output_text);
		}

		// Sometimes GPT-5 returns structured output
		if (isset($response->output[1]->content[0]->text)) {
			return $this->cleanSuggestion($response->output[1]->content[0]->text);
		}

		// GPT-4o Chat Completion API
		if (isset($response->choices[0]->message->content)) {
			return $this->cleanSuggestion($response->choices[0]->message->content);
		}

		return "";
	}

	/**
	 * Cleans the given title/description suggestion.
	 *
	 * @param  string $suggestion The suggestion to clean.
	 * @return string             The cleaned suggestion.
	 */
	private function cleanSuggestion($suggestion)
	{
		if($this->byPassCleanup) {
			return $suggestion;
		}
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
		$isGpt5 = str_starts_with($this->model, 'gpt-5');
		if ($isGpt5) {
			// GPT-5.x / GPT-5-mini → Responses API format
			$body = [
				'model' => $this->model,
				'input' => $messages,
				'max_output_tokens' => $this->maxTokens,
			];
		} else {
			// GPT-4o → Chat Completions format
			$body = [
				'max_tokens' => $this->maxTokens,
				'temperature' => $this->temperature,
				'model' => $this->model,
				'n' => $this->amountOfResults,
				'messages' => $messages,
			];
		}

		$args = [
			'timeout' => 120,
			'headers' => [
				'Authorization' => "Bearer {$this->openAiKey}",
				'Content-Type' => 'application/json'
			],
			'body' => wp_json_encode($body),
			'sslverify' => false
		];

		return $args;
	}
	public function getUrl()
	{
		return $this->baseUrl;
	}
}