<?php

defined('ABSPATH') || exit();

abstract class AcadlixAbstract {
	protected $database = null;

	protected $license = null;

	protected $admin = null;

	protected $controller = null;

	protected $view = null;

	protected $rest = null;

	protected $assets = null;

	protected $cpt = null;

	protected $helper = null;

	protected $migration = null;

	protected $seeder = null;

	protected $ai = null;

	protected $model = null;

	protected $integrations = null;

	protected $payments = null;
	
	public function database()
	{
		return $this->database;
	}

	public function license(){
		return $this->license;
	}

	public function admin(){
		return $this->admin;
	}

	public function controller(){
		return $this->controller;
	}

	public function view(){
		return $this->view;
	}

	public function rest(){
		return $this->rest;
	}

	public function assets(){
		return $this->assets;
	}

	public function cpt(){
		return $this->cpt;
	}

	public function helper(){
		return $this->helper;
	}

	public function migration(){
		return $this->migration;
	}

	public function seeder(){
		return $this->seeder;
	}

	public function ai(){
		return $this->ai;
	}

	public function model(){
		return $this->model;
	}

	public function integrations(){
		return $this->integrations;
	}	

	public function payments(){
		return $this->payments;
	}
}