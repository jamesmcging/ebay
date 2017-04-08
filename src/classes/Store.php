<?php

namespace ebay\classes;

/**
 * Class designed to get a USER token from eBay
 */
class Store {
  private $_objDB = null;
  
  public function __construct($objDB) {
    $this->_objDB = $objDB;
  }
  
  public function getDataMappings(&$nResponseCode = 200) {
    
    // We save the data mappings into marketplace_categorization in json
    $sQuery = "SELECT marketplace_categorization "
            . "FROM marketplace "
            . "WHERE marketplace_type = 'ebay'";
    
    $arrData = $this->_objDB->query($sQuery)->fetchAll();
    
    if ($arrData) {
      // The user token is a json string in marketplace_data
      $arrResponseData['saved_data_mappings'] = json_decode($arrData[0]['marketplace_categorization'], true);
      $nResponseCode = 200;
    } else {
      $nResponseCode = 400;
    }       
    
    return $arrResponseData;
  }
  
  public function saveDataMappings($arrRequestData, &$nResponseCode = 200) {
    
    // We save the data mappings into marketplace_categorization in json
    $sQuery = "UPDATE marketplace "
            . "SET marketplace_categorization = '".json_encode($arrRequestData['datamappings'])."' "
            . "WHERE marketplace_type = 'ebay'";
    $objStatement = $this->_objDB->prepare($sQuery);
    if($objStatement->execute()) {
      $arrResponseData['saved_data_mappings'] = $arrRequestData;
      $nResponseCode = 200;
    } else {
      $nResponseCode = 500;
    }       
    
    return $arrResponseData;
  }
}