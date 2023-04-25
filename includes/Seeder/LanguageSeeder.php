<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Models\Language;

if(!class_exists('LanguageSeeder')){
    class LanguageSeeder 
    {
        public function run()
        {
            $language_name = "English";
            $language = Language::where("language_name", $language_name)->first();
            if(!$language){
                Language::create(["language_name" => $language_name]);
            }
        }
    }
}