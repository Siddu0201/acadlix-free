<?php

namespace Yuvayana\Acadlix\Common\Seeder;

defined( 'ABSPATH' ) || exit();

if(!class_exists('SubjectSeeder')){
    class SubjectSeeder 
    {
        public function run()
        {
            $subject_name = "Uncategorized";
            $subject = acadlix()->model()->subject()->get();
            if($subject->count() == 0){
                $subject = acadlix()->model()->subject()->create([
                    "subject_name" => $subject_name,
                    "default" => true
                ]);
            }
        }
    }
}