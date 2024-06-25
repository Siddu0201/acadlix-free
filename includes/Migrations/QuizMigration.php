<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('QuizMigration')){
    class QuizMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz')){
                Manager::schema()->create('quiz', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('category_id')->nullable()->constrained('category')->nullOnDelete();
                    $table->string('title');
                    $table->longText('description');
                    // Mode setting
                    $table->string('mode')->nullable()->default('normal')->comment('normal/check_and_continue/question_below_each_other/advance_mode');
                    $table->boolean('enable_back_button')->default(0);
                    $table->boolean('enable_check_button')->default(0);
                    $table->boolean('enable_check_on_option_selected')->default(0);
                    $table->integer('question_per_page')->unsigned()->default(10);
                    $table->string('advance_mode_type')->nullable()->default('advance_panel')->comment('advance_panel/ibps/ssc/gate/sbi/jee/railway');
                    // General settings
                    $table->boolean('hide_quiz_title')->default(0);
                    $table->boolean('hide_restart_button')->default(0);
                    $table->boolean('show_clear_response_button')->default(0);
                    $table->string('quiz_timing_type')->nullable()->default('full_quiz_time')->comment('full_quiz_time/per_question_time');
                    $table->integer('quiz_time')->unsigned()->default(0)->comment('0 => Infinity (no limit)');
                    $table->boolean('pause_quiz')->default(0);
                    $table->boolean('set_start_date')->default(0);
                    $table->string('start_date')->nullable();
                    $table->boolean('set_end_date')->default(0);
                    $table->string('end_date')->nullable();
                    $table->boolean('prerequisite')->default(0);
                    $table->boolean('enable_login_register')->default(0);
                    $table->string('login_register_type')->nullable()->default('at_start_of_quiz')->comment('at_start_of_quiz/at_finish_of_quiz');
                    $table->integer('per_user_allowed_attempt')->unsigned()->default(0)->comment('0 => Infinity (no limit)');
                    $table->boolean('save_statistic')->default(0);
                    $table->integer('statistic_ip_lock')->default(0);
                    $table->integer('save_statistic_number_of_times')->unsigned()->default(0)->comment('0 => Infinity (no limit)');
                    $table->boolean('on_screen_calculator')->default(0);
                    $table->boolean('quiz_certificate')->default(0);
                    $table->boolean('resume_unfinished_quiz')->default(0);
                    $table->boolean('show_only_specific_number_of_questions')->default(0);
                    $table->integer('specific_number_of_questions')->unsigned()->default(0)->comment('0 => all');
                    $table->boolean('rate_quiz')->default(0);
                    $table->boolean('quiz_feedback')->default(0);
                    $table->boolean('proctoring')->default(0);
                    $table->integer('proctoring_max_number_of_time_allowed')->unsigned()->default(3)->comment('min 1');
                    // Question settings
                    $table->boolean('show_marks')->default(0);
                    $table->boolean('display_subject')->default(0);
                    $table->boolean('skip_question')->default(0);
                    $table->boolean('answer_bullet')->default(0);
                    $table->string('answer_bullet_type')->nullable()->default('numeric')->comment('numeric/alphabet ');
                    $table->boolean('random_question')->default(0);
                    $table->boolean('random_option')->default(0);
                    $table->boolean('do_not_randomize_last_option')->default(0);
                    $table->boolean('question_overview')->default(0);
                    $table->boolean('hide_question_numbering')->default(0);
                    $table->boolean('sort_by_subject')->default(0);
                    $table->boolean('attempt_and_move_forward')->default(0);
                    $table->boolean('force_user_to_answer_each_question')->default(0);
                    // Result settings
                    $table->boolean('hide_result')->default(0);
                    $table->boolean('hide_negative_marks')->default(0);
                    $table->boolean('hide_quiz_time')->default(0);
                    $table->boolean('show_speed')->default(0);
                    $table->boolean('show_percentile')->default(0);
                    $table->boolean('show_accuracy')->default(0);
                    $table->boolean('show_average_score')->default(0);
                    $table->boolean('show_subject_wise_analysis')->default(0);
                    $table->boolean('show_marks_distribution')->default(0);
                    $table->boolean('show_status_based_on_min_percent')->default(0);
                    $table->integer('minimum_percent_to_pass')->unsigned()->default(0)->comment('above 0 => pass');
                    $table->boolean('hide_answer_sheet')->default(0);
                    $table->boolean('show_per_question_time')->default(0);
                    $table->boolean('was_the_solution_helpful')->default(0);
                    $table->boolean('bookmark')->default(0);
                    $table->boolean('report_question_answer')->default(0);
                    $table->boolean('leaderboard')->default(0);
                    $table->boolean('show_rank')->default(0);
                    $table->boolean('result_comparision_with_topper')->default(0);
                    $table->integer('leaderboard_total_number_of_entries')->unsigned()->default(10)->comment('0 => all');
                    $table->boolean('leaderboard_user_can_apply_multiple_times')->default(0);
                    $table->integer('leaderboard_apply_multiple_number_of_times')->unsigned()->default(0)->comment('0 => infinity');
                    $table->string('display_leaderboard_in_quiz_result')->nullable()->default('do_not_display')->comment('do_not_display/below_the_result/in_the_button');
                    $table->boolean('percent_based_result_text')->default(0);
                    $table->mediumText('result_text');
                    // Notification settings
                    $table->boolean('admin_email_notification')->default(0);
                    $table->string('admin_to');
                    $table->string('admin_from');
                    $table->string('admin_subject');
                    $table->mediumText('admin_message');
                    $table->boolean('student_email_notification')->default(0);
                    $table->string('student_to');
                    $table->string('student_from');
                    $table->string('student_subject');
                    $table->mediumText('student_message');
                    $table->boolean('instructor_email_notification')->default(0);
                    $table->string('instructor_to');
                    $table->string('instructor_from');
                    $table->string('instructor_subject');
                    $table->mediumText('instructor_message');
                    // Language setting
                    $table->boolean('multi_language')->default(false);
                    // Instruction setting
                    $table->longText('instruction1');
                    $table->longText('instruction2');                    
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('quiz');
        }

        public function update()
        {
            if(!Manager::schema()->hasColumn('quiz', 'statistic_ip_lock')){
                Manager::schema()->table('quiz', function($table){
                    $table->after('save_statistic', function($table){
                        $table->integer('statistic_ip_lock')->default(0);
                    });
                });
            }

            if(Manager::schema()->hasColumn('quiz', 'result_comparision_with_top_five_student')){
                Manager::schema()->table('quiz', function($table){
                    $table->renameColumn('result_comparision_with_top_five_student', 'result_comparision_with_topper');
                });
            }

            if(Manager::schema()->hasColumn('quiz', 'description')){
                Manager::schema()->table('quiz', function($table){
                    $table->longText('description')->change();
                });
            }
        }
    }
}