<?php

namespace Yuvayana\Acadlix\Admin;

defined('ABSPATH') || exit();

class UserRole
{
    protected static $_instance = null;
    public function __construct()
    {
        add_action('init', array($this, 'acadlix_add_user_roles'));
    }

    public function acadlix_add_user_roles()
    {
        $course_cap = ACADLIX_COURSE_CPT . 's';
        $admin = get_role('administrator');
        if ($admin) {
            $admin->add_cap('read_private_' . $course_cap);
            $admin->add_cap('delete_' . $course_cap);
            $admin->add_cap('delete_published_' . $course_cap);
            $admin->add_cap('edit_' . $course_cap);
            $admin->add_cap('edit_published_' . $course_cap);
            $admin->add_cap('publish_' . $course_cap);
            $admin->add_cap('delete_private_' . $course_cap);
            $admin->add_cap('edit_private_' . $course_cap);
            $admin->add_cap('delete_others_' . $course_cap);
            $admin->add_cap('edit_others_' . $course_cap);
        }
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}