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

$container['logger'] = function() {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("../logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};

$container['objDB'] = function () {
  return model\db::getInstance();
};

require '../routes/ebay_api.php';
require '../routes/homepage.php';
require '../routes/authorization.php';

require '../routes/items.php';
require '../routes/store.php';
$app->run();