<?php
namespace Yuvayana\Acadlix {
    // Exit if accessed directly.
    if (!defined('ABSPATH')) {
        exit;
    }

    final class Acadlix extends \AcadlixAbstract
    {

        private static $_instance = null;

        public $version = '';

        public $pro = false;

        public $versionPath = 'Free';

        public $isDev = false;

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
            $this->preLoad();
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

            $this->loadVersion();

        }

        private function loadVersion()
        {
            $proDir = is_dir(ACADLIX_INCLUDES_PATH . 'Pro');
            
            $this->pro = $proDir;
            $this->versionPath = $proDir ? 'Pro' : 'Free';
        }

        private function preLoad(){
            $this->license = $this->pro ? new Pro\Admin\License() : null;
        }

        private function load()
        {
            $this->cpt = new Common\CPT\CPT();
            $this->assets = new Common\Assets\Assets();
            $this->admin = $this->pro ? new Pro\Admin\Admin() : new Common\Admin\Admin();
            $this->controller = new Common\Controller\Controller();
            $this->api = new Common\REST\Api();
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