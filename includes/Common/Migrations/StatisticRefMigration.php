<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('StatisticRefMigration')) {
  class StatisticRefMigration
  {
    protected $_table_name = 'statistic_ref';
    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->bigInteger('quiz_id')->nullable();
          $table->string('user_token')->nullable();
          $table->unsignedBigInteger('user_id')->nullable();
          $table->float('points')->nullable();
          $table->float('result')->nullable();
          $table->integer("quiz_time")->nullable();
          $table->float('accuracy')->nullable();
          $table->string('status', 100)->nullable();
          $table->timestamps();
          $table->index('quiz_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id'));
          $table->index('user_token', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_token'));
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
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'quiz_id'),
        'quiz_id',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id'),
      );
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_token'),
        'user_token',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_token'),
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