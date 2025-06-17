<?php 

namespace Yuvayana\Acadlix\Common\Models;

class Models
{
    protected $category = null;
    protected $course = null;
    protected $courseCart = null;
    protected $courseSection = null;
    protected $courseSectionContent = null;
    protected $courseStatistic = null;
    protected $language = null;
    protected $lesson = null;
    protected $order = null;
    protected $orderItem = null;
    protected $orderMeta = null;
    protected $question = null;
    protected $questionLang = null;
    protected $quiz = null;
    protected $quizShortcode = null;
    protected $statistic = null;
    protected $statisticRef = null;
    protected $subject = null;
    protected $template = null;
    protected $toplist = null;
    protected $userActivityMeta = null;
    protected $wpPostMeta = null;
    protected $wpPosts = null;
    protected $wpUsers = null;
    protected $wpUserMeta = null;

    public function category(): Category|null{
        if(is_null($this->category)){
            $this->category = new Category();
        }
        return $this->category;
    }

    public function course(): Course|null{
        if(is_null($this->course)){
            $this->course = new Course();
        }
        return $this->course;
    }

    public function courseCart(): CourseCart|null{
        if(is_null($this->courseCart)){
            $this->courseCart = new CourseCart();
        }
        return $this->courseCart;
    }

    public function courseSection(): CourseSection|null{
        if(is_null($this->courseSection)){
            $this->courseSection = new CourseSection();
        }
        return $this->courseSection;
    }

    public function courseSectionContent(): CourseSectionContent|null{
        if(is_null($this->courseSectionContent)){
            $this->courseSectionContent = new CourseSectionContent();
        }
        return $this->courseSectionContent;
    }

    public function courseStatistic(): CourseStatistic|null{
        if(is_null($this->courseStatistic)){
            $this->courseStatistic = new CourseStatistic();
        }
        return $this->courseStatistic;
    }

    public function language(): Language|null{
        if(is_null($this->language)){
            $this->language = new Language();
        }
        return $this->language;
    }

    public function lesson(): Lesson|null{
        if(is_null($this->lesson)){
            $this->lesson = new Lesson();
        }
        return $this->lesson;
    }

    public function order(): Order|null{
        if(is_null($this->order)){
            $this->order = new Order();
        }
        return $this->order;
    }

    public function orderItem(): OrderItem|null{
        if(is_null($this->orderItem)){
            $this->orderItem = new OrderItem();
        }
        return $this->orderItem;
    }

    public function orderMeta(): OrderMeta|null{
        if(is_null($this->orderMeta)){
            $this->orderMeta = new OrderMeta();
        }
        return $this->orderMeta;
    }

    public function question(): Question|null{
        if(is_null($this->question)){
            $this->question = new Question();
        }
        return $this->question;
    }

    public function questionLang(): QuestionLang|null{
        if(is_null($this->questionLang)){
            $this->questionLang = new QuestionLang();
        }
        return $this->questionLang;
    }

    public function quiz(): Quiz|null{
        if(is_null($this->quiz)){
            $this->quiz = new Quiz();
        }
        return $this->quiz;
    }

    public function quizShortcode(): QuizShortcode|null{
        if(is_null($this->quizShortcode)){
            $this->quizShortcode = new QuizShortcode();
        }
        return $this->quizShortcode;
    }

    public function statistic(): Statistic|null{
        if(is_null($this->statistic)){
            $this->statistic = new Statistic();
        }
        return $this->statistic;
    }

    public function statisticRef(): StatisticRef|null{
        if(is_null($this->statisticRef)){
            $this->statisticRef = new StatisticRef();
        }
        return $this->statisticRef;
    }

    public function subject(): Subject|null{
        if(is_null($this->subject)){
            $this->subject = new Subject();
        }
        return $this->subject;
    }

    public function template(): Template|null{
        if(is_null($this->template)){
            $this->template = new Template();
        }
        return $this->template;
    }

    public function toplist(): Toplist|null{
        if(is_null($this->toplist)){
            $this->toplist = new Toplist();
        }
        return $this->toplist;
    }

    public function userActivityMeta(): UserActivityMeta|null{
        if(is_null($this->userActivityMeta)){
            $this->userActivityMeta = new UserActivityMeta();
        }
        return $this->userActivityMeta;
    }

    public function wpPostMeta(): WpPostMeta|null{
        if(is_null($this->wpPostMeta)){
            $this->wpPostMeta = new WpPostMeta();
        }
        return $this->wpPostMeta;
    }

    public function wpPosts(): WpPosts|null{
        if(is_null($this->wpPosts)){
            $this->wpPosts = new WpPosts();
        }
        return $this->wpPosts;
    }

    public function wpUserMeta(): WpUserMeta|null{
        if(is_null($this->wpUserMeta)){
            $this->wpUserMeta = new WpUserMeta();
        }
        return $this->wpUserMeta;
    }

    public function wpUsers(): WpUsers|null{
        if(is_null($this->wpUsers)){
            $this->wpUsers = new WpUsers();
        }
        return $this->wpUsers;
    }

}
