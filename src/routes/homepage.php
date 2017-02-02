<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/', function (Request $request, Response $response) {
  
    $sHTML = "<a href='/authorization/requestaccess'>Get ebay oauth token</a>";
  
    $response->getBody()->write($sHTML);

    return $response;
});