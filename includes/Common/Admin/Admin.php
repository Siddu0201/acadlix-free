<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

if (!class_exists("Admin")) {
    class Admin
    {
        protected static $_instance = null;

        public $activator = null;

        public $menu = null;

        public $ajax = null;

        public $core = null;

        public $option = null;

        public $userRole = null;

        public function __construct()
        {
            $this->activator = new Activator();
            $this->menu = new Menu();
            $this->ajax = new Ajax();
            $this->core = new Core();
            $this->option = new Option();
            $this->userRole = new UserRole();
        }


        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }
    }
}
