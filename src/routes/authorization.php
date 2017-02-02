<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->group('/authorization', function() {
  
  $this->get('/requestaccess', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Request Token Page</h1>';
    $sHTML .= '<p>requesting token from ebay</p>';
    
    $objEbayAuthorizer = new EbayAuthorization();
    $sSigninURL = $objEbayAuthorizer->requestSigninURL();
    
    return $objResponse->withStatus(302)->withHeader('Location', $sSigninURL);
  });
  
  $this->any('/accept', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Accept Page</h1>';
    $sHTML .= print_r($_REQUEST);
    $objResponse->getBody()->write($sHTML);
  });
  
  $this->any('/decline', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Decline Page</h1>';
    $sHTML .= print_r($_REQUEST);
    $objResponse->getBody()->write($sHTML);
  });
  
  $this->any('/', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Neither accept nor decline</h1>';
    $sHTML .= print_r($_REQUEST);
    $objResponse->getBody()->write($sHTML);
  });
  
});
