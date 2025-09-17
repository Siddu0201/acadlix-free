<?php

define('ACADLIX_TEXT_DOMAIN', 'acadlix');

define('ACADLIX_SLUG', 'acadlix');
// Plugin paths and urls
define('ACADLIX_PLUGIN_DIR', plugin_dir_path(ACADLIX_PLUGIN_FILE));
define( 'ACADLIX_PLUGIN_BASENAME', plugin_basename( ACADLIX_PLUGIN_FILE ) );
define( 'ACADLIX_PLUGIN_FOLDER_NAME', str_replace( array( '/', basename( ACADLIX_PLUGIN_FILE ) ), '', ACADLIX_PLUGIN_BASENAME ) );
define('ACADLIX_INCLUDES_PATH', ACADLIX_PLUGIN_DIR . 'includes/');
define('ACADLIX_TEMPLATE_PATH', ACADLIX_PLUGIN_DIR . 'templates/');
define('ACADLIX_PLUGIN_URL', trailingslashit(plugins_url('', ACADLIX_PLUGIN_FILE)));
define('ACADLIX_BUILD_URL', ACADLIX_PLUGIN_URL . 'build/');
define('ACADLIX_BUILD_PATH', ACADLIX_PLUGIN_DIR . 'build/');
define('ACADLIX_ASSETS_CSS_URL', ACADLIX_PLUGIN_URL . 'assets/css/');
define('ACADLIX_ASSETS_JS_URL', ACADLIX_PLUGIN_URL . 'assets/js/');
define('ACADLIX_ASSETS_IMAGE_URL', ACADLIX_PLUGIN_URL . 'assets/image/');

// Custom post type constant
const ACADLIX_COURSE_CPT = 'acadlix_course';
const ACADLIX_COURSE_CATEGORY_TAXONOMY = 'acadlix_course_category';
const ACADLIX_COURSE_TAG_TAXONOMY = 'acadlix_course_tag';

const ACADLIX_COURSE_SECTION_CPT = 'acadlix_csection';
const ACADLIX_COURSE_SECTION_CONTENT_CPT = 'acadlix_cs_content';

const ACADLIX_QUIZ_CPT = 'acadlix_quiz';
const ACADLIX_QUIZ_CATEGORY_TAXONOMY = 'acadlix_quiz_category';
const ACADLIX_QUIZ_LANGUAGE_TAXONOMY = 'acadlix_quiz_language';

const ACADLIX_LESSON_CPT = 'acadlix_lesson';