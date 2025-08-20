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
            $this->quiz_capabilities(),
            $this->question_capabilities(),
            $this->statistic_capabilities(),
            $this->leaderboard_capabilities(),
            $this->order_capabilities(),
            $this->course_category_capabilities(),
            $this->course_tag_capabilities(),
            $this->setting_capabilities(),
            $this->quiz_category_capabilities(),
            $this->quiz_language_capabilities(),
            $this->tool_capabilities(),
            $this->student_capabilities(),
            $this->addon_capabilities(),
            $this->subject_capabilities(),
            $this->template_capabilities(),
            $this->design_studio_capabilities(),
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
            'acadlix_edit_course' => true,
            'acadlix_add_course_section' => true,
            'acadlix_edit_course_section' => true,
            'acadlix_delete_course_section' => true,
            'acadlix_add_course_section_lesson' => true,
            'acadlix_edit_course_section_lesson' => true,
            'acadlix_delete_course_section_lesson' => true,
            'acadlix_add_course_section_quiz' => true,
            'acadlix_edit_course_section_quiz' => true,
            'acadlix_delete_course_section_quiz' => true,
            'acadlix_sort_course_section' => true,
            'acadlix_sort_course_section_content'=> true,
            'acadlix_delete_course_section_content' => true,
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
            'acadlix_add_edit_language_to_quiz' => true,
            'acadlix_set_default_quiz_language' => true,
            'acadlix_delete_language_from_quiz' => true,
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
        ];
    }

    public function statistic_capabilities(): array
    {
        return [
            'acadlix_show_statistic' => true,
            'acadlix_delete_statistic' => true,
            'acadlix_reset_statistic' => true,
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
            'acadlix_add_order' => true,
            'acadlix_edit_order' => true,
            'acadlix_delete_order' => true,
            'acadlix_bulk_action_order' => true,
            'acadlix_bulk_delete_order' => true,
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
            'acadlix_show_quiz_setting' => true,
            'acadlix_show_notification_setting' => true,
            'acadlix_show_permalink_setting' => true,
            'acadlix_show_integration_setting' => true,
            'acadlix_update_setting' => true,
            'acadlix_create_page_setting' => true,
        ];
    }

    public function quiz_category_capabilities(): array
    {
        return [
            'acadlix_show_quiz_category' => true,
            'acadlix_add_quiz_category' => true,
            'acadlix_edit_quiz_category' => true,
            'acadlix_delete_quiz_category' => true,
        ];
    }

    public function quiz_language_capabilities(): array
    {
        return [
            'acadlix_show_quiz_language' => true,
            'acadlix_add_quiz_language' => true,
            'acadlix_edit_quiz_language' => true,
            'acadlix_delete_quiz_language' => true,
            'acadlix_default_quiz_language' => true,
        ];
    }

    public function tool_capabilities(): array
    {
        return [
            'acadlix_show_tool' => true,
        ];
    }

    public function student_capabilities(): array
    {
        return [
            'acadlix_show_student' => true,
        ];
    }

    public function addon_capabilities()
    {
        return [
            'acadlix_show_addon' => true,
            'acadlix_edit_addon' => true,
        ];
    }

    public function subject_capabilities(): array
    {
        return [
            'acadlix_show_subject' => true,
            'acadlix_add_subject' => true,
            'acadlix_edit_subject' => true,
            'acadlix_delete_subject' => true,
        ];
    }

    public function template_capabilities(): array
    {
        return [
            'acadlix_show_template' => true,
            'acadlix_add_template' => true,
            'acadlix_edit_template' => true,
            'acadlix_delete_template' => true,
        ];
    }

    public function design_studio_capabilities(): array
    {
        return [
            'acadlix_show_design_studio' => true,
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