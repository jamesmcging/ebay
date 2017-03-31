<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->group('/ebay', function() {
  
  $this->get('/', function(Request $objRequest, Response $objResponse) {
    // The Rest caller needs the authorisation credentials
    $objEbayAuthorization = new \ebay\classes\EbayAuthorization($this->objDB);
    
    // Set up the rest caller
    $objEbayRestCaller = new \ebay\classes\EbayApiGateway($objEbayAuthorization);
    $objEbayRestCaller->setRestMethod($objRequest->getQueryParam('setMethod', 'GET'));
    $objEbayRestCaller->setRestApi($objRequest->getQueryParam('setApiName', 'inventory'));
    $objEbayRestCaller->setApiVersion($objRequest->getQueryParam('setApiVersion', 1));
    $objEbayRestCaller->setRestResource($objRequest->getQueryParam('setResource', 'location'));
    $objEbayRestCaller->setResourceId($objRequest->getQueryParam('setResourceId', ''));
    $objEbayRestCaller->setParameters($objRequest->getQueryParam('setApiParams', array()));
        
    // Make the call and return the result
    return $objResponse->withJson($objEbayRestCaller->makeRestCall(), 200);
  }); 
  
});
