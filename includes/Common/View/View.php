<?php

namespace Yuvayana\Acadlix\Common\View;

defined('ABSPATH') || exit();

class View {
    protected static $_instance = null;
    protected $allCourse = null;

    public function __construct() {
        
    }

    public function allCourse(): AllCourseView {
        if (is_null($this->allCourse)) {
            $this->allCourse = new AllCourseView();
        }
        return $this->allCourse;
    }
    
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
    
        return self::$_instance;
    }
}


