<?php

defined('ABSPATH') || exit();


if (has_action('acadlix_single_course_content')) {
  do_action('acadlix_single_course_content');
} else {
  acadlix()->view()->singleCourse()->render();
}