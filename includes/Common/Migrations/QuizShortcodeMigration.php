<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuizShortcodeMigration')){
    class QuizShortcodeMigration
    {
        protected $_table_name = 'quiz_shortcode';
        public function up()
        {
            if(!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))){
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
                    $table->index('quiz_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id'));
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
        }

        public function update()
        {
            acadlix()->helper()->acadlix_update_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'quiz_id'), 
                'quiz_id', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id'), 
            );
        }
    }
}