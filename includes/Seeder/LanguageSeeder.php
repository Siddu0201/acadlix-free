<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Models\Language;

defined( 'ABSPATH' ) || exit();

if(!class_exists('LanguageSeeder')){
    class LanguageSeeder 
    {
        public function run()
        {
            require_once ABSPATH . 'wp-admin/includes/translation-install.php';
		    $translations = wp_get_available_translations();
            $local = get_locale(  );
            $languages = [
                ["name" => $local == 'en_US' ? "English" : explode(' ',$translations[$local]['english_name'])[0], "default" => true],
            ];
            foreach($languages as $lang){
                $language = Language::where("language_name", $lang['name'])->first();
                if(!$language){
                    Language::create(["language_name" => $lang['name'], "default" => $lang['default']]);
                }
            }
        }
    }
}