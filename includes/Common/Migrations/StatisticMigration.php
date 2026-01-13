<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('StatisticMigration')){
    class StatisticMigration
    {
        protected $_table_name = 'statistic';
        public function up()
        {
            if(!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))){
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('statistic_ref_id')->nullable();
                    $table->foreign('statistic_ref_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'sr_id'))
                        ->references('id')
                        ->on(acadlix()->helper()->acadlix_table_prefix('statistic_ref'))
                        ->cascadeOnDelete();
                    $table->foreignId('question_id')->nullable();
                    $table->foreign('question_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'question_id'))
                        ->references('id')
                        ->on(acadlix()->helper()->acadlix_table_prefix('question'))
                        ->cascadeOnDelete();
                    $table->boolean('correct_count');
                    $table->boolean('incorrect_count');
                    $table->boolean('hint_count');
                    $table->boolean('solved_count');
                    $table->float('points')->nullable();
                    $table->float('negative_points')->nullable();
                    $table->integer("question_time")->nullable();
                    $table->text("answer_data")->nullable();
                    $table->unsignedBigInteger('attempted_at')->nullable();
                    $table->boolean('is_evaluated')->default(1);
                    $table->string('evaluated_by')->nullable();
                    $table->unsignedBigInteger('evaluated_id')->nullable();
                    $table->text('evaluation_remark')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
        }

        public function update()
        {
            // Add in db version 11
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'is_evaluated')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->boolean('is_evaluated')->default(1)->after('attempted_at');
                });
            }

            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'evaluated_by')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->string('evaluated_by')->nullable()->after('is_evaluated');
                });
            }
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'evaluated_id')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->unsignedBigInteger('evaluated_id')->nullable()->after('evaluated_by');
                });
            }
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'evaluation_remark')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->text('evaluation_remark')->nullable()->after('evaluated_id');
                });
            }

            // Added in db version 3
            if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'attempted_at')) {
                Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->unsignedBigInteger('attempted_at')->nullable()->after('answer_data');
                });
            }

            acadlix()->helper()->acadlix_update_fk(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'statistic_ref_id'), 
                'statistic_ref_id', 
                acadlix()->helper()->acadlix_table_prefix('statistic_ref'),
                acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'sr_id'), 
            );
            acadlix()->helper()->acadlix_update_fk(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'question_id'), 
                'question_id', 
                acadlix()->helper()->acadlix_table_prefix('question'),
                acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'question_id'), 
            );

        }
    }
}