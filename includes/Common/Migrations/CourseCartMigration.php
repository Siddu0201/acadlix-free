<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('CourseCartMigration')) {
    class CourseCartMigration
    {
        protected $_table_name = 'course_cart';

        public function up()
        {
            if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->bigIncrements('id');
                    $table->string('cart_token')->nullable();
                    $table->bigInteger('course_id')->nullable(); // Index for filtering courses
                    $table->unsignedBigInteger('user_id')->nullable(); // Index for user lookup
                    $table->integer('quantity')->default(1);
                    $table->bigInteger('token_expiry')->nullable()->default(0); // Index for expiring carts
                    $table->timestamps();
                    $table->index('cart_token', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'cart_token'));
                    $table->index('course_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'course_id'));
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
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'cart_token'), 
                'cart_token', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'cart_token'), 
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name),
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'course_id'),
                'course_id',
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'course_id'),
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name),
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_id'),
                'user_id',
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'),
            );
        }
    }
}