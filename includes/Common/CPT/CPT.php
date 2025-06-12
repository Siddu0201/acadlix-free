<?php 

namespace Yuvayana\Acadlix\Common\CPT;

defined('ABSPATH') || exit();

class CPT {
    protected static $_instance = null;

    protected $course = null;
    protected $courseSection = null;
    protected $courseSectionContent = null;
    protected $lesson = null;
    protected $paragraph = null;
    protected $quiz = null;
    protected $assignment = null;

    public function __construct() {
        $this->course = new Course();
        $this->courseSection = new CourseSection();
        $this->courseSectionContent = new CourseSectionContent();
        $this->lesson = new Lesson();
        $this->paragraph = new Paragraph();
        $this->quiz = new Quiz();
        $this->assignment = new Assignment();
    }

    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
