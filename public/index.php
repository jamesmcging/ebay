<?php

error_reporting(E_ALL); ini_set('display_errors', 1);
require '../vendor/autoload.php';

spl_autoload_register(function($sClassName){
  require ("../src/model/$sClassName.php");
});

spl_autoload_register(function($sClassName){
  require ("../src/resource/$sClassName.php");
});

require '../src/config/Credentials.php';

$app = new \Slim\App;
require '../src/routes/homepage.php';
require '../src/routes/items.php';
require '../src/routes/authorization.php';
$app->run();