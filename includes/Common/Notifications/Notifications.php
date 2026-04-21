<?php

namespace Yuvayana\Acadlix\Common\Notifications;

defined('ABSPATH') || exit();

class Notifications
{
    protected $_email = null;

    public function email(): Email
    {
        if (is_null($this->_email)) {
            $this->_email = new Email();
        }
        return $this->_email;
    }
}
