<?php

namespace Yuvayana\Acadlix\Common\Submenu;

use Yuvayana\Acadlix\Common\Helper\Helper;

defined('ABSPATH') || exit();

class Submenu_License
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix License', 'acadlix'),
            'menu_title' => __('License', 'acadlix'),
            'capability' => 'acadlix_show_license_setting',
            'menu_slug' => 'acadlix_license',
            'callback' => [$this, 'license_callback'],
            'position' => 40
        ];
    }

    public function add_submenu()
    {
        $page = add_submenu_page(
            $this->_options['parent_slug'],
            $this->_options['page_title'],
            $this->_options['menu_title'],
            $this->_options['capability'],
            $this->_options['menu_slug'],
            $this->_options['callback'],
            $this->_options['position']
        );

        // add_action("admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
    }

    public function admin_print_scripts()
    {

    }

    public function license_callback()
    {
        $token = acadlix()->license->updater->getConfiguration()->getEntity()->getActivationToken();
        Helper::instance()->acadlix_ddd(acadlix()->license->updater->getConfiguration()->getClient()->getLicenseCacheKey( $token ));
        echo '<div class="wrap">';
        echo '<div class="acadlix-form-group">';
        acadlix()->license->updater->getActivator()->renderActivationForm();
        echo '</div>';
        echo '<style>.acadlix-form-group {background-color: #fff; padding: 10px; max-width: 50%; margin-top: 10px;}</style>';
        echo '</div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}