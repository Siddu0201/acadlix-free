<?php

if (!defined('ABSPATH')) exit;


if (has_action('acadlix_all_course_content')) {
    do_action('acadlix_all_course_content');
} else {
    acadlix()->view()->allCourse()->render();
}