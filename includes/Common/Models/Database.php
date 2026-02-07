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


            // Use WordPress parsed charset & collate (bonus improvement)
            $charset = $wpdb->charset ?: 'utf8mb4';
            $collate = $wpdb->collate ?: 'utf8mb4_unicode_ci';

            // Parse DB_HOST for host, port, socket (WordPress compatible)
            $rawHost = $wpdb->dbhost ?: DB_HOST;
            list($dbHost, $dbPort, $dbSocket) = $this->parseDbHost($rawHost);


            $options = [
                'driver' => 'mysql',
                'host' => $dbHost,
                'database' => DB_NAME,
                'username' => DB_USER,
                'password' => DB_PASSWORD,
                'charset' => $charset,
                'collation' => $collate,
            ];

            // Apply port if available
            if (!empty($dbPort)) {
                $options['port'] = (int) $dbPort;
            }

            // Apply unix socket if available
            if (!empty($dbSocket)) {
                $options['unix_socket'] = $dbSocket;
            }


            // WP Local fallback port (only if no port/socket)
            if (empty($dbPort) && empty($dbSocket) && acadlix()->isDev) {

                $result = $wpdb->get_row("SHOW VARIABLES WHERE Variable_name = 'port'");
                // error_log('Detected MySQL Port: ' . $result->Value);
                if($result->Value){
                    $options['port'] = (int) $result->Value;
                }
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