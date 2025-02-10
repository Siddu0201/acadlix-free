<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Models\Subject;

defined( 'ABSPATH' ) || exit();

if(!class_exists('SubjectSeeder')){
    class SubjectSeeder 
    {
        public function run()
        {
            $subject_name = "Uncategorized";
            $subject = Subject::get();
            if($subject->count() == 0){
                $subject = Subject::create([
                    "subject_name" => $subject_name,
                    "default" => true
                ]);
            }
        }
    }
}