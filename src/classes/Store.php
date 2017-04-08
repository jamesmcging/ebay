<?php

namespace ebay\classes;

use ebay\config\Credentials as Credentials;

/**
 * Class designed to get a USER token from eBay
 */
class Store {
  private $_objDB = null;
  
  public function __construct($objDB) {
    $this->_objDB = $objDB;
  }
  
  public function getDataMappings(&$nResponseCode = 200) {
    $arrResponseData = array('saved_data_mappings' => null);
    $nResponseCode = 200;
    
    // We save the data mappings into marketplace_categorization in json
    $sQuery = "SELECT marketplace_categorization "
            . "FROM marketplace "
            . "WHERE marketplace_type = 'ebay'";
    
    $arrData = $this->_objDB->query($sQuery)->fetchAll();
    
    if ($arrData) {
      // The user token is a json string in marketplace_data
      $arrResponseData['saved_data_mappings'] = json_decode($arrData[0]['marketplace_categorization'], true);
    }       
    
    return $arrResponseData;
  }
  
  public function saveDataMappings($arrRequestData, &$nResponseCode = 200) {
    // We save the data mappings into marketplace_categorization in json
    $sQuery = "
      INSERT INTO marketplace(
        marketplace_type,
        marketplace_webstoreid,
        marketplace_data,
        marketplace_enabled,
        marketplace_nextrefresh, 
        marketplace_lastmessage, 
        marketplace_categorization)
      VALUES(
        'ebay', 
        '".Credentials::STORE_ID."',
        '',
        0,
        0,
        'Ebay field mappings saved',
        '".json_encode($arrRequestData['datamappings'])."'
      )
      ON DUPLICATE KEY UPDATE 
        marketplace_type           = 'ebay', 
        marketplace_webstoreid     = '".Credentials::STORE_ID."', 
        marketplace_data           = '', 
        marketplace_enabled        = 0,  
        marketplace_nextrefresh    = 0, 
        marketplace_lastmessage    = 'field mappings saved @".time()."',
        marketplace_categorization = '".json_encode($arrRequestData['datamappings'])."'
      ";
          
    
          
    $objStatement = $this->_objDB->prepare($sQuery);
    if($objStatement->execute()) {
      $arrResponseData['saved_data_mappings'] = $arrRequestData;
      $arrResponseData['query'] = $sQuery;
      $nResponseCode = 200;
    } else {
      $nResponseCode = 500;
    }       
    
    return $arrResponseData;
  }
}