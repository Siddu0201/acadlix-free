<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Yuvayana\Acadlix\Common\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists('Database')) {
    class Database
    {
        protected $bootedPrefix = null;
        public function __construct()
        {
            $this->boot();
        }

        private function parseDbHost($host)
        {
            $port = null;
            $socket = null;

            if (strpos($host, ':') !== false) {
                [$host, $extra] = explode(':', $host, 2);

                if (is_numeric($extra)) {
                    $port = (int) $extra;
                } else {
                    $socket = $extra;
                }
            }

            return [$host, $port, $socket];
        }

        public function boot()
        {
            global $wpdb;

            if ($this->bootedPrefix === $wpdb->prefix) {
                return;
            }

            // $charset_collate = $wpdb->get_charset_collate();

            // $charset = '';
            // $collate = '';

            // // Extract charset and collate using regular expressions
            // if (preg_match('/CHARSET\s+([^\s]+)/i', $charset_collate, $charset_matches)) {
            //     $charset = $charset_matches[1]; // Get the captured charset
            // }

            // if (preg_match('/COLLATE\s+([^\s]+)/i', $charset_collate, $collate_matches)) {
            //     $collate = $collate_matches[1]; // Get the captured collate
            // }

            // // Fallback defaults if charset or collate not found
            // $charset = $charset ?: 'utf8mb4';
            // $collate = $collate ?: 'utf8mb4_unicode_ci';

            // Use WordPress parsed charset & collate (bonus improvement)
            $charset = $wpdb->charset ?: 'utf8mb4';
            $collate = $wpdb->collate ?: 'utf8mb4_unicode_ci';

            // Parse DB_HOST for host, port, socket (WordPress compatible)
            $rawHost = $wpdb->dbhost ?: DB_HOST;
            list($dbHost, $dbPort, $dbSocket) = $this->parseDbHost($rawHost);

            // Detect WP Local
            $isWpLocal = strpos(ABSPATH, 'Local Sites') !== false;

            // Convert localhost to 127.0.0.1 ONLY on non-local environments
            // if ($dbHost === 'localhost' && !$isWpLocal) {
            //     $dbHost = '127.0.0.1';
            // }

            $options = [
                'driver' => 'mysql',
                'host' => $dbHost,
                'database' => DB_NAME,
                'username' => DB_USER,
                'password' => DB_PASSWORD,
                'charset' => $charset,
                'collation' => $collate,
            ];

            // if (acadlix()->isDev) {
            //     $options['port'] = 10011;
            // }

            // Apply port if available
            if (!empty($dbPort)) {
                $options['port'] = (int) $dbPort;
            }

            // Apply unix socket if available
            if (!empty($dbSocket)) {
                $options['unix_socket'] = $dbSocket;
            }

            // WP Local fallback port (only if no port/socket)
            if (empty($dbPort) && empty($dbSocket) && $isWpLocal) {
                $options['port'] = 10011;
            }


            $capsule = new Capsule;
            $capsule->addConnection($options);

            // $timezone_string = Helper::instance()->acadlix_get_time_zone_string();
            // if (!empty($timezone_string)) {
            //     date_default_timezone_set($timezone_string);
            // }

            // Set the event dispatcher used by Eloquent models... (optional)
            $capsule->setEventDispatcher(new Dispatcher(new Container));

            // Make this Capsule instance available globally via static methods... (optional)
            $capsule->setAsGlobal();

            // Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
            $capsule->bootEloquent();

            $this->bootedPrefix = $wpdb->prefix;
        }
    }
}