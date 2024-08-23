<?php

namespace Yuvayana\Acadlix\Admin;

defined('ABSPATH') || exit();

class Core
{
    private static $_instance = null;
    public function __construct()
    {
        add_filter( 'use_block_editor_for_post_type', array($this, 'acadlix_gutenberg_disable_cpt'), 10, 2 );
    }


    public function acadlix_gutenberg_disable_cpt($use_block_editor, $post_type)
    {
        if($post_type === ACADLIX_COURSE_CPT){
            $use_block_editor = false;
        }
        return $use_block_editor;
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}