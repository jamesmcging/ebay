<?php
namespace ebay\classes;

class Request {
  
  public $sResource  = '';
  public $sVerb      = '';
  public $arrFilters = array();
  
  
  public function __construct() {

    $this->setResource();
    
    $this->setQueryElements();
    
    $this->setVerb();
    
  }
  
  private function setResource() {
    $sRequestURI = $_SERVER['SCRIPT_URI'];
    
    // Strip any trailing /
    if (substr($sRequestURI, -1) === '/') {
      $sRequestURI = substr($sRequestURI, 0 , -1);
    }
    
    // Break it into its elements
    $arrElements = explode('/', $sRequestURI);
    
    // The resource is the last element of the URI
    $this->sResource = strtolower($arrElements[count($arrElements) - 1]); 
  }
  
  private function setQueryElements() {
    // Determine all the filters applied to the resource
    $arrQueryElements = explode('&', $_SERVER['QUERY_STRING']);
    foreach ($arrQueryElements as $sElement) {
      list($sKey, $sValue) = explode('=', $sElement);
      $this->arrFilters[$sKey] = $sValue;
    }
  }
  
  private function setVerb() {
    // Determine the HTTP verb being used on the resource, we white list 
    // acceptable verbs
    $arrAcceptableVerbs = array('POST' , 'GET', 'PUT', 'PATCH', 'DELETE');
    if (in_array(strtoupper($_SERVER['REQUEST_METHOD']), $arrAcceptableVerbs)) {
      $this->sVerb = strtolower($_SERVER['REQUEST_METHOD']);
    }
  }
}
