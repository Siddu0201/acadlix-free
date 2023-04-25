<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Seeder\SubjectSeeder;
use Yuvayana\Acadlix\Seeder\LanguageSeeder;
use Yuvayana\Acadlix\Seeder\CategorySeeder;

if(!class_exists('Seeder')){
    class Seeder 
    {
        public static function seed()
        {
            $seeder_classes = [
                SubjectSeeder::class,
                LanguageSeeder::class,
                CategorySeeder::class,
            ];

            foreach($seeder_classes as $seeder_class){
                if(method_exists($seeder_class, 'run')){
                    $seeder = new $seeder_class();
                    $seeder->run();
                }
            }
        }
    }
}