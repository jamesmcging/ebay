<?php




class EbayAuthorization {
  
  private $_sClientId        = '';
  private $_sClientSecret    = '';
  private $_sRuName          = '';
  private $_sEbayAccessToken = '';
  private $_sEbayOAuthURL    = '';
  
  public function __construct() {
    if (self::PRODUCTION) {
      $this->_sClientId     = Credentials::EBAY_PRODUCTION_CLIENT_ID;
      $this->_sClientSecret = Credentials::EBAY_PRODUCTION_CLIENT_SECRET;
      $this->_sRuName       = Credentials::EBAY_PRODUCTION_RU_NAME;
    } else {
      $this->_sClientId     = Credentials::EBAY_SANDBOX_CLIENT_ID;
      $this->_sClientSecret = Credentials::EBAY_SANDBOX_CLIENT_SECRET;
      $this->_sRuName       = Credentials::EBAY_SANDBOX_RU_NAME;
    }
  }
  
  public function requestAccessToken() {
    
  }
  
  public function getAccessToken() {
    return $this->_sEbayAccessToken;
  }
}