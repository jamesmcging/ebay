<?php
namespace ebay\resources;

abstract class EbayAuthentications {
  
  protected $_objRequest = null;
  protected $_objResponse = null;
  
  public function __construct(Request $objRequest, Response $objResponse) {
    $this->_objRequest  = $objRequest;
    $this->_objResponse = $objResponse;
    
    require_once EBAY_CODEBASE_PATH.'classes/EbayAuthorization.php';
    $this->_objAuthenticator = new EbayAuthorization();
  }
  
  public function get() {
    $this->_objResponse->respond(405);
  }
  
  public function put() {
    $this->_objResponse->respond(405);
  }
  
  public function post() {
    $this->_objResponse->respond(405);
  }
  
  public function delete() {
    $this->_objResponse->respond(405);
  }
  
  public function patch() {
    $this->_objResponse->respond(405);
  }  
    
}