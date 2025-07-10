<?php 

namespace Yuvayana\Acadlix\Common\CPT;

defined('ABSPATH') || exit();

class CPT {
    protected static $_instance = null;

    protected $_all_cpts = [];
    protected $course = null;
    protected $courseSection = null;
    protected $courseSectionContent = null;
    protected $lesson = null;
    protected $quiz = null;

    public function __construct() {
        $this->course();
        $this->courseSection();
        $this->courseSectionContent();
        $this->lesson();
        $this->quiz();
    }

    public function register_all_cpts(){
        foreach ($this->_all_cpts as $cpt) {
            method_exists($cpt, '_acadlix_register') && $cpt->_acadlix_register();
        }
        flush_rewrite_rules();
    }

    public function unregister_all_cpts()
    {
        foreach ($this->_all_cpts as $cpt) {
            method_exists($cpt, '_acadlix_unregister') && $cpt->_acadlix_unregister();
        }
        flush_rewrite_rules();
    }

    public function course(): Course {
        if (is_null($this->course)) {
            $this->course = new Course();
        }
        $this->_all_cpts[] = $this->course;
        return $this->course;
    }

    public function courseSection(): CourseSection {
        if (is_null($this->courseSection)) {
            $this->courseSection = new CourseSection();
        }
        $this->_all_cpts[] = $this->courseSection;
        return $this->courseSection;
    }

    public function courseSectionContent(): CourseSectionContent {
        if (is_null($this->courseSectionContent)) {
            $this->courseSectionContent = new CourseSectionContent();
        }
        $this->_all_cpts[] = $this->courseSectionContent;
        return $this->courseSectionContent;
    }

    public function lesson(): Lesson {
        if (is_null($this->lesson)) {
            $this->lesson = new Lesson();
        }
        $this->_all_cpts[] = $this->lesson;
        return $this->lesson;
    }

    public function quiz(): Quiz {
        if (is_null($this->quiz)) {
            $this->quiz = new Quiz();
        }
        $this->_all_cpts[] = $this->quiz;
        return $this->quiz;
    }

    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
