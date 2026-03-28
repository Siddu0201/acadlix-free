<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

if (!class_exists("Admin")) {
  class Admin
  {
    protected static $_instance = null;
    protected $activator = null;
    protected $menu = null;
    protected $ajax = null;
    protected $core = null;
    protected $option = null;
    protected $userRole = null;

    public function __construct()
    {
      $this->activator();
      $this->ajax();
      $this->core();
      $this->option();
      $this->userRole();
      $this->menu();
    }

    public function activator(): Activator
    {
      if (is_null($this->activator)) {
        $this->activator = new Activator();
      }
      return $this->activator;
    }

    public function ajax(): Ajax
    {
      if (is_null($this->ajax)) {
        $this->ajax = new Ajax();
      }
      return $this->ajax;
    }

    public function core(): Core
    {
      if (is_null($this->core)) {
        $this->core = new Core();
      }
      return $this->core;
    }

    public function option(): Option
    {
      if (is_null($this->option)) {
        $this->option = new Option();
      }
      return $this->option;
    }

    public function userRole(): UserRole
    {
      if (is_null($this->userRole)) {
        $this->userRole = new UserRole();
      }
      return $this->userRole;
    }

    public function menu(): Menu
    {
      if (is_null($this->menu)) {
        $this->menu = new Menu();
      }
      return $this->menu;
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
