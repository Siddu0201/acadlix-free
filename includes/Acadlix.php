<?php
namespace Yuvayana\Acadlix {
    // Exit if accessed directly.
    if (!defined('ABSPATH')) {
        exit;
    }

    final class Acadlix
    {

        private static $_instance = null;

        public $version = '';

        public $pro = false;

        public $versionPath = 'Free';

        public $isDev = false;

        public $course_post_type = ACADLIX_COURSE_CPT;

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
                self::$_instance->init();
            }

            return self::$_instance;
        }

        private function init()
        {
            $this->constant();
            $this->includes();
            $this->load();
        }

        private function constant()
        {
            $defaultHeaders = [
                'name' => 'Plugin Name',
                'version' => 'Version',
            ];

            $pluginData = get_file_data(ACADLIX_PLUGIN_FILE, $defaultHeaders);

            $constants = [
                'ACADLIX_PLUGIN_NAME' => $pluginData['name'],
                'ACADLIX_VERSION' => $pluginData['version'],
            ];

            foreach ($constants as $constant => $value) {
                if (!defined($constant)) {
                    define($constant, $value);
                }
            }

            $this->version = ACADLIX_VERSION;
        }

        private function includes()
        {
            $dependencies = [
                '/vendor/autoload.php' => true,
                'bootstrap.php' => true
            ];

            foreach ($dependencies as $path => $shouldRequire) {
                if (!file_exists(ACADLIX_PLUGIN_DIR . $path)) {
                    // Something is not right.
                    status_header(500);
                    wp_die(esc_html__('Plugin is missing required dependencies. Please contact support for more information.', 'all-in-one-seo-pack'));
                }

                if ($shouldRequire) {
                    require_once ACADLIX_PLUGIN_DIR . $path;
                }
            }

        }

        private function loadVersion()
        {

        }

        private function load()
        {
            // Activator
            // Custom post type
            new CPT\Course();
            new CPT\CourseSection();
            new CPT\CourseSectionContent();
            new CPT\Lesson();
            new CPT\Paragraph();
            new CPT\Quiz();
            
            new Assets\Manager();
            
            new Admin\Activator();
            new Admin\Menu();
            new Admin\Ajax();
            new Admin\Core();
            new Admin\Option();

            new Controller\AdvanceQuizController();
            new Controller\AllCourseController();
            new Controller\CartController();
            new Controller\CheckoutController();
            new Controller\DashboardController();
            new Controller\SingleCourseController();
            new Controller\ThankyouController();

            new REST\Api();
        }
    }
}

namespace {

    // Exit if accessed directly.
    if (!defined('ABSPATH')) {
        exit;
    }

    function acadlix()
    {
        return Yuvayana\Acadlix\Acadlix::instance();
    }
}