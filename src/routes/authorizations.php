<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/authorization', function (Request $request, Response $response) {

  
//
  echo "<pre>";
  var_dump($request);
  echo "</pre>";
  echo "<hr>";
//  
 
    $response->getBody()->write("I am redirected from eBay");

    return $response;
});
