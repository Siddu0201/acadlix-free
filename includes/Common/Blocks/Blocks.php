<?php

namespace Yuvayana\Acadlix\Common\Blocks;

defined('ABSPATH') || exit;

class Blocks
{
  protected ?QuizShortcodeBlock $quizShortcodeBlock = null;
  protected ?QuizLeaderboardShortcodeBlock $quizLeaderboardShortcodeBlock = null;
  protected ?LoginShortcodeBlock $loginShortcodeBlock = null;

  public function __construct()
  {
    add_action('init', [$this, 'register_blocks']);
  }

  public function register_blocks()
  {
    $this->quizShortcodeBlock()->register();
    $this->quizLeaderboardShortcodeBlock()->register();
    $this->loginShortcodeBlock()->register();
  }

  protected function quizShortcodeBlock(): QuizShortcodeBlock
  {
    if (is_null($this->quizShortcodeBlock)) {
      $this->quizShortcodeBlock = new QuizShortcodeBlock();
    }
    return $this->quizShortcodeBlock;
  }

  protected function quizLeaderboardShortcodeBlock(): QuizLeaderboardShortcodeBlock
  {
    if (is_null($this->quizLeaderboardShortcodeBlock)) {
      $this->quizLeaderboardShortcodeBlock = new QuizLeaderboardShortcodeBlock();
    }
    return $this->quizLeaderboardShortcodeBlock;
  }

  protected function loginShortcodeBlock(): LoginShortcodeBlock
  {
    if (is_null($this->loginShortcodeBlock)) {
      $this->loginShortcodeBlock = new LoginShortcodeBlock();
    }
    return $this->loginShortcodeBlock;
  }
}