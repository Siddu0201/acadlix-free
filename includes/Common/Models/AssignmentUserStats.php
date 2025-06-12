<?php 

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('AssignmentUserStats')) {
    class AssignmentUserStats extends Model
    {
        protected $table = "acadlix_assignment_user_stats";

        protected $fillable = [
            'assignment_id',
            'course_statistic_id',
            'user_status',
            'admin_status',
            'attempt_counts',
            'final_marks',
            'is_passed',
            'has_late_submission',
            'resubmission_allowed',
            'first_started_at',
        ];

        public function course_statistic(){
            return $this->belongsTo(CourseStatistic::class, 'course_statistic_id', 'id');
        }

        public function assignment(){
            return $this->belongsTo(Assignment::class, 'assignment_id', 'ID');
        }

        public function submissions(){
            return $this->hasMany(AssignmentSubmission::class, 'assignment_user_stats_id', 'id');
        }
    }
}