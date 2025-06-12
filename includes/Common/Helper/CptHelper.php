<?php

namespace Yuvayana\Acadlix\Common\Helper;

if (!class_exists('CptHelper')) {
    class CptHelper
    {
        protected static $_instance = null;

        public function acadlix_add_prefix_meta_keys(array $data, string $cpt = '')
        {
            if (empty($data)) {
                return $data;
            }

            // Validate the data array
            if (!is_array($data)) {
                return new WP_Error(
                    'invalid_data',
                    __('The data must be a non-empty associative array.', 'acadlix')
                );
            }

            $prefixedData = [];

            // Loop through the data and prefix keys
            foreach ($data as $key => $value) {
                if (!is_string($key)) {
                    return new WP_Error(
                        'invalid_key',
                        __('All keys in the data array must be non-empty strings.', 'acadlix')
                    );
                }
                if(is_null($value)){
                    continue;
                }

                // Prefix the key with the desired format (if CPT is provided)
                $prefixedKey = !empty($cpt) ? "_acadlix_{$cpt}_{$key}" : "_acadlix_{$key}";
                $prefixedData[$prefixedKey] = $value;
            }

            return $prefixedData;
        }

        public function acadlix_remome_prefix_meta_keys(array $data, string $cpt = '')
        {
            if (empty($data)) {
                return $data;
            }

            // Validate the data array
            if (!is_array($data)) {
                return new WP_Error(
                    'invalid_data',
                    __('The data must be a non-empty associative array.', 'acadlix')
                );
            }

            $unprefixedData = [];
            $prefix = !empty($cpt) ? "_acadlix_{$cpt}_" : "_acadlix_";
            // Loop through the data and prefix keys
            foreach ($data as $key => $value) {
                if (!is_string($key)) {
                    return new WP_Error(
                        'invalid_key',
                        __('All keys in the data array must be non-empty strings.', 'acadlix')
                    );
                }
                $newKey = strpos($key, $prefix) === 0 ? substr($key, strlen($prefix)) : $key;
                
                // Add the value with the updated key to the result
                $unprefixedData[$newKey] = $value;
            }
            return $unprefixedData;
        }

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }
    }
}