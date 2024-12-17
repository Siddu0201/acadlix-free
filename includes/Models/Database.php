<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

defined('ABSPATH') || exit();

if (!class_exists('Database')) {
    class Database
    {
        public function __construct()
        {
            global $wpdb;

            $charset_collate = $wpdb->get_charset_collate();

            $charset = '';
            $collate = '';

            // Extract charset and collate using regular expressions
            if (preg_match('/CHARSET\s+([^\s]+)/i', $charset_collate, $charset_matches)) {
                $charset = $charset_matches[1]; // Get the captured charset
            }

            if (preg_match('/COLLATE\s+([^\s]+)/i', $charset_collate, $collate_matches)) {
                $collate = $collate_matches[1]; // Get the captured collate
            }

            // Fallback defaults if charset or collate not found
            $charset = $charset ?: 'utf8mb4';
            $collate = $collate ?: 'utf8mb4_unicode_ci';
            $capsule = new Capsule;
            $capsule->addConnection([
                'driver' => 'mysql',
                'host' => DB_HOST,
                'database' => DB_NAME,
                'username' => DB_USER,
                'password' => DB_PASSWORD,
                'charset' => $charset,
                'collation' => $collate,
                'prefix' => "{$wpdb->prefix}acadlix_", // prefix to avoid conflict with wordpress tables
            ]);
            $capsule->addConnection([
                'driver' => 'mysql',
                'host' => DB_HOST,
                'database' => DB_NAME,
                'username' => DB_USER,
                'password' => DB_PASSWORD,
                'charset' => $charset,
                'collation' => $collate,
                'prefix' => $wpdb->prefix,
            ], 'wordpress');
            // Set the event dispatcher used by Eloquent models... (optional)
            $capsule->setEventDispatcher(new Dispatcher(new Container));

            // Make this Capsule instance available globally via static methods... (optional)
            $capsule->setAsGlobal();

            // Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
            $capsule->bootEloquent();
        }
    }
}