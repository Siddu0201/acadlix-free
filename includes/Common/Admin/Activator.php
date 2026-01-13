<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

class Activator
{
    public $dbVersion = 10;
    public function __construct()
    {
        if (!is_admin())
            return;

        add_action('admin_notices', [$this, 'acadlix_deactivation_admin_notices']);
        add_action('admin_init', [$this, 'maybe_run_activation'], 5);
        // register_activation_hook(ACADLIX_PLUGIN_FILE, [$this, 'activate']);
        register_deactivation_hook(ACADLIX_PLUGIN_FILE, [$this, 'deactivate']);

        add_action('wp_initialize_site', [$this, 'initialize_new_site'], 10, 1);
        add_action('wp_delete_site', [$this, 'acadlix_delete_site'], 10, 1);

        // add_action('plugins_loaded', [$this, 'acadlix_load_textdomain']);
        add_action('admin_init', [$this, 'acadlix_check_db_update']);
    }

    public function acadlix_deactivation_admin_notices()
    {
        if (!current_user_can('activate_plugins')) {
            return;
        }

        $notice = get_option('acadlix_deactivated_plugin_notice');

        if (!$notice) {
            return;
        }

        delete_option('acadlix_deactivated_plugin_notice');

        $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $notice['plugin'], false, false);
        $plugin_name = $plugin_data['Name'] ?? __('the other Acadlix plugin', 'acadlix');

        ?>
        <div class="notice notice-warning is-dismissible">
            <p>
                <?php
                echo esc_html(
                    sprintf(
                        /* translators: 1: plugin name */
                        __('"%s" was automatically deactivated because only one version of Acadlix can be active at a time.', 'acadlix'),
                        $plugin_name
                    )
                );
                ?>
            </p>
        </div>
        <?php
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

    public function maybe_run_activation()
    {
        if (!is_admin()) {
            return;
        }
        $pending = get_option('acadlix_activation_pending');

        if (
            empty($pending) ||
            $pending['plugin'] !== ACADLIX_PLUGIN_BASENAME
        ) {
            return;
        }

        delete_option('acadlix_activation_pending');

        if (is_multisite() && !empty($pending['network'])) {
            foreach (get_sites(['fields' => 'ids']) as $site_id) {
                switch_to_blog($site_id);
                $this->run_site_activation();
                restore_current_blog();
            }
        } else {
            $this->run_site_activation();
        }
    }

    // public function activate($network_wide)
    // {
    //     if (is_multisite() && $network_wide) {
    //         // Loop through all existing sites
    //         foreach (get_sites(['fields' => 'ids']) as $site_id) {
    //             switch_to_blog($site_id);
    //             $this->run_site_activation();
    //             restore_current_blog();
    //         }
    //     } else {
    //         $this->run_site_activation();
    //     }
    // }

    private function run_site_activation()
    {
        acadlix()->migration()->createTable();
        acadlix()->seeder()->seed();
        acadlix()->admin()->option()->createOption();
        acadlix()->admin()->userRole()->addCapabilities();
        acadlix()->cpt()->register_all_cpts();
        acadlix()->schedule()->createSchedules();
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
        acadlix()->schedule()->deleteSchedules();
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
        // load_plugin_textdomain('acadlix', false, ACADLIX_PLUGIN_FOLDER_NAME . '/languages/' . acadlix()->versionPath);
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

        $installed_ver = (int) acadlix()->helper()->acadlix_get_option('acadlix_db_version') ?: 1;

        $updates = [
            2 => 'updateV2',
            3 => 'updateV3',
            4 => 'updateV4',
            5 => 'updateV5',
            6 => 'updateV6', // update 1.3.0
            7 => 'updateV7', // update 1.4.0
            8 => 'updateV8', // update 1.5.0
            9 => 'updateV9', // update 1.6.0,
            10 => 'updateV10', // update 1.6.1,
            11 => 'updateV11', // update 1.7.0,
        ];

        foreach ($updates as $version => $method) {
            if ($installed_ver < $version && method_exists($this, $method)) {
                acadlix()->migration()->createTable(); // function to update schema/data
                acadlix()->seeder()->seed(); // function to upadte schema/data
                acadlix()->admin()->userRole()->addCapabilities(); // to update capabilities
                acadlix()->helper()->acadlix_update_option('acadlix_db_version', $this->dbVersion);
                $this->$method();
            }
        }
    }

    protected function updateV11()
    {
        /**
         * In this update add assessment question type.
         */
    }

    protected function updateV10()
    {
        /**
         * Update for review module
         */
    }

    protected function updateV9()
    {
        /**
         * In this update add export functionality.
         */
    }

    protected function updateV8()
    {
        /**
         * In this update modify course statistic
         * Add Schedule
         */

        $course_statistic = acadlix()->model()->courseStatistic()
            ->whereNull('course_id')
            ->get();
        foreach ($course_statistic as $statistic) {
            $statistic->update([
                'course_id' => $statistic->order_item->course_id,
            ]);
        }

        acadlix()->schedule()->createSchedules();
    }



    protected function updateV7()
    {
        /**
         * In this update some user roles.
         */
    }

    protected function updateV6()
    {
        /**
         * In this update add student module.
         */
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