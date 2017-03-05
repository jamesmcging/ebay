<?php
namespace ebay\classes;


require_once EBAY_CODEBASE_PATH.'classes/Response.php';

class HALResponse extends Response {
  
  protected $_arrResponseBody = array(
    '_links'    => array(),
    '_embedded' => array()
  );
  
  public function __construct() {
    $this->setHeader('content-Type: application/hal+json');
    $this->addLink('self', $_SERVER['REQUEST_URI']);
  }
  
  public function addLink($sKey, $sURL) {
    $this->_arrResponseBody['_links'][$sKey] = array('href' => $sURL);
  }
  
  public function addEmbeddedResource($sResourceName, $arrResource) {
    
    if ($sResourceName == 'items') {
      // Build a HAL+json entry for an item
      $arrItem = array(
        '_links' => array(
          'self'      => Items::URI.'?id='.$arrResource['product_id'],
          'store_url' => $arrResource['product_url']
        ),
      );
      foreach ($arrResource as $sKey => $sValue) {
        $arrItem[$sKey] = $sValue;
      }
      
      $this->_arrResponseBody['_embedded'][$sResourceName][] = $arrItem;
      
    } else {
      $this->_arrResponseBody['_embedded'][$sResourceName][] = $arrResource;
    }
  }
  
  public function addKeyValue($sKey, $sValue) {
    $this->_arrResponseBody[$sKey] = $sValue;
  }
  
}