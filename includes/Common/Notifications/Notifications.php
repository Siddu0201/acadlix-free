<?php

namespace Yuvayana\Acadlix\Common\Notifications;

defined('ABSPATH') || exit();

class Notifications
{
    protected $_email;

    public function email(): Email
    {
        if (!$this->_email) {
            $this->_email = new Email();
        }
        return $this->_email;
    }
}
