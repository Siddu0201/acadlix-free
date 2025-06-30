<?php

namespace Yuvayana\Acadlix\Common\Admin;

if (!defined('ABSPATH')) {
    exit;
}

class Activator
{
    public $dbVersion = 2;
    public function __construct()
    {
        if (!is_admin())
            return;

        register_activation_hook(ACADLIX_PLUGIN_FILE, [$this, 'activate']);
        register_deactivation_hook(ACADLIX_PLUGIN_FILE, [$this, 'deactivate']);

        add_action('init', [$this, 'acadlix_load_textdomain']);
        add_action('plugin_loaded', [$this, 'acadlix_check_db_update']);
    }


    public function activate()
    {
        // require_once ABSPATH . 'wp-admin/includes/plugin.php';
        // if(acadlix()->pro){
        //     if(is_plugin_active('acadlix/acadlix.php')){
        //         // disable this plugin
        //         deactivate_plugins('acadlix/acadlix.php');

        //         error_log('Acadlix Free is active');
        //     }
        // }else{
        //     if(is_plugin_active('acadlix-pro/acadlix.php')){
        //         // disable this plugin
        //         deactivate_plugins('acadlix-pro/acadlix.php');
        //         error_log('Acadlix Pro is active');
        //     }
        // }
        // Add table
        acadlix()->migration()->createTable();
        // Add default data
        acadlix()->seeder()->seed();
        // Add options
        acadlix()->admin()->option()->createOption();
        // Add capabilities
        acadlix()->admin()->userRole()->addCapabilities();

    }

    public function deactivate()
    {
        // Migration::removeTable();
        // remove capabilities
        acadlix()->admin()->userRole()->removeCapabilities();
    }

    public function uninstall()
    {
        $delete_data = acadlix()->helper()->acadlix_get_option('acadlix_delete_data_on_plugin_uninstall', "no");

        if ($delete_data == "no")
            return;
        // remove post data related to acadlix
        acadlix()->admin()->core()->acadlix_delete_post_type_data();
        // remove table
        acadlix()->migration()->removeTable();
        // remove options
        acadlix()->admin()->option()->removeOption();
    }

    public function acadlix_load_textdomain()
    {
        load_plugin_textdomain('acadlix', false, ACADLIX_PLUGIN_FOLDER_NAME . '/languages/'. acadlix()->versionPath);
    }

    public function acadlix_check_db_update()
    {
        $installed_ver = get_option('acadlix_db_version');

        if ($installed_ver != $this->dbVersion) {
            acadlix()->migration()->createTable(); // function to update schema/data
            update_option('acadlix_db_version', $this->dbVersion);
        }

        $this->handle_subject_correction();
    }

    protected function handle_subject_correction()
    {
        $subject = acadlix()->model()->subject()->where('default', 1)->first();
        $questions = acadlix()->model()->question()->where('subject_id', null)->get();
        if ($questions->count() > 0 && $subject) {
            foreach ($questions as $question) {
                $question->update([
                    'subject_id' => $subject->id,
                ]);
            }
        }
    }
}