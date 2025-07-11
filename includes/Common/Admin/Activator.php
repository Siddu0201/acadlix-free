<?php

namespace Yuvayana\Acadlix\Common\Admin;

if (!defined('ABSPATH')) {
    exit;
}

class Activator
{
    public $dbVersion = 5;
    public function __construct()
    {
        if (!is_admin())
            return;

        register_activation_hook(ACADLIX_PLUGIN_FILE, [$this, 'activate']);
        register_deactivation_hook(ACADLIX_PLUGIN_FILE, [$this, 'deactivate']);

        add_action('wp_initialize_site', [$this, 'initialize_new_site'], 10, 1);
        add_action('wp_delete_site', [$this, 'acadlix_delete_site'], 10, 1);

        add_action('plugins_loaded', [$this, 'acadlix_load_textdomain']);
        add_action('admin_init', [$this, 'acadlix_check_db_update']);
    }

    public function initialize_new_site($site)
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (!is_plugin_active_for_network(ACADLIX_PLUGIN_BASENAME)) {
            return;
        }

        switch_to_blog($site->blog_id);

        $this->run_site_activation();

        restore_current_blog();
    }

    public function activate($network_wide)
    {
        if (is_multisite() && $network_wide) {
            // Loop through all existing sites
            foreach (get_sites(['fields' => 'ids']) as $site_id) {
                switch_to_blog($site_id);
                $this->run_site_activation();
                restore_current_blog();
            }
        } else {
            $this->run_site_activation();
        }
    }

    private function run_site_activation()
    {
        acadlix()->migration()->createTable();
        acadlix()->seeder()->seed();
        acadlix()->admin()->option()->createOption();
        acadlix()->admin()->userRole()->addCapabilities();
        acadlix()->cpt()->register_all_cpts();
    }

    public function deactivate($network_wide)
    {
        if (is_multisite() && $network_wide) {
            foreach (get_sites(['fields' => 'ids']) as $site_id) {
                switch_to_blog($site_id);
                $this->run_site_deactivation();
                restore_current_blog();
            }
        } else {
            $this->run_site_deactivation();
        }
    }

    public function run_site_deactivation()
    {
        acadlix()->admin()->userRole()->removeCapabilities();
        acadlix()->cpt()->unregister_all_cpts();
    }

    public function uninstall()
    {
        if (is_multisite()) {
            foreach (get_sites(['fields' => 'ids']) as $site_id) {
                switch_to_blog($site_id);
                $delete_data = acadlix()->helper()->acadlix_get_option('acadlix_delete_data_on_plugin_uninstall', "no");
                if ($delete_data === "no") {
                    return;
                }
                $this->run_site_uninstall();
                restore_current_blog();
            }
        } else {
            $delete_data = acadlix()->helper()->acadlix_get_option('acadlix_delete_data_on_plugin_uninstall', "no");
            if ($delete_data === "no") {
                return;
            }
            $this->run_site_uninstall();
        }
    }

    public function acadlix_delete_site($site)
    {
        $blog_id = (int) $site->id;
        switch_to_blog($blog_id);
        acadlix()->migration()->removeTable();
        restore_current_blog();
    }

    private function run_site_uninstall()
    {
        acadlix()->admin()->core()->acadlix_delete_post_type_data();
        acadlix()->migration()->removeTable();
        acadlix()->admin()->option()->removeOptions();
    }

    public function acadlix_load_textdomain()
    {
        load_plugin_textdomain('acadlix', false, ACADLIX_PLUGIN_FOLDER_NAME . '/languages/' . acadlix()->versionPath);
    }

    public function acadlix_check_db_update()
    {
        if (!current_user_can('manage_options')) {
            return;
        }


        if (is_multisite() && is_plugin_active_for_network(ACADLIX_PLUGIN_BASENAME)) {
            // Loop through all sites
            $sites = get_sites(['deleted' => 0]);
            foreach ($sites as $site) {
                switch_to_blog($site->blog_id);
                $this->run_db_update();
                restore_current_blog();
            }
        } else {
            $this->run_db_update();
        }
    }

    protected function run_db_update()
    {
        $didUpdate = false;

        $installed_ver = (int) acadlix()->helper()->acadlix_get_option('acadlix_db_version') ?: 1;

        $updates = [
            2 => 'updateV2',
            3 => 'updateV3',
            4 => 'updateV4',
            5 => 'updateV5',
        ];

        foreach ($updates as $version => $method) {
            if ($installed_ver < $version && method_exists($this, $method)) {
                $this->$method();
                $didUpdate = true;
            }
        }

        if ($didUpdate) {
            acadlix()->migration()->createTable(); // function to update schema/data
            acadlix()->seeder()->seed(); // function to upadte schema/data
            acadlix()->admin()->userRole()->addCapabilities(); // to update capabilities
            acadlix()->helper()->acadlix_update_option('acadlix_db_version', $this->dbVersion);
        }
    }

    protected function updateV5()
    {
        /**
         * In this update add multisite functionality.
         */
    }

    protected function updateV4()
    {
        /**
         * In this update add capabilities for zoom run through addCapabilities function.
         */
    }

    protected function updateV3()
    {
        /**
         * In this update add column attempted_at in statistic table run through createTable function.
         */
    }


    protected function updateV2()
    {
        /**
         * In this update also run subject seeder to add default subject.
         * Update questions subject_id
         */
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