<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

class Controller
{
  protected static $_instance = null;
  protected $allCourse = null;
  protected $cart = null;
  protected $checkout = null;
  protected $dashboard = null;
  protected $singleCourse = null;
  protected $thankyou = null;
  protected $certificate = null;

  public function __construct()
  {
    $this->allCourse();
    $this->cart();
    $this->checkout();
    $this->dashboard();
    $this->singleCourse();
    $this->thankyou();
    $this->certificate();
  }

  public function allCourse(): AllCourseController
  {
    if (is_null($this->allCourse)) {
      $this->allCourse = new AllCourseController();
    }
    return $this->allCourse;
  }

  public function cart(): CartController
  {
    if (is_null($this->cart)) {
      $this->cart = new CartController();
    }
    return $this->cart;
  }

  public function checkout(): CheckoutController
  {
    if (is_null($this->checkout)) {
      $this->checkout = new CheckoutController();
    }
    return $this->checkout;
  }

  public function dashboard(): DashboardController
  {
    if (is_null($this->dashboard)) {
      $this->dashboard = new DashboardController();
    }
    return $this->dashboard;
  }

  public function singleCourse(): SingleCourseController
  {
    if (is_null($this->singleCourse)) {
      $this->singleCourse = new SingleCourseController();
    }
    return $this->singleCourse;
  }

  public function thankyou(): ThankyouController
  {
    if (is_null($this->thankyou)) {
      $this->thankyou = new ThankyouController();
    }
    return $this->thankyou;
  }

  public function certificate(): CertificateController
  {
    if (is_null($this->certificate)) {
      $this->certificate = new CertificateController();
    }
    return $this->certificate;
  }

  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }
}
