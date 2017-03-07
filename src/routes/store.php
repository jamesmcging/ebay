<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use ebay\model\db as db;

$app->get('/store', function (Request $objRequest, Response $objResponse) {
  
  $nSkuCount = 'unknown';
  
  try {
    $sQuery = "SELECT count(*) as skucount FROM product";
    $objStatement = $this->objDB->prepare($sQuery);
    
    if ($objStatement->execute()) {
      $sStatement = $this->objDB->query($sQuery);
      $arrCount = $sStatement->fetch(\PDO::FETCH_ASSOC);
      $nSkuCount = $arrCount['skucount'];
    } else {
      throw new \Exception($sQuery.' failed in execution');
    }
    
  } catch (Exception $objException) {
    $objResponse->getBody()->write(json_encode($objException));
  }
  
  
  $arrData = array(
    'nStoreSkuCount' => $nSkuCount
  );
  
  return $objResponse->withJson($arrData, 200);

});
