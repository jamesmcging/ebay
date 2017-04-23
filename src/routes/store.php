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
  
  return $objResponse->withJson($arrData, $nResponseCode);
});

$app->get('/store/cataloguedata', function(Request $objRequest, Response $objResponse) {
  $sQuery = 'SELECT product_brandname, product_theme, product_departmentid, name, category_id, category_name '
          . 'FROM product '
          . 'LEFT JOIN department ON product_departmentid = id '
          . 'LEFT JOIN category ON product.category_link = category.category_id';
  
  try {
    $arrData = array(
      'objBrands'      => array(),
      'objThemes'      => array(),
      'objDepartments' => array(),
      'objCategories'  => array()
    );
    $objStatement = $this->objDB->prepare($sQuery);

    if ($objStatement->execute()) {
      while($arrRow = $objStatement->fetch(\PDO::FETCH_ASSOC)) {
        // Add any brand names
        if (!in_array($arrRow['product_brandname'], $arrData['objBrands'])
                && strlen($arrRow['product_brandname']) > 0) {
          $arrData['objBrands'][] = $arrRow['product_brandname'];
        }
        // Add any themes
        if (!in_array($arrRow['product_theme'], $arrData['objThemes'])
                && strlen($arrRow['product_theme']) > 0) {
          $arrData['objThemes'][] = $arrRow['product_theme'];
        } 
        // Add any departments
        if (!isset($arrData['objDepartments'][$arrRow['product_departmentid']])
                && strlen($arrRow['product_departmentid']) > 0) {
          $arrData['objDepartments'][$arrRow['product_departmentid']] = $arrRow['name'];
        }         
        // Add any catagories
        if (!isset($arrData['objDepartments'][$arrRow['category_id']])
                && strlen($arrRow['category_id']) > 0) {
          $arrData['objCategories'][$arrRow['category_id']] = $arrRow['category_name'];
        }
        // Build a tree of departments/ categories
        if (!isset($arrData['objStoreStructure'][$arrRow['product_departmentid']])
                && strlen($arrRow['product_departmentid']) > 0) {
          $arrData['objStoreStructure'][$arrRow['product_departmentid']] = array(
            'department_id'   => $arrRow['product_departmentid'],
            'department_name' => $arrRow['name'],
            'department_link' => "/store/department/{$arrRow['product_departmentid']}/{$arrRow['name']}/",
            'children'        => array(),
          );
        }
        if (!isset($arrData['objStoreStructure'][$arrRow['product_departmentid']]['children'][$arrRow['category_id']])
                && strlen($arrRow['category_id'])) {
          $arrData['objStoreStructure'][$arrRow['product_departmentid']]['children'][$arrRow['category_id']] = array(
            'category_id'   => $arrRow['category_id'],
            'category_name' => $arrRow['category_name'],
            'category_link' => "/store/category/{$arrRow['product_departmentid']}/{$arrRow['category_id']}/{$arrRow['category_name']}/"
          );
        }
      }
      
      // Sort the brand and theme arrays alphabetically
      sort($arrData['objBrands']);
      sort($arrData['objThemes']);
//      asort($arrData['objDepartments']);
//      ksort($arrData['objCategories']);
      
      $nResponseCode = 200;
    } else {
      throw new \Exception($sQuery.' failed in execution');
    }
    
  } catch (Exception $objException) {
    $arrData['message'] .= 'Exception while fetching catalogue data. Exception message: '.$objException->getMessage();
    $nResponseCode = 400;
  }
  $arrData['query'] = $sQuery; 
  
  return $objResponse->withJson($arrData, $nResponseCode);
});