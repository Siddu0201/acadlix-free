<?php

namespace Yuvayana\Acadlix\Common\Ai;

defined('ABSPATH') || exit();
/**
 * Class to handle AI.
 */
class Ai
{
	protected $openAi;

	public function openAi(): OpenAi
	{
		if (is_null($this->openAi)) {
			$this->openAi = new OpenAi();
		}
		return $this->openAi;
	}
}