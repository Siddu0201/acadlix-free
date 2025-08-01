<?php

namespace Yuvayana\Acadlix\Common\REST;

/**
 * API Manager class
 * 
 * All API classes would be registered here
 */
// Admin API Controller
use Yuvayana\Acadlix\Common\REST\Admin\AdminAddonController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminCourseController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminHomeController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminLanguageController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminCategoryController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminLeaderboardController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminLessonController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminOrderController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminSettingController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminStatisticController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminStudentController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminSubjectController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminQuizController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminQuestionController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminTemplateController;
use Yuvayana\Acadlix\Common\REST\Admin\AdminThemeController;

// Front API Controller
use Yuvayana\Acadlix\Common\REST\Front\FrontCheckoutController;
use Yuvayana\Acadlix\Common\REST\Front\FrontCourseController;
use Yuvayana\Acadlix\Common\REST\Front\FrontDashboardController;
use Yuvayana\Acadlix\Common\REST\Front\FrontQuizController;
use Yuvayana\Acadlix\Common\REST\Front\FrontStatisticController;
use Yuvayana\Acadlix\Common\REST\Front\FrontUserController;

defined( 'ABSPATH' ) || exit();

class REST {

    protected static $_instance = null;

    /**
     * Class dir and class name mapping.
     *
     * @var array
     *
     */
    protected array $_rests;

    protected $_adminHome = null;
    protected $_adminLanguage = null;
    protected $_adminCategory = null;
    protected $_adminSubject = null;
    protected $_adminQuiz = null;
    protected $_adminQuestion = null;
    protected $_adminTemplate = null;
    protected $_adminStatistic = null;
    protected $_adminLeaderboard = null;
    protected $_adminLesson = null;
    protected $_adminCourse = null;
    protected $_adminSetting = null;
    protected $_adminOrder = null;
    protected $_adminAddon = null;
    protected $_adminStudent = null;
    protected $_adminTheme = null;

    protected $_frontCheckout = null;
    protected $_frontCourse = null;
    protected $_frontDashboard = null;
    protected $_frontQuiz = null;
    protected $_frontStatistic = null;
    protected $_frontUser = null;

