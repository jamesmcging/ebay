<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \ebay\src\resources as Items;


$app->get('/items', function (Request $objRequest, Response $objResponse) {
  
  $objItems = new Items($objRequest, $objResponse);
  $objItems->get();
  
  
  $arrFields = array();
  $sSelectStatement = join(', ', $arrFields);
  
  $objDB = DB::getInstance();
  
  $sQuery = "SELECT product_id, product_name FROM product";

  try {
    
    $sStatement = $objDB->query($sQuery);
    
    $arrItems = $sStatement->fetchAll(PDO::FETCH_OBJ);
    
    $response->getBody()->write(json_encode($arrItems));
    
  } catch (Exception $objException) {
    $response->getBody()->write(json_encode($objException));
  }
  
//
//  echo "<pre>";
//  var_dump($request);
//  echo "</pre>";
//  echo "<hr>";
//  
 
    $response->getBody()->write("item resource");

    return $response;
});
