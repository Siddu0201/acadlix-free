<?php 

namespace Yuvayana\Acadlix\Common\CPT;

defined('ABSPATH') || exit();

class CPT {
    protected static $_instance = null;

    protected ?Course $course = null;
    protected ?CourseSection $courseSection = null;
    protected ?CourseSectionContent $courseSectionContent = null;
    protected ?Lesson $lesson = null;
    protected ?Quiz $quiz = null;

    public function __construct() {
        $this->course();
        $this->courseSection();
        $this->courseSectionContent();
        $this->lesson();
        $this->quiz();
    }

    public function course(): Course {
        if (is_null($this->course)) {
            $this->course = new Course();
        }
        return $this->course;
    }

    public function courseSection(): CourseSection {
        if (is_null($this->courseSection)) {
            $this->courseSection = new CourseSection();
        }
        return $this->courseSection;
    }

    public function courseSectionContent(): CourseSectionContent {
        if (is_null($this->courseSectionContent)) {
            $this->courseSectionContent = new CourseSectionContent();
        }
        return $this->courseSectionContent;
    }

    public function lesson(): Lesson {
        if (is_null($this->lesson)) {
            $this->lesson = new Lesson();
        }
        return $this->lesson;
    }

    public function quiz(): Quiz {
        if (is_null($this->quiz)) {
            $this->quiz = new Quiz();
        }
        return $this->quiz;
    }

    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
