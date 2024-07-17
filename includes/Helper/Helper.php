<?php

namespace Yuvayana\Acadlix\Helper;

if (!class_exists('Helper')) {
    class Helper
    {
        public function renderShortCode($data)
        {
            return do_shortcode(apply_filters('comment_text', $data));
        }
    }
}