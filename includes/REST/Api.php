<?php

namespace Yuvayana\Acadlix\REST;

class Api {

    /**
     * Class dir and class name mapping.
     *
     * @var array
     *
     */
    protected $class_map;

    /**
     * Constructor.
     */
    public function __construct() {
        if ( ! class_exists( 'WP_REST_Server' ) ) {
            return;
        }

        $this->class_map = apply_filters(
            'acadlix_rest_api_class_map',
            [
                \Yuvayana\Acadlix\REST\QuizController::class
            ]
        );

        // Init REST API routes.
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ), 10 );
    }

    public function register_rest_routes(): void {
        foreach ( $this->class_map as $controller ) {
            $this->$controller = new $controller();
            $this->$controller->register_routes();
        }
    }
}