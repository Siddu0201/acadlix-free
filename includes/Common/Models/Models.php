<?php 

namespace Yuvayana\Acadlix\Common\Models;

defined('ABSPATH') || exit();

class Models
{
    protected array $instances = [];

    protected function getInstance(string $key, string $class)
    {
        $blog_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;
        $cache_key = $blog_id . ':' . $key;

        if (!isset($this->instances[$cache_key])) {
            $this->instances[$cache_key] = new $class();
        }

        return $this->instances[$cache_key];
    }

    public function category(): Category|null{
        return $this->getInstance('category', Category::class);
    }

    public function course(): Course|null{
        return $this->getInstance('course', Course::class);
    }

    public function courseCart(): CourseCart|null{
        return $this->getInstance('courseCart', CourseCart::class);
    }

    public function courseSection(): CourseSection|null{
        return $this->getInstance('courseSection', CourseSection::class);
    }

    public function courseSectionContent(): CourseSectionContent|null{
        return $this->getInstance('courseSectionContent', CourseSectionContent::class);
    }

    public function courseStatistic(): CourseStatistic|null{
        return $this->getInstance('courseStatistic', CourseStatistic::class);
    }

    public function language(): Language|null{
        return $this->getInstance('language', Language::class);
    }

    public function lesson(): Lesson|null{
        return $this->getInstance('lesson', Lesson::class);
    }

    public function order(): Order|null{
        return $this->getInstance('order', Order::class);
    }

    public function orderItem(): OrderItem|null{
        return $this->getInstance('orderItem', OrderItem::class);
    }

    public function orderMeta(): OrderMeta|null{
        return $this->getInstance('orderMeta', OrderMeta::class);
    }

    public function question(): Question|null{
        return $this->getInstance('question', Question::class);
    }

    public function questionLang(): QuestionLang|null{
        return $this->getInstance('questionLang', QuestionLang::class);
    }

    public function quiz(): Quiz|null{
        return $this->getInstance('quiz', Quiz::class);
    }

    public function quizShortcode(): QuizShortcode|null{
        return $this->getInstance('quizShortcode', QuizShortcode::class);
    }

    public function statistic(): Statistic|null{
        return $this->getInstance('statistic', Statistic::class);
    }

    public function statisticRef(): StatisticRef|null{
        return $this->getInstance('statisticRef', StatisticRef::class);
    }

    public function subject(): Subject|null{
        return $this->getInstance('subject', Subject::class);
    }

    public function template(): Template|null{
        return $this->getInstance('template', Template::class);
    }

    public function toplist(): Toplist|null{
        return $this->getInstance('toplist', Toplist::class);
    }

    public function userActivityMeta(): UserActivityMeta|null{
        return $this->getInstance('userActivityMeta', UserActivityMeta::class);
    }

    public function wpPostMeta(): WpPostMeta|null{
        return $this->getInstance('wpPostMeta', WpPostMeta::class);
    }

    public function wpPosts(): WpPosts|null{
        return $this->getInstance('wpPosts', WpPosts::class);
    }

    public function wpUserMeta(): WpUserMeta|null{
        return $this->getInstance('wpUserMeta', WpUserMeta::class);
    }

    public function wpUsers(): WpUsers|null{
        return $this->getInstance('wpUsers', WpUsers::class);
    }

}
