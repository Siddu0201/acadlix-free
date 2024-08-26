<?php

namespace Yuvayana\Acadlix\Helper;

if (!class_exists('Helper')) {
    class Helper
    {
        public function renderShortCode($data)
        {
            return do_shortcode(apply_filters('comment_text', $data));
        }

        public function upload_base64_image_to_wordpress($content)
        {
            $pattern = '/<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/i';

            // Callback function to handle each match
            $callback = function ($matches) {
                // Extract mime type and base64 data from matches
                $mime_type = $matches[1];
                $base64_data = $matches[2];

                // Decode base64 data
                $image_data = base64_decode($base64_data);

                // Create a unique filename
                $filename = uniqid() . '.' . $mime_type;

                // Path to the uploads directory
                $upload_dir = wp_upload_dir();
                $file_path = $upload_dir['path'] . '/' . $filename;

                // Save the image data to a file
                file_put_contents($file_path, $image_data);

                // Prepare file data for WP attachment
                $wp_file_type = wp_check_filetype($filename, null);
                $attachment = array(
                    'guid' => $upload_dir['url'] . '/' . $filename,
                    'post_mime_type' => $wp_file_type['type'],
                    'post_title' => sanitize_file_name($filename),
                    'post_content' => '',
                    'post_status' => 'inherit'
                );

                // // Insert the attachment into the media library
                $attach_id = wp_insert_attachment($attachment, $file_path);

                // // Generate attachment metadata
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                $attach_data = wp_generate_attachment_metadata($attach_id, $file_path);
                wp_update_attachment_metadata($attach_id, $attach_data);

                // Return the URL of the uploaded image
                return "<img src='". $upload_dir['url'] . '/' . $filename. "' alt='". $filename."' />";
            };

            // Perform the replacement
            $new_content = preg_replace_callback($pattern, $callback, $content);

            return $new_content;
        }
    }
}