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

defined( 'ABSPATH' ) || exit;

use Illuminate\Database\Capsule\Manager;
use Yuvayana\Acadlix\Migrations\Migration;
use Yuvayana\Acadlix\Seeder\Seeder;

final class Acadlix {

    const ACADLIX_VERSION = '0.0.1';

    const ACADLIX_DB_VERSION = 1;

    const SLUG = 'acadlix';

    private function __construct() 
    {
        require 'bootstrap.php';
        $this->define_constants();

        register_activation_hook( __FILE__, [ $this, 'activate' ] );
        register_deactivation_hook( __FILE__, [ $this, 'deactivate' ] );
        $this->init_plugin();
    }

    public static function init() {
        static $instance = false;

        if ( ! $instance ) {
            $instance = new Acadlix();
        }

        return $instance;
    }

    public function define_constants()
    {
        define( 'ACADLIX_VERSION', self::ACADLIX_VERSION );
        define( 'ACADLIX_SLUG', self::SLUG );
        define( 'ACADLIX_FILE', __FILE__ );
        define( 'ACADLIX_DIR', __DIR__ );
        define( 'ACADLIX_PATH', dirname( ACADLIX_FILE ) );
        define( 'ACADLIX_INCLUDES', ACADLIX_PATH . '/includes' );
        define( 'ACADLIX_TEMPLATE_PATH', ACADLIX_PATH . '/templates' );
        define( 'ACADLIX_URL', plugins_url( '', ACADLIX_FILE ) );
        define( 'ACADLIX_BUILD', ACADLIX_URL . '/build' );
        // define( 'ACADLIX_ASSETS', ACADLIX_URL . '/assets' );
    }

    public function init_plugin()
    {
        if(is_admin()){
            new Yuvayana\Acadlix\Admin\Menu();
        }
        new Yuvayana\Acadlix\Assets\Manager();
    }

    public function activate()
    {
        Migration::createTable();
        Seeder::seed();
    }

    public function deactivate()
    {
        Migration::removeTable();
    }
}

function acadlix(){
    return Acadlix::init();

}

acadlix();
