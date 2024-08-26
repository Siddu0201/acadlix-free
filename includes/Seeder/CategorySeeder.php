<?php

namespace Yuvayana\Acadlix\Seeder;

use Yuvayana\Acadlix\Models\Category;

defined( 'ABSPATH' ) || exit();

if(!class_exists('CategorySeeder')){
    class CategorySeeder 
    {
        public function run()
        {
            $category_name = "Uncategorized";
            $category = Category::where("category_name", $category_name)->first();
            if(!$category){
                Category::create(["category_name" => $category_name]);
            }
        }
    }
}