<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Database')){
    class Database 
    {
        public function __construct() 
        {
            global $wpdb;
            $capsule = new Capsule;
            $capsule->addConnection([
                'driver' => 'mysql',
                'host' => DB_HOST,
                'database' => DB_NAME,
                'username' => DB_USER,
                'password' => DB_PASSWORD,
                'charset' => DB_CHARSET,
                'prefix' => $wpdb->prefix.'acadlix_',
            ]);
            $capsule->addConnection([
                'driver' => 'mysql',
                'host' => DB_HOST,
                'database' => DB_NAME,
                'username' => DB_USER,
                'password' => DB_PASSWORD,
                'charset' => DB_CHARSET,
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