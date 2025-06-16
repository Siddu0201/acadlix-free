<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

class UserRole
{
    protected array $roles = [];

    public function __construct()
    {
        $this->roles = $this->get_roles();
    }

    public function get_roles(): array
    {
        return [
            'administrator' => [
                'display_name' => 'Administrator',
                'capabilities' => $this->administrator_capabilities()
            ],

        ];
    }

    public function administrator_capabilities(): array
    {
        return array_merge(
            $this->course_capabilities(),
            $this->lesson_capabilities(),
            $this->assignment_capabilities(),
            $this->quiz_capabilities(),
            $this->question_capabilities(),
            $this->paragraph_capabilities(),
            $this->statistic_capabilities(),
            $this->leaderboard_capabilities(),
            $this->order_capabilities(),
            $this->course_category_capabilities(),
            $this->course_tag_capabilities(),
            $this->setting_capabilities(),
            $this->quiz_category_capabilities(),
            $this->quiz_language_capabilities(),
            $this->tool_capabilities()
        );
    }

    public function course_capabilities(): array
    {
        return [
            'edit_acadlix_course' => true,
            'read_acadlix_course' => true,
            'delete_acadlix_course' => true,
            'edit_acadlix_courses' => true,
            'edit_others_acadlix_courses' => true,
            'publish_acadlix_courses' => true,
            'read_private_acadlix_courses' => true,
            'delete_acadlix_courses' => true,
            'delete_private_acadlix_courses' => true,
            'delete_published_acadlix_courses' => true,
            'delete_others_acadlix_courses' => true,
            'edit_private_acadlix_courses' => true,
            'edit_published_acadlix_courses' => true,
            'acadlix_add_course_section' => true,
            'acadlix_edit_course_section' => true,
            'acadlix_delete_course_section' => true,
            'acadlix_add_course_section_lesson' => true,
            'acadlix_edit_course_section_lesson' => true,
            'acadlix_delete_course_section_lesson' => true,
            'acadlix_add_course_section_quiz' => true,
            'acadlix_edit_course_section_quiz' => true,
            'acadlix_delete_course_section_quiz' => true,
            'acadlix_add_course_section_assignment' => true,
            'acadlix_edit_course_section_assignment' => true,
            'acadlix_delete_course_section_assignment' => true,
        ];
    }

    public function lesson_capabilities(): array
    {
        return [
            'acadlix_show_lesson' => true,
            'acadlix_add_lesson' => true,
            'acadlix_edit_lesson' => true,
            'acadlix_delete_lesson' => true,
            'acadlix_bulk_action_lesson' => true,
            'acadlix_bulk_delete_lesson' => true,
        ];
    }

    public function assignment_capabilities(): array
    {
        return [
            'acadlix_show_assignment' => true,
            'acadlix_add_assignment' => true,
            'acadlix_edit_assignment' => true,
            'acadlix_delete_assignment' => true,
            'acadlix_bulk_action_assignment' => true,
            'acadlix_bulk_delete_assignment' => true,
        ];
    }

    public function quiz_capabilities(): array
    {
        return [
            'acadlix_show_quiz' => true,
            'acadlix_add_quiz' => true,
            'acadlix_edit_quiz' => true,
            'acadlix_delete_quiz' => true,
            'acadlix_bulk_action_quiz' => true,
            'acadlix_bulk_delete_quiz' => true,
            'acadlix_bulk_set_category_quiz' => true,
            'acadlix_subject_wise_action_quiz' => true,
        ];
    }

    public function question_capabilities(): array
    {
        return [    
            'acadlix_show_question' => true,
            'acadlix_add_question' => true,
            'acadlix_edit_question' => true,
            'acadlix_delete_question' => true,
            'acadlix_bulk_action_question' => true,
            'acadlix_bulk_delete_question' => true,
            'acadlix_bulk_set_subject_and_point_question' => true,
            'acadlix_bulk_set_paragraph_question' => true,
            'acadlix_import_question' => true,
        ];
    }

    public function paragraph_capabilities(): array
    {
        return [
            'acadlix_show_paragraph' => true,
            'acadlix_add_paragraph' => true,
            'acadlix_edit_paragraph' => true,
            'acadlix_delete_paragraph' => true,
            'acadlix_bulk_action_paragraph' => true,
            'acadlix_bulk_delete_paragraph' => true,
        ];
    }

    public function statistic_capabilities(): array
    {
        return [
            'acadlix_show_statistic' => true,
            'acadlix_delete_statistic' => true,
            'acadlix_reset_statistic' => true,
            'acadlix_show_answersheet' => true,
        ];
    }

    public function leaderboard_capabilities(): array
    {
        return [
            'acadlix_show_leaderboard' => true,
            'acadlix_reset_leaderboard' => true,
        ];
    }

    public function order_capabilities(): array
    {
        return [
            'acadlix_show_order' => true,
        ];
    }

    public function course_category_capabilities(): array
    {
        return [
            'acadlix_manage_course_categories' => true,
            'acadlix_edit_course_categories' => true,
            'acadlix_delete_course_categories' => true,
            'acadlix_assign_course_categories' => true,
        ];
    }

    public function course_tag_capabilities(): array
    {
        return [
            'acadlix_manage_course_tag' => true,
            'acadlix_edit_course_tag' => true,
            'acadlix_delete_course_tag' => true,
            'acadlix_assign_course_tag' => true,
        ];
    }

    public function setting_capabilities(): array
    {
        return [
            'acadlix_show_setting' => true,
            'acadlix_show_general_setting' => true,
            'acadlix_show_payment_setting' => true,
            'acadlix_show_notification_setting' => true,
            'acadlix_show_permalink_setting' => true,
            'acadlix_show_quiz_setting' => true,
            'acadlix_show_license_setting' => true,
        ];
    }

    public function quiz_category_capabilities(): array
    {
        return [
            'acadlix_add_quiz_category' => true,
            'acadlix_edit_quiz_category' => true,
            'acadlix_delete_quiz_category' => true,
        ];
    }

    public function quiz_language_capabilities(): array
    {
        return [
            'acadlix_add_quiz_language' => true,
            'acadlix_edit_quiz_language' => true,
            'acadlix_default_quiz_language' => true,
        ];
    }

    public function tool_capabilities(): array
    {
        return [
            'acadlix_show_tool' => true,
        ];
    }

    public function isBuiltInRole(string $role): bool
    {
        $default_roles = ['administrator', 'editor', 'author', 'contributor', 'subscriber'];
        return in_array($role, $default_roles, true);
    }

    public function addCapabilities()
    {
        foreach ($this->roles as $role_key => $role_data) {
            if ($this->isBuiltInRole($role_key)) {
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

    public function removeCapabilities()
    {
        foreach ($this->roles as $role_key => $role_data) {
            if ($this->isBuiltInRole($role_key)) {
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