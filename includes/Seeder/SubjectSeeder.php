<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Models\Subject;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('SubjectSeeder')){
    class SubjectSeeder 
    {
        public function run()
        {
            $subject_name = "Uncategorized";
            $subject = Subject::where("subject_name", $subject_name)->first();
            if(!$subject){
                $subject = Subject::create(["subject_name" => $subject_name]);
            }
        }
    }
}