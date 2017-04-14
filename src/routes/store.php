<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/store/storedata', function (Request $objRequest, Response $objResponse) {

  $arrData = array();

  try {
    $sQuery = "SELECT count(*) as skucount FROM product";
    $objStatement = $this->objDB->prepare($sQuery);

    if ($objStatement->execute()) {
      $sStatement = $this->objDB->query($sQuery);
      $arrCount = $sStatement->fetch(\PDO::FETCH_ASSOC);
      $arrData['nStoreSkuCount'] = $arrCount['skucount'];
    } else {
      throw new \Exception($sQuery.' failed in execution');
    }

    $sQuery = "SELECT * FROM config";
    $objStatement = $this->objDB->prepare($sQuery);

    if ($objStatement->execute()) {
      $sStatement = $this->objDB->query($sQuery);
      $arrResponse = $sStatement->fetch(\PDO::FETCH_ASSOC);

      $arrData['objStoreData'] = array();
      $arrData['objStoreData']['location'] = array();
      $arrData['objStoreData']['location']['address'] = array();
      $arrData['objStoreData']['location']['address']['addressLine1']     = $arrResponse['config_storeaddress1'];
      $arrData['objStoreData']['location']['address']['addressLine2']     = $arrResponse['config_storeaddress2'];
      $arrData['objStoreData']['location']['address']['city']             = $arrResponse['config_storecity'];
      $arrData['objStoreData']['location']['address']['country']          = $arrResponse['config_storecountry'];
      $arrData['objStoreData']['location']['address']['county']           = $arrResponse['config_storestate'];
      $arrData['objStoreData']['location']['address']['postalCode']       = $arrResponse['config_storezip'];      
      $arrData['objStoreData']['location']['address']['stateOrProvince']  = $arrResponse['config_storestate'];
      $arrData['objStoreData']['location']['geoCoordinates']['latitude']  = '';
      $arrData['objStoreData']['location']['geoCoordinates']['longitude'] = '';      
      $arrData['objStoreData']['name']                          = $arrResponse['config_storename'];
      $arrData['objStoreData']['phone']                         = $arrResponse['config_storephone'];
      $arrData['objStoreData']['locationWebUrl']                = '';
      $arrData['objStoreData']['locationInstructions']          = '';
      $arrData['objStoreData']['locationAdditionalInformation'] = '';
      $arrData['objStoreData']['locationTypes']                 = array('STORE');
      $arrData['objStoreData']['merchantLocationKey']           = '';
      $arrData['objStoreData']['merchantLocationStatus']        = 'ENABLED';

    } else {
      throw new \Exception($sQuery.' failed in execution');
    }    

  } catch (Exception $objException) {
    $objResponse->getBody()->write(json_encode($objException));
  }

  return $objResponse->withJson($arrData, 200);
});

$app->get('/store/datamappings', function (Request $objRequest, Response $objResponse) {
  $nResponseCode   = 400;
  
  $objStore = new \ebay\classes\Store($this->objDB);
  $arrResponseData = $objStore->getDataMappings($nResponseCode);
  
  return $objResponse->withJson($arrResponseData, $nResponseCode);
});

$app->post('/store/datamappings', function (Request $objRequest, Response $objResponse) {    
  $nResponseCode   = 400;
  
  $objStore = new \ebay\classes\Store($this->objDB);
  $arrResponseData = $objStore->saveDataMappings($objRequest->getParsedBody(), $nResponseCode);
  
  return $objResponse->withJson($arrResponseData, $nResponseCode);
});

$app->get('/store/marketplace', function (Request $objRequest, Response $objResponse) {
  $sQuery = "SELECT * FROM marketplace WHERE marketplace_type='ebay'";

  try {
    $objStatement = $this->objDB->prepare($sQuery);

    if ($objStatement->execute()) {
      $arrData['data'] = $objStatement->fetch(\PDO::FETCH_ASSOC);
      $nResponseCode = 200;
    } else {
      throw new \Exception($sQuery.' failed in execution');
    }
  } catch (Exception $objException) {
    $arrData['message'] .= 'Exception while fetching marketplace data. Exception message: '.$objException->getMessage();
    $nResponseCode = 400;
  }
  $arrData['query'] = $sQuery; 
  
  return $objResponse->withJson($arrData, $nResponseCode);// withStatus($nResponseCode)->getBody()->write($sResponse);
});