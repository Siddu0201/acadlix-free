<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Wordpress advance quiz plugin by yuvayana
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Version:           0.0.1
 * Tested upto:       6.1.1
 * Author:            sudhanshu agarwal<sudhanshuag02012000@gmail.com>
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       acadlix
 */

use Yuvayana\Acadlix\Admin\Core;
use Yuvayana\Acadlix\Admin\Menu;
use Yuvayana\Acadlix\Admin\UserRole;
use Yuvayana\Acadlix\Assets\Manager;
use Yuvayana\Acadlix\Migrations\Migration;
use Yuvayana\Acadlix\REST\Api;
use Yuvayana\Acadlix\Seeder\Seeder;

use Yuvayana\Acadlix\Admin\Option;
use Yuvayana\Acadlix\CPT\Course;

defined('ABSPATH') || exit();

if (!defined('ACADLIX_PLUGIN_FILE')) {
    define('ACADLIX_PLUGIN_FILE', __FILE__);
    include_once 'includes/acadlix-contant.php';
}

if (!class_exists('Acadlix')) {
    class Acadlix
    {

        const ACADLIX_VERSION = '0.0.1';

        const ACADLIX_DB_VERSION = 1;

        const SLUG = 'acadlix';

        private static $_instance = null;

        private function __construct()
        {
            require 'bootstrap.php';

            register_activation_hook(__FILE__, [$this, 'activate']);
            register_deactivation_hook(__FILE__, [$this, 'deactivate']);
            $this->init_plugin();
        }

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }

        public function init_plugin()
        {
            // Custom Post type
            Course::instance();

            Manager::instance();
            if (is_admin()) {
                Menu::instance();
            }

            UserRole::instance();
            Core::instance();
            Api::instance();

        }

        public static function activate()
        {
            Migration::createTable();
            Seeder::seed();
            Option::instance()->createOption();

        }

        public static function deactivate()
        {
            // Migration::removeTable();
        }

        public static function uninstall()
        {
            Migration::removeTable();
        }
    }

}

function acadlix()
{
    return Acadlix::instance();

}
acadlix();

register_uninstall_hook(__FILE__, 'Acadlix::uninstall');
