<?php

namespace Ebay\resources;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Interop\Container\ContainerInterface as ContainerInterface;
use Ebay\classes\EbayAuthorization as EbayAuthorization;

/**
 * Description of Authorization
 *
 * @author James McGing <jamesmcging@gmail.com>
 */
class Authorization {

  protected $_objContainer = null;

  // constructor receives container instance
  public function __construct(ContainerInterface $objContainer) {
    $this->_objContainer = $objContainer;
  }
  
  public function getAccess(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>Request Token Page</h1>';
    $sHTML .= '<p>requesting token from ebay</p>';
    $sSigninURL = $this->_objContainer->objAuthorization->requestSigninURL();
    
    return $objResponse->withStatus(302)->withHeader('Location', $sSigninURL);
  }
  
//  public function getToken(Request $objRequest, Response $objResponse) { 
//    $arrUserToken = array('token' => $this->_objAuthorization->getAccessToken());
//    return $objResponse->withJson($arrUserToken, 200);
//  }
  
  public function getStatus(Request $objRequest, Response $objResponse) {
    $arrStatus = array(
      'ebay_authorization_status' => $this->_objContainer->objAuthorization->getStatus(),
      'renewresponse'             => $this->_objContainer->objAuthorization->sRenewTokenResponse
    );
    
    return $objResponse->withJson($arrStatus, 200);
  }
  
  public function getAccept(Request $objRequest, Response $objResponse) {
    $this->_objContainer->objAuthorization->setAccessToken($objRequest->getQueryParams());
    
    // At this stage we should have a token we can use for eBay API calls so we
    // redirect the user back to the app
    if (isset($_SERVER['EBAY_ENVIRONMENT']) && $_SERVER['EBAY_ENVIRONMENT'] == \Ebay\interfaces\EnvironmentInterface::DEV_MODE) {
      $sHomeURL = \Ebay\interfaces\URLInterface::DEV_MAIN_URL;
    } else {
      $sHomeURL = \Ebay\interfaces\URLInterface::LIVE_MAIN_URL;
    }
    
    return $objResponse->withStatus(302)->withHeader('Location', $sHomeURL);
  }
  
  public function getDecline(Request $objRequest, Response $objResponse) {
    $sHTML = '<h1>You have declined to give the app access to your eBay account.</h1>';
    $sHTML .= '<p>Without permission to use your eBay account the app will be limited to showing you what is in your local store catalogue. If you want to use the app to push items to eBay you will need to use the credentials panel and grant the app permissions.</p>';
    
    if (isset($_SERVER['EBAY_ENVIRONMENT']) && $_SERVER['EBAY_ENVIRONMENT'] == \Ebay\interfaces\EnvironmentInterface::DEV_MODE) {
      $sHomeURL = \Ebay\interfaces\URLInterface::DEV_MAIN_URL;
    } else {
      $sHomeURL = \Ebay\interfaces\URLInterface::LIVE_MAIN_URL;
    }
    $sHTML .= '<a href="'.$sHomeURL.'">Back to the app</a>';
    
    return $objResponse->getBody()->write($sHTML);
  }
}
