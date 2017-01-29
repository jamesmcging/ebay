<?php




class EbayAuthorization {
  
  private $_sClientId        = '';
  private $_sClientSecret    = '';
  private $_sRuName          = '';
  private $_sEbayAccessToken = '';
  private $_sEbayOAuthURL    = 'https://api.sandbox.ebay.com/identity/v1/oauth2/token';
  
  
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
    
    $rscConnection = curl_init();
    curl_setopt($rscConnection, CURLOPT_URL, $this->_sEbayOAuthURL);
    curl_setopt($rscConnection, CURLOPT_POST);
    
    $arrHeaders = array();
    $arrHeaders[] = 'Content-type: application/x-www-form-urlencoded';
    $arrHeaders[] = 'Authorization: Basic '.base64_encode($this->_sClientId.':'.$this->_sClientSecret);
    
    curl_setopt($rscConnection, CURLOPT_HTTPHEADER, $arrHeaders);
    
    curl_setopt($rscConnection, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($rscConnection, CURLOPT_SSL_VERIFYHOST, 0);
    
    curl_setopt($rscConnection, CURLOPT_RETURNTRANSFER, 1);
    
    $sBody = "grant_type=client_credentials&redirect_uri={$this->_sRuName}";
    curl_setopt($rscConnection, CURLOPT_POSTFIELDS, $sBody);
    
    $sResponse = curl_exec($rscConnection);
    
    curl_close($rscConnection);
    
    var_dump($sResponse);
  }
  
  public function getAccessToken() {
    return $this->_sEbayAccessToken;
  }
}