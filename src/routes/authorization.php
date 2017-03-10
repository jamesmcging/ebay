<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->group('/authorization', function() {
  
  $this->get('/access', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Request Token Page</h1>';
    $sHTML .= '<p>requesting token from ebay</p>';
    $objEbayAuthorization = new \ebay\classes\EbayAuthorization($this->objDB);
    $sSigninURL = $objEbayAuthorization->requestSigninURL();
    return $objResponse->withStatus(302)->withHeader('Location', $sSigninURL);
  });
  
  $this->get('/token', function(Request $objRequest, Response $objResponse) {
    $objEbayAuthorization = new \ebay\classes\EbayAuthorization($this->objDB);  
    $arrUserToken = array('token' => $objEbayAuthorization->getAccessToken());
    return $objResponse->withJson($arrUserToken, 200);
  });
  
  $this->get('/status', function(Request $objRequest, Response $objResponse) {
    $objEbayAuthorization = new \ebay\classes\EbayAuthorization($this->objDB);
    $arrStatus = array('ebay_authorization_status' => $objEbayAuthorization->getStatus());
    return $objResponse->withJson($arrStatus, 200);
  });
  
  $this->get('/accept', function(Request $objRequest, Response $objResponse) {
    $objEbayAuthorization = new \ebay\classes\EbayAuthorization($this->objDB);
    
    $objEbayAuthorization->setAccessToken($objRequest->getQueryParams());
    
    // At this stage we should have a token we can use for eBay API calls so we
    // redirect the user back to the app
    return $objResponse->withStatus(302)->withHeader('Location', '/');
  });
  
  $this->any('/decline', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Decline Page</h1>';
    $sHTML .= '<pre>';
    $sHTML .= print_r($_REQUEST);
    $sHTML .= '<pre>';
    $objResponse->getBody()->write($sHTML);
  });
  
  $this->any('/', function(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Neither accept nor decline</h1>';
    $sHTML .= '<pre>';
    $sHTML .= print_r($_REQUEST);
    $sHTML .= '</pre>';
    $objResponse->getBody()->write($sHTML);
  });
  
});
