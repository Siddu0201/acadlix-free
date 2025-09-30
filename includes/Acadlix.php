<?php
namespace Yuvayana\Acadlix {
    defined('ABSPATH') || exit();
    final class Acadlix extends \AcadlixAbstract
    {

        private static $_instance = null;

        public $version = '';

        public $pro = false;

        public $versionPath = 'Common';

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
                'ACADLIX_MARKETPLACE_URL' => 'https://acadlix.com/',
                'ACADLIX_DOCUMENTATION_URL' => 'https://acadlix.com/docs/acadlix/',
                'ACADLIX_CONTACT_US_URL' => 'https://acadlix.com/contact-us/',
                'ACADLIX_MARKETING_DOMAIN'  => 'acadlix.com'
            ];

            foreach ($constants as $constant => $value) {
                if (!defined($constant)) {
                    define($constant, $value);
                }
            }
            $this->isDev = defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'local';
            $this->version = ACADLIX_VERSION;
        }

        private function includes()
        {
            $dependencies = [
                '/vendor/autoload.php' => true,
                // 'bootstrap.php' => true
            ];

            foreach ($dependencies as $path => $shouldRequire) {
                if (!file_exists(ACADLIX_PLUGIN_DIR . $path)) {
                    // Something is not right.
                    status_header(500);
                    wp_die(esc_html__('Plugin is missing required dependencies. Please contact support for more information.', 'acadlix'));
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
            $this->versionPath = $proDir ? 'Pro' : 'Common';
        }

        private function preLoad(){
            $this->database = new Common\Models\Database(); 
            $this->license = $this->pro ? new Pro\License\License() : null;
            $this->helper = $this->pro ? new Pro\Helper\Helper() : new Common\Helper\Helper();
        }

        private function load()
        {
            $this->admin = $this->pro ? new Pro\Admin\Admin() : new Common\Admin\Admin();
            $this->assets = $this->pro ? new Pro\Assets\Assets() : new Common\Assets\Assets();
            $this->controller = $this->pro ? new Pro\Controller\Controller() : new Common\Controller\Controller();
            $this->view = $this->pro ? new Pro\View\View() : new Common\View\View();
            $this->cpt = $this->pro ? new Pro\CPT\CPT() : new Common\CPT\CPT();
            $this->migration = $this->pro  ? new Pro\Migrations\Migrations() : new Common\Migrations\Migrations();
            $this->model = $this->pro  ? new Pro\Models\Models() : new Common\Models\Models();
            $this->seeder = $this->pro ? new Pro\Seeder\Seeder() : new Common\Seeder\Seeder();
            $this->rest = $this->pro ? new Pro\REST\REST() : new Common\REST\REST();

            $this->ai = $this->pro ? new Pro\Ai\Ai() : null;
            $this->integrations = $this->pro ? new Pro\Integrations\Integrations() : new Common\Integrations\Integrations();
            $this->payments = $this->pro ? new Pro\Payments\Payments() : new Common\Payments\Payments();
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