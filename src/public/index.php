<?php
error_reporting(E_ALL); ini_set('display_errors', 1);

require '../vendor/autoload.php';

use ebay\classes;
use ebay\config;
use ebay\model;
use ebay\interfaces;
use ebay\routes;
use ebay\resources;

$app = new \Slim\App(["settings" => array('displayErrorDetails' => true, 'addContentLengthHeader' => false)]);

$container = $app->getContainer();

$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("../logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};

$container['db'] = function ($c) {
    $sDB    = "mysql:host=" . config\Credentials::DB_HOST . ";dbname=" . config\Credentials::DB_NAME;
    $objPDO = new PDO($sDB, config\Credentials::DB_USER, config\Credentials::DB_PASS);
    $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $objPDO->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $objPDO;
};

require '../routes/homepage.php';
require '../routes/authorization.php';

//require '../routes/items.php';
require '../routes/store.php';
$app->run();