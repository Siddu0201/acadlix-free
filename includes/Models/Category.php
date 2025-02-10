<?php

namespace Yuvayana\Acadlix\Models;

defined('ABSPATH') || exit();

if (!class_exists('Category')) {
    class Category
    {

        protected $taxonomy = ACADLIX_QUIZ_CATEGORY_TAXONOMY; // Replace with your taxonomy slug
        protected static $instance = null;

        /**
         * Singleton instance.
         *
         * @return self
         */
        public static function instance()
        {
            if (is_null(static::$instance)) {
                static::$instance = new static();
            }
            return static::$instance;
        }

        /**
         * Find a term by ID.
         *
         * @param int $id
         * @return array|null
         */
        public static function find($id)
        {
            $instance = static::instance();
            $term = get_term($id, $instance->taxonomy);

            $default = (int) get_option( 'default_term_' . $instance->taxonomy );

            if (!is_wp_error($term) && $term) {
                return [
                    'term_id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'default' => $term->term_id === $default
                ];
            }

            return null;
        }

        /**
         * Get all terms in the taxonomy.
         *
         * @return array
         */
        public static function all()
        {
            $instance = static::instance();
            $terms = get_terms([
                'taxonomy' => $instance->taxonomy,
                'hide_empty' => false,
            ]);
            return array_map(function ($term) {
                return static::find($term->term_id);
            }, $terms);
        }

        /**
         * Create a new term.
         *
         * @param array $attributes
         * @return self|null
         */
        public static function create(array $attributes)
        {
            $instance = static::instance();

            $args = [
                'slug' => sanitize_title($attributes['category_name']),
            ];

            $term = wp_insert_term($attributes['category_name'], $instance->taxonomy, $args);

            if (!is_wp_error($term)) {
                $term_id = $term['term_id'];
                return static::find($term_id);
            }

            return $term;
        }

        /**
         * Update a term.
         *
         * @param int $id
         * @param array $attributes
         * @return self|null
         */
        public static function update($id, array $attributes)
        {
            $instance = static::instance();

            $args = [];
            if (isset($attributes['category_name'])) {
                $args['name'] = $attributes['category_name'];
            }

            $term = wp_update_term($id, $instance->taxonomy, $args);

            if (!is_wp_error($term)) {
                return static::find($id);
            }

            return $term;
        }

        /**
         * Delete a term.
         *
         * @param int $id
         * @return bool
         */
        public static function delete($id)
        {
            $result = wp_delete_term($id, static::instance()->taxonomy);
            return !is_wp_error($result);
        }

        public static function get_quiz_category($quiz_id)
        {
            if(empty($quiz_id)){
                return null;
            }

            $instance = static::instance();
            $terms = get_the_terms($quiz_id, $instance->taxonomy);
            if($terms){
                return self::find($terms[0]->term_id);
            }
            return null;

        }


    }
}