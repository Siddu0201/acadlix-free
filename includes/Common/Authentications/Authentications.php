<?php

namespace Yuvayana\Acadlix\Common\Authentications;

defined('ABSPATH') || exit();

class Authentications
{
  protected $_recaptchav3 = null;

  public function recaptchav3(): ReCaptchaV3
  {
    if (is_null($this->_recaptchav3)) {
      $this->_recaptchav3 = new ReCaptchaV3();
    }
    return $this->_recaptchav3;
  }
}