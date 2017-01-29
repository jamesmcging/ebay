<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;





$app->get('/items', function (Request $request, Response $response) {
  
  
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
