<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('AssignmentSubmission')) {
    class AssignmentSubmission extends Model
    {
        protected $table = "acadlix_assignment_submissions";

        protected $fillable = [
            'assignment_user_stats_id',
            'is_active',
            'is_late',
            'marks',
            'answer_text',
            'answer_attachments',
            'feedback',
            'feedback_attachments',
            'submitted_at',
            'evaluated_at',
        ];

        public function setAnswerAttachmentsAttribute($value){
            $this->attributes['answer_attachments'] = maybe_serialize($value);
        }

        public function getAnswerAttachmentsAttribute($value){
            return maybe_unserialize($value);
        }

        public function setFeedbackAttachmentsAttribute($value){
            $this->attributes['feedback_attachments'] = maybe_serialize($value);
        }

        public function getFeedbackAttachmentsAttribute($value){
            return maybe_unserialize($value);
        }

        public function assignment_user_stats(){
            return $this->belongsTo(AssignmentUserStats::class, 'assignment_user_stats_id', 'id');
        }
    }
}
