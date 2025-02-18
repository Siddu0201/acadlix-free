<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Question')) {
    class Question extends Model
    {
        protected $connection = 'default';
        protected $table = "question";

        protected $fillable = [
            "quiz_id",
            "subject_id",
            "online",
            "sort",
            "title",
            "points",
            "negative_points",
            "different_points_for_each_answer",
            "different_incorrect_msg",
            "hint_enabled",
            "paragraph_enabled",
            "paragraph_id",
            "answer_type",
            "meta",
        ];
        protected $with = [
            'question_languages',
            'subject',
        ];

        protected $appends = ['paragraph'];

        public function scopeOfOnline($query)
        {
            return $query->where("online", 1);
        }

        public function scopeOfOffline($query)
        {
            return $query->where("online", 0);
        }

        public function setSubjectIdAttribute($value)
        {
            $default_subject_id = Subject::where("default", 1)->first()->id;
            $this->attributes['subject_id'] = $value == null ? $default_subject_id : $value;
        }


        // public function quiz(){
        //     return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        // }

        public function subject()
        {
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }


        public function question_languages()
        {
            return $this->hasMany(QuestionLang::class, 'question_id', 'id');
        }

        public function getParagraphAttribute()
        {
            if($this->paragraph_id){
                return Paragraph::ofParagraph()->find($this->paragraph_id);
            }
            return [];
        }


        public function createNewLanguage($language_id, $copy_default_language)
        {
            if ($this->question_languages()->where('language_id', $language_id)->exists()) {
                return new \WP_Error(
                    'language_exist',
                    __('Language already exists for this question.', 'acadlix'),
                    ['status' => 400]
                );
            }

            $defaultLanguage = $this->question_languages()->where('default', 1)->first();
            if (!$defaultLanguage) {
                return new \WP_Error(
                    'default_language_doesnt_exist',
                    __('Default language data not found for this question.', 'acadlix'),
                    ['status' => 400]
                );
            }

            $newLanguageData = $defaultLanguage->replicate();
            $newLanguageData->language_id = $language_id; // Set the new language
            $newLanguageData->default = false; // Mark it as non-default
            if (!$copy_default_language) {
                $newLanguageData->question = "";
                $newLanguageData->correct_msg = "";
                $newLanguageData->incorrect_msg = "";
                $newLanguageData->hint_msg = "";
                $newLanguageData->answer_data = $newLanguageData->emptyAnswerData();
            }
            $newLanguageData->save();
        }

    }
}