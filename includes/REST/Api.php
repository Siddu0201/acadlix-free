<?php

namespace Yuvayana\Acadlix\REST;

/**
 * API Manager class
 * 
 * All API classes would be registered here
 */
// Admin API Controller
use Yuvayana\Acadlix\REST\Admin\AdminCourseController;
use Yuvayana\Acadlix\REST\Admin\AdminLanguageController;
use Yuvayana\Acadlix\REST\Admin\AdminCategoryController;
use Yuvayana\Acadlix\REST\Admin\AdminLeaderboardController;
use Yuvayana\Acadlix\REST\Admin\AdminLessonController;
use Yuvayana\Acadlix\REST\Admin\AdminParagraphController;
use Yuvayana\Acadlix\REST\Admin\AdminStatisticController;
use Yuvayana\Acadlix\REST\Admin\AdminSubjectController;
use Yuvayana\Acadlix\REST\Admin\AdminQuizController;
use Yuvayana\Acadlix\REST\Admin\AdminQuestionController;
use Yuvayana\Acadlix\REST\Admin\AdminTemplateController;

// Front API Controller
use Yuvayana\Acadlix\REST\Front\FrontQuizController;
use Yuvayana\Acadlix\REST\Front\FrontUserController;

// Upoad API Controller
use Yuvayana\Acadlix\REST\Upload\UploadQuizController;

defined( 'ABSPATH' ) || exit();

#[\AllowDynamicProperties] class Api {

    protected static $_instance = null;

    /**
     * Class dir and class name mapping.
     *
     * @var array
     *
     */
    protected $class_map;

    /**
     * Constructor used to register all apis.
     */
    public function __construct() {
        if ( ! class_exists( 'WP_REST_Server' ) ) {
            return;
        }

        $this->class_map = apply_filters(
            'acadlix_rest_api_class_map',
            [
                // Admin Controllers
                AdminLanguageController::class,
                AdminCategoryController::class,
                AdminSubjectController::class,
                AdminQuizController::class,
                AdminQuestionController::class,
                AdminTemplateController::class,
                AdminStatisticController::class,
                AdminLeaderboardController::class,
                AdminParagraphController::class,
                AdminLessonController::class,
                AdminCourseController::class,

                // Front Controllers
                FrontQuizController::class,
                FrontUserController::class,

                // Upload Controllers
                UploadQuizController::class,
            ]
        );

        // Init REST API routes.
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ), 10 );
    }

    /**
     * Register rest API route function
     *
     * @return void
     */
    public function register_rest_routes(): void {
        foreach ( $this->class_map as $controller ) {
            if(method_exists($controller, 'register_routes')){
                $this->$controller = new $controller();
                $this->$controller->register_routes();
            }
        }
    }

    public static function instance() {
        if ( ! self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}