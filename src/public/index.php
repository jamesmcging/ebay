<?php
error_reporting(E_ALL); ini_set('display_errors', 1);



echo "<pre>";
print_r($_SERVER);
echo "</pre>";
die();

$dbhost = $_SERVER['RDS_HOSTNAME'];
$dbport = $_SERVER['RDS_PORT'];
$dbname = $_SERVER['RDS_DB_NAME'];
$charset = 'utf8' ;

$dsn = "mysql:host={$dbhost};port={$dbport};dbname={$dbname};charset={$charset}";
$username = $_SERVER['RDS_USERNAME'];
$password = $_SERVER['RDS_PASSWORD'];

$objPDO = new \PDO($dsn, $username, $password);

$objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$objPDO->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
$stmt = $objPDO->query('SELECT count(*) FROM product');
while ($row = $stmt->fetch())
{
    echo $row['name'] . "\n";
}
die('product count: '.$nSkuCount);










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