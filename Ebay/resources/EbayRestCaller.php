<?php
namespace Ebay\resources;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Interop\Container\ContainerInterface as ContainerInterface;


/**
 * Description of EbayRestCaller
 *
 * @author James McGing <jamesmcging@gmail.com>
 */
class EbayRestCaller {
  
  private $_objContainer = null;
  
  public function __construct(ContainerInterface $objContainer) {
    $this->_objContainer = $objContainer;
  }
  
  public function makeEbayCall(Request $objRequest, Response $objResponse) {
    // Set up the rest caller
    $objEbayRestCaller = new \Ebay\classes\EbayApiGateway($this->_objContainer->objAuthorization);
    $objEbayRestCaller->setRestMethod($objRequest->getQueryParam('setMethod', 'GET'));
    $objEbayRestCaller->setRestApi($objRequest->getQueryParam('setApiName', 'inventory'));
    $objEbayRestCaller->setApiVersion($objRequest->getQueryParam('setApiVersion', 1));
    $objEbayRestCaller->setRestResource($objRequest->getQueryParam('setResource', 'location'));
    $objEbayRestCaller->setResourceId($objRequest->getQueryParam('setResourceId', ''));
    $objEbayRestCaller->setParameters($objRequest->getQueryParam('setApiParams', array()));
        
    // Make the call and return the result
    return $objResponse->withJson($objEbayRestCaller->makeRestCall(), 200);
  }
}
