<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Models\Subject;
use Yuvayana\Acadlix\Models\Topic;

if(!class_exists('SubjectSeeder')){
    class SubjectSeeder 
    {
        public function run()
        {
            $subject_name = "Uncategorized";
            $subject = Subject::where("subject_name", $subject_name)->first();
            if(!$subject){
                $subject = Subject::create(["subject_name" => $subject_name]);
                $subject->topic()->create(["topic_name" => $subject_name]);
            }
        }
    }
}