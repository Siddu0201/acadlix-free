<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('TemplateMigration')) {
  class TemplateMigration
  {
    protected $_table_name = 'template';
    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->string("name")->nullable();
          $table->string('type')->default("quiz");
          $table->longText('data')->nullable();
          $table->timestamps();
          $table->index('type', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'type'));
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
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'type'),
        'type',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'type'),
      );
    }
  }
}