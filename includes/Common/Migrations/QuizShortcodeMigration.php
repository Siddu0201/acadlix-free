<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuizShortcodeMigration')){
    class QuizShortcodeMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_quiz_shortcode')){
                Manager::schema()->create('acadlix_quiz_shortcode', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable()->index();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_quiz_shortcode');
        }
    }
}