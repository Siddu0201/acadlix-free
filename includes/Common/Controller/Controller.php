<?php 

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

class Controller {
    protected static $_instance = null;
    protected ?AllCourseController $allCourse = null;
    protected ?CartController $cart = null;
    protected ?CheckoutController $checkout = null;
    protected ?DashboardController $dashboard = null;
    protected ?SingleCourseController $singleCourse = null;
    protected ?ThankyouController $thankyou = null;

    public function __construct() {
        $this->allCourse();
        $this->cart();
        $this->checkout();
        $this->dashboard();
        $this->singleCourse();
        $this->thankyou();
    }

    public function allCourse(): AllCourseController {
        if (is_null($this->allCourse)) {
            $this->allCourse = new AllCourseController();
        }
        return $this->allCourse;
    }

    public function cart(): CartController {
        if (is_null($this->cart)) {
            $this->cart = new CartController();
        }
        return $this->cart;
    }

    public function checkout(): CheckoutController {
        if (is_null($this->checkout)) {
            $this->checkout = new CheckoutController();
        }
        return $this->checkout;
    }

    public function dashboard(): DashboardController {
        if (is_null($this->dashboard)) {
            $this->dashboard = new DashboardController();
        }
        return $this->dashboard;
    }

    public function singleCourse(): SingleCourseController {
        if (is_null($this->singleCourse)) {
            $this->singleCourse = new SingleCourseController();
        }
        return $this->singleCourse;
    }

    public function thankyou(): ThankyouController {
        if (is_null($this->thankyou)) {
            $this->thankyou = new ThankyouController();
        }
        return $this->thankyou;
    }

    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
