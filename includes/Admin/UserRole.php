<?php

namespace Yuvayana\Acadlix\Admin;

defined('ABSPATH') || exit();

class UserRole
{
    private string $role;
    private string $display_name;
    private array $capabilities;
    public function __construct(string $role, string $display_name, array $capabilities)
    {
        $this->role = $role;
        $this->display_name = $display_name;
        $this->capabilities = $capabilities;
    }

    public function addRoleWithCapabilities()
    {
        $role_object = get_role($this->role);

        if (!$role_object) {
            // Role does not exist, create it with capabilities
            add_role($this->role, $this->display_name, $this->capabilities);
        } else {
            // Role exists, update capabilities if missing
            foreach ($this->capabilities as $capability => $grant) {
                if (!$role_object->has_cap($capability)) {
                    $role_object->add_cap($capability, $grant);
                }
            }
        }
    }

    public static function activate()
    {
        // Define roles and capabilities
        $roles = [
            new UserRole('administrator', 'Administrator', [
                'read' => true,
                'edit_posts' => true,
                'manage_options' => true,
                'delete_posts' => true,
            ]),
        ];

        // Loop through and add/update roles
        foreach ($roles as $role) {
            $role->addRoleWithCapabilities();
        }
    }

}