    /**
     * Constructor used to register all apis.
     */
    public function __construct() {
        if ( ! class_exists( 'WP_REST_Server' ) ) {
            return;
        }

        $this->adminHome();
        $this->adminlanguage();
        $this->admincategory();
        $this->adminSubject();
        $this->adminQuiz();
        $this->adminQuestion();
        $this->adminTemplate();
        $this->adminStatistic();
        $this->adminLeaderboard();
        $this->adminLesson();
        $this->adminCourse();
        $this->adminSetting();
        $this->adminOrder();
        $this->adminAddon();
        $this->adminStudent();
        $this->adminTheme();

        $this->frontCheckout();
        $this->frontCourse();
        $this->frontDashboard();
        $this->frontQuiz();
        $this->frontStatistic();
        $this->frontUser();

        // Init REST API routes.
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ), 10 );
    }

    public function adminHome(): AdminHomeController|null{
        if($this->_adminHome === null){
            $this->_adminHome = new AdminHomeController();
        }
        $this->_rests[] = $this->_adminHome;
        return $this->_adminHome;
    }   

    public function adminlanguage(): AdminLanguageController|null{
        if($this->_adminLanguage === null){
            $this->_adminLanguage = new AdminLanguageController();
        }
        $this->_rests[] = $this->_adminLanguage;
        return $this->_adminLanguage;
    }   

    public function admincategory(): AdminCategoryController|null{
        if($this->_adminCategory === null){
            $this->_adminCategory = new AdminCategoryController();
        }
        $this->_rests[] = $this->_adminCategory;
        return $this->_adminCategory;
    }   

    public function adminSubject(): AdminSubjectController|null{
        if($this->_adminSubject === null){
            $this->_adminSubject = new AdminSubjectController();
        }
        $this->_rests[] = $this->_adminSubject;
        return $this->_adminSubject;
    }   

    public function adminQuiz(): AdminQuizController|null{
        if($this->_adminQuiz === null){
            $this->_adminQuiz = new AdminQuizController();
        }
        $this->_rests[] = $this->_adminQuiz;
        return $this->_adminQuiz;
    }   

    public function adminQuestion(): AdminQuestionController|null{
        if($this->_adminQuestion === null){
            $this->_adminQuestion = new AdminQuestionController();
        }
        $this->_rests[] = $this->_adminQuestion;
        return $this->_adminQuestion;
    }   

    public function adminTemplate(): AdminTemplateController|null{
        if($this->_adminTemplate === null){
            $this->_adminTemplate = new AdminTemplateController();
        }
        $this->_rests[] = $this->_adminTemplate;
        return $this->_adminTemplate;
    }   

    public function adminStatistic(): AdminStatisticController|null{
        if($this->_adminStatistic === null){
            $this->_adminStatistic = new AdminStatisticController();
        }
        $this->_rests[] = $this->_adminStatistic;
        return $this->_adminStatistic;
    }

    public function adminLeaderboard(): AdminLeaderboardController|null{
        if($this->_adminLeaderboard === null){
            $this->_adminLeaderboard = new AdminLeaderboardController();
        }
        $this->_rests[] = $this->_adminLeaderboard;
        return $this->_adminLeaderboard;
    }

    public function adminLesson(): AdminLessonController|null{
        if($this->_adminLesson === null){
            $this->_adminLesson = new AdminLessonController();
        }
        $this->_rests[] = $this->_adminLesson;
        return $this->_adminLesson;
    }

    public function adminCourse(): AdminCourseController|null{
        if($this->_adminCourse === null){
            $this->_adminCourse = new AdminCourseController();
        }
        $this->_rests[] = $this->_adminCourse;
        return $this->_adminCourse;
    }

    public function adminSetting(): AdminSettingController|null{
        if($this->_adminSetting === null){
            $this->_adminSetting = new AdminSettingController();
        }
        $this->_rests[] = $this->_adminSetting;
        return $this->_adminSetting;
    }

    public function adminOrder(): AdminOrderController|null{
        if($this->_adminOrder === null){
            $this->_adminOrder = new AdminOrderController();
        }
        $this->_rests[] = $this->_adminOrder;
        return $this->_adminOrder;
    }

    public function adminAddon() {
        if($this->_adminAddon === null){
            $this->_adminAddon = new AdminAddonController();
        }
        $this->_rests[] = $this->_adminAddon;
        return $this->_adminAddon;
    }

    public function adminStudent(): AdminStudentController|null{
        if($this->_adminStudent === null){
            $this->_adminStudent = new AdminStudentController();
        }
        $this->_rests[] = $this->_adminStudent;
        return $this->_adminStudent;
    }

    public function adminTheme(): AdminThemeController|null{
        if($this->_adminTheme === null){
            $this->_adminTheme = new AdminThemeController();
        }
        $this->_rests[] = $this->_adminTheme;
        return $this->_adminTheme;
    }

    public function frontCheckout(): FrontCheckoutController|null{
        if($this->_frontCheckout === null){
            $this->_frontCheckout = new FrontCheckoutController();
        }
        $this->_rests[] = $this->_frontCheckout;
        return $this->_frontCheckout;
    }

    public function frontCourse(): FrontCourseController|null{
        if($this->_frontCourse === null){
            $this->_frontCourse = new FrontCourseController();
        }
        $this->_rests[] = $this->_frontCourse;
        return $this->_frontCourse;
    }

    public function frontDashboard(): FrontDashboardController|null{
        if($this->_frontDashboard === null){
            $this->_frontDashboard = new FrontDashboardController();
        }
        $this->_rests[] = $this->_frontDashboard;
        return $this->_frontDashboard;
    }

    public function frontQuiz(): FrontQuizController|null{
        if($this->_frontQuiz === null){
            $this->_frontQuiz = new FrontQuizController();
        }
        $this->_rests[] = $this->_frontQuiz;
        return $this->_frontQuiz;
    }

    public function frontStatistic(): FrontStatisticController|null{
        if($this->_frontStatistic === null){
            $this->_frontStatistic = new FrontStatisticController();
        }
        $this->_rests[] = $this->_frontStatistic;
        return $this->_frontStatistic;
    }

    public function frontUser(): FrontUserController|null{
        if($this->_frontUser === null){
            $this->_frontUser = new FrontUserController();
        }
        $this->_rests[] = $this->_frontUser;
        return $this->_frontUser;
    }
    /**
     * Register rest API route function
     *
     * @return void
     */
    public function register_rest_routes(): void {
        foreach ( $this->_rests as $controller ) {
            method_exists($controller, 'register_routes') && $controller->register_routes();
        }
    }

    public static function instance() {
        if ( ! self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}