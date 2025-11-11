<?php

namespace Yuvayana\Acadlix\Common\Authentications;

defined('ABSPATH') || exit();

class Authentications
{
    protected $_recaptchav3;

    public function recaptchav3(): ReCaptchaV3
    {
        if (!$this->_recaptchav3) {
            $this->_recaptchav3 = new ReCaptchaV3();
        }
        return $this->_recaptchav3;
    }
}