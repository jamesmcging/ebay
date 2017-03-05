<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use ebay\model\db as db;

$app->get('/store', function (Request $objRequest, Response $objResponse) {
  
  $nSkuCount = 'unknown';
  
  $objDB = db::getInstance();
  
  $sQuery = "SELECT count(*) as skucount FROM product";

  try {
    
    $sStatement = $objDB->query($sQuery);
    
    $arrCount = $sStatement->fetch(\PDO::FETCH_ASSOC);

    $nSkuCount = $arrCount['skucount'];
    
  } catch (Exception $objException) {
    $objResponse->getBody()->write(json_encode($objException));
  }
  
  
  $arrData = array(
    'nStoreSkuCount' => $nSkuCount
  );
  
  return $objResponse->withJson($arrData, 200);

});
