<?php

namespace Yuvayana\Acadlix\Common\View;

defined('ABSPATH') || exit();

class View
{
  protected static $_instance = null;
  protected $allCourse = null;
  protected $singleCourse = null;

  protected $thankyou = null;

  public function __construct()
  {

  }

  public function allCourse(): AllCourseView
  {
    if (is_null($this->allCourse)) {
      $this->allCourse = new AllCourseView();
    }
    return $this->allCourse;
  }

  public function singleCourse(): SingleCourseView
  {
    if (is_null($this->singleCourse)) {
      $this->singleCourse = new SingleCourseView();
    }
    return $this->singleCourse;
  }

  public function thankyou(): ThankyouView
  {
    if (is_null($this->thankyou)) {
      $this->thankyou = new ThankyouView();
    }
    return $this->thankyou;
  }

  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }
}


