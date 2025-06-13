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
            $this->activator = $this->init_activator();
            $this->ajax = $this->init_ajax();
            $this->core = $this->init_core();
            $this->option = $this->init_option();
            $this->userRole = $this->init_user_role();
            $this->menu = $this->init_menu();
        }

        public function init_activator(){
            return new Activator();
        }

        public function init_ajax(){
            return new Ajax();
        }

        public function init_core(){
            return new Core();
        }

        public function init_option(){
            return new Option();
        }

        public function init_user_role(){
            return new UserRole();
        }

        public function init_menu(){
            return new Menu();
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
