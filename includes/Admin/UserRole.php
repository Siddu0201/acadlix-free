<?php

namespace Yuvayana\Acadlix\Admin;

defined('ABSPATH') || exit();

class UserRole
{
    private static array $roles = [
        'administrator' => [
            'display_name' => 'Administrator',
            'capabilities' => [
                // home capabilities
                'acadlix_show_home' => true,
                // course capabilities
                'acadlix_add_course_section' => true,
                'acadlix_edit_course_section' => true,
                'acadlix_delete_course_section' => true,
                'acadlix_add_course_section_lesson' => true,
                'acadlix_edit_course_section_lesson' => true,
                'acadlix_delete_course_section_lesson' => true,
                'acadlix_add_course_section_quiz' => true,
                'acadlix_edit_course_section_quiz' => true,
                'acadlix_delete_course_section_quiz' => true,
                // lesson capabilities
                'acadlix_show_lesson' => true,
                'acadlix_add_lesson' => true,
                'acadlix_edit_lesson' => true,
                'acadlix_delete_lesson' => true,
                'acadlix_bulk_action_lesson' => true,
                'acadlix_bulk_delete_lesson' => true,
                // quiz capabilites
                'acadlix_show_quiz' => true,
                'acadlix_add_quiz' => true,
                'acadlix_edit_quiz' => true,
                'acadlix_delete_quiz' => true,
                'acadlix_bulk_action_quiz' => true,
                'acadlix_bulk_delete_quiz' => true,
                'acadlix_bulk_set_category_quiz' => true,
                'acadlix_subject_wise_action_quiz' => true,
                // question capabilities
                'acadlix_show_question' => true,
                'acadlix_add_question' => true,
                'acadlix_edit_question' => true,
                'acadlix_delete_question' => true,
                'acadlix_bulk_action_question' => true,
                'acadlix_bulk_delete_question' => true,
                'acadlix_bulk_set_subject_and_point_question' => true,
                'acadlix_bulk_set_paragraph_question' => true,
                'acadlix_import_question' => true,
                // paragraph capabilities
                'acadlix_show_paragraph' => true,
                'acadlix_add_paragraph' => true,
                'acadlix_edit_paragraph' => true,
                'acadlix_delete_paragraph' => true,
                'acadlix_bulk_action_paragraph' => true,
                'acadlix_bulk_delete_paragraph' => true,
                // statistic capabilities
                'acadlix_show_statistic' => true,
                'acadlix_delete_statistic' => true,
                'acadlix_reset_statistic' => true,
                'acadlix_show_answersheet' => true,
                // leaderboard capabilities
                'acadlix_show_leaderboard' => true,
                'acadlix_reset_leaderboard' => true,
                // order capabilities
                'acadlix_show_order' => true,
                // course category capabilities
                'acadlix_manage_course_categories' => true,
                'acadlix_edit_course_categories' => true,
                'acadlix_delete_course_categories' => true,
                'acadlix_assign_course_categories' => true,
                // course tag capabilities
                'acadlix_manage_course_tag' => true,
                'acadlix_edit_course_tag' => true,
                'acadlix_delete_course_tag' => true,
                'acadlix_assign_course_tag' => true,
                // setting capabilities
                'acadlix_show_setting' => true,
                'acadlix_show_general_setting' => true,
                'acadlix_show_payment_setting' => true,
                'acadlix_show_notification_setting' => true,
                'acadlix_show_permalink_setting' => true,
                'acadlix_show_quiz_setting' => true,
                'acadlix_show_license_setting' => true,
                // quiz category capabilities
                'acadlix_add_quiz_category' => true,
                'acadlix_edit_quiz_category' => true,
                'acadlix_delete_quiz_category' => true,
                // quiz language capabilities
                'acadlix_add_quiz_language' => true,
                'acadlix_edit_quiz_language' => true,
                'acadlix_default_quiz_language' => true,
                // tool capabilities
                'acadlix_show_tool' => true,
            ]
        ]
    ];

    public static function isBuiltInRole(string $role): bool
    {
        $default_roles = ['administrator', 'editor', 'author', 'contributor', 'subscriber'];
        return in_array($role, $default_roles, true);
    }

    public static function addCapabilities()
    {
        foreach (self::$roles as $role_key => $role_data) {
            if (self::isBuiltInRole($role_key)) {
                $role = get_role($role_key);
                if ($role) {
                    foreach ($role_data['capabilities'] as $capability => $value) {
                        if (!$role->has_cap($capability)) {
                            $role->add_cap($capability, $value);
                        }
                    }
                }
            } else {
                if (!get_role($role_key)) {
                    add_role($role_key, $role_data['display_name'], $role_data['capabilities']);
                }
            }
        }
    }

    public static function removeCapabilities()
    {
        foreach (self::$roles as $role_key => $role_data) {
            if (self::isBuiltInRole($role_key)) {
                $role = get_role($role_key);
                if ($role) {
                    foreach ($role_data['capabilities'] as $capability => $value) {
                        if ($role->has_cap($capability)) {
                            $role->remove_cap($capability);
                        }
                    }
                }
            } else {
                if (get_role($role_key)) {
                    remove_role($role_key);
                }
            }
        }
    }

}