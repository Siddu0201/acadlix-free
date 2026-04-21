<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('QuestionLangMigration')) {
  class QuestionLangMigration
  {
    protected $_table_name = 'question_lang';
    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->foreignId('question_id')->nullable();
          $table->foreign('question_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'question_id'))
            ->references('id')
            ->on(acadlix()->helper()->acadlix_table_prefix('question'))
            ->onDelete('cascade');
          $table->bigInteger('language_id')->nullable();
          $table->boolean('default')->default(0);
          $table->text("question")->nullable();
          $table->text("correct_msg")->nullable();
          $table->text("incorrect_msg")->nullable();
          $table->text("hint_msg")->nullable();
          $table->longText("answer_data")->nullable();
          $table->text("meta")->nullable();
          $table->timestamps();
          $table->index('language_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'language_id'));
        });
      }
    }

    public function down()
    {
      Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
    }

    public function update()
    {
      acadlix()->helper()->acadlix_update_fk(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'question_id'),
        'question_id',
        acadlix()->helper()->acadlix_table_prefix('question'),
        acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'question_id'),
      );
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'language_id'),
        'language_id',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'language_id'),
      );
    }
  }
}