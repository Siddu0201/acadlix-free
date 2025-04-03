<?php

// if (file_exists(__DIR__ . '/vendor/autoload.php')) {
//     require_once __DIR__ . '/vendor/autoload.php';
// }

// function acadlix_load_all_classes() {
//     $classMap = require __DIR__ . '/vendor/composer/autoload_classmap.php';

//     foreach ($classMap as $class => $file) {
//         if (strpos($class, 'Yuvayana\\Acadlix\\') === 0 && !class_exists($class)) {
//             require_once $file;
//         }
//     }
// }

// acadlix_load_all_classes();

use Yuvayana\Acadlix\Models\Database;

new Database();
