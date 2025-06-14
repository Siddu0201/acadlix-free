<?php 

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

class Controller {
    protected static $_instance = null;
    protected $allCourse = null;
    protected $cart = null;
    protected $checkout = null;
    protected $dashboard = null;
    protected $singleCourse = null;
    protected $thankyou = null;

    public function __construct() {
        $this->allCourse = new AllCourseController();
        $this->cart = new CartController();
        $this->checkout = new CheckoutController();
        $this->dashboard = new DashboardController();
        $this->singleCourse = new SingleCourseController();
        $this->thankyou = new ThankyouController();
    }

    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
