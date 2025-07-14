<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists(('CourseStatisticMigration'))) {
    class CourseStatisticMigration
    {
        protected $_table_name = 'course_statistics';
        public function up()
        {
            if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->bigIncrements('id');
                    $table->foreignId('order_item_id')->nullable();
                    $table->foreign('order_item_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'oi_id'))
                        ->references('id')
                        ->on(acadlix()->helper()->acadlix_table_prefix('order_items'))
                        ->onDelete('cascade');
                    $table->bigInteger('course_section_content_id')->nullable();
                    $table->integer('user_id')->unsigned()->nullable()->default(0);
                    $table->boolean('is_active')->nullable()->default(false); 
                    $table->boolean('is_completed')->nullable()->default(false); 
                    $table->string('meta_type')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();
                    $table->index('course_section_content_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'csc_id'));
                    $table->index('user_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'));
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
        }

        public function update()
        {
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'meta_type')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->string('meta_type')->nullable();
                });
            }
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'meta_value')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->longText('meta_value')->nullable();
                });
            }          

            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'created_at')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->timestamp('created_at')->nullable()->default(Manager::raw('CURRENT_TIMESTAMP'));
                });
            }
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'updated_at')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->timestamp('updated_at')->nullable()->default(Manager::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
                });
            } 

            acadlix()->helper()->acadlix_update_fk(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'order_item_id'), 
                'order_item_id', 
                acadlix()->helper()->acadlix_table_prefix('order_items'),
                acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'oi_id'), 
            );
            
            acadlix()->helper()->acadlix_update_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'course_section_content_id'), 
                'course_section_content_id', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'csc_id'), 
            );
            acadlix()->helper()->acadlix_update_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_id'), 
                'user_id', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'), 
            );
        }
    }
}