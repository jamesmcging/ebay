<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \ebay\src\resources as Items;

/**
 * The catalogue service looks after all requests for items. As the catalogue
 * service only supports get requests we can simply redirect any requests to the
 * catalogue service
 */
$app->get('/items', function (Request $objRequest, Response $objResponse) {
  $arrQueryParams = $objRequest->getQueryParams();
  if (count($arrQueryParams)) {
    return $objResponse->withAddedHeader('location', 'http://localhost:8000/index.php/items?'.http_build_query($arrQueryParams));
  } else {
    return $objResponse->withAddedHeader('location', 'http://localhost:8000/index.php/items');    
  }
});
