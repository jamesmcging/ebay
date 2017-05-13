<?php
error_reporting(E_ALL); ini_set('display_errors', 1);

require '../vendor/autoload.php';

$app = new \Slim\App(["settings" => array('displayErrorDetails' => true, 'addContentLengthHeader' => false)]);

$container = $app->getContainer();

$container['objDB'] = function () {
  return Ebay\model\db::getInstance();
};

$container['objAuthorization'] = function ($container) {
  return new Ebay\classes\EbayAuthorization($container['objDB']);
};

// The following enables CORS
$app->options('/{routes:.+}', function($request, $response, $args) {
  return $response;
});
// The following enables CORS
$app->add(function($request, $response, $next) {
  $response = $next($request, $response);
  return $response
          ->withHeader('Access-Control-Allow-Origin', '*')
          ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
          ->withHeader('Access-Control-Allow-Methods', 'GET');
});

$app->get('/', Ebay\resources\Homepage::class . ':getHomepage');
  
$app->get('/authorization/access', Ebay\resources\Authorization::class . ':getAccess');

//$app->get('/authorization/token', Ebay\resources\Authorization::class . ':getToken');

$app->get('/authorization/status', Ebay\resources\Authorization::class . ':getStatus');

$app->get('/authorization/accept', Ebay\resources\Authorization::class . ':getAccept');

$app->get('/authorization/decline', Ebay\resources\Authorization::class . ':getDecline');


$app->get('/ebay/', Ebay\resources\EbayRestCaller::class . ':makeEbayCall');

$app->run();