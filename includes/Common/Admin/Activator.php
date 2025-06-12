<?php

namespace Yuvayana\Acadlix\Common\Admin;

use Yuvayana\Acadlix\Common\Helper\Helper;
use Yuvayana\Acadlix\Common\Migrations\Migration;
use Yuvayana\Acadlix\Common\Seeder\Seeder;

if (!defined('ABSPATH')) {
    exit;
}

class Activator
{
    public function __construct()
    {
        if (!is_admin())
            return;
        register_activation_hook(ACADLIX_PLUGIN_FILE, [$this, 'activate']);
        register_deactivation_hook(ACADLIX_PLUGIN_FILE, [$this, 'deactivate']);

        add_action('init', [$this, 'acadlix_load_textdomain']);
    }


    public function activate()
    {
        // Add table
        Migration::createTable();
        // Add default data
        Seeder::seed();
        // Add options
        Option::createOption();
        // Add capabilities
        UserRole::addCapabilities();
        
    }

    public function deactivate()
    {
        // Migration::removeTable();
    }

    public static function uninstall()
    {
        $delete_data = Helper::instance()->acadlix_get_option('acadlix_delete_data_on_plugin_uninstall', "no");

        if($delete_data == "no")
            return;
        // remove post data related to acadlix
        Core::acadlix_delete_post_type_data();
        // remove table
        Migration::removeTable();
        // remove options
        Option::removeOption();
        // remove capabilities
        UserRole::removeCapabilities();
    }

    public function acadlix_load_textdomain()
    {
        // load_plugin_textdomain('acadlix', false, ACADLIX_PLUGIN_FOLDER_NAME . '/languages/');
    }
}