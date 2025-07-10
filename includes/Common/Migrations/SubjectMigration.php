<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('SubjectMigration')){
    class SubjectMigration
    {
        protected $_table_name = 'subject';
        public function up()
        {
            if(!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))){
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function($table){
                    $table->bigIncrements('id');
                    $table->string("subject_name");
                    $table->boolean('default')->default(false);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
        }
    }
}