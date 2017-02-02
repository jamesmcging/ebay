<?php
/**
 * Class designed to get a USER token from eBay
 */
class EbayAuthorization {
  
  private $_sClientId        = '';
  private $_sClientSecret    = '';
  private $_sRuName          = '';
  private $_sEbayAccessToken = '';
  private $_sEbayOAuthURL    = 'https://api.sandbox.ebay.com/identity/v1/oauth2/token';
  private $_sEbayGetUserURL  = 'https://signin.sandbox.ebay.com/authorize';
  
  const PRODUCTION = false;
  
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
  
  /**
   * Function that asks eBay for a URL that we can redirect the user to in order
   * to give the app API privileges on their behalf.
   * 
   * @return type
   * @throws Exception
   */
  public function requestSigninURL() {
    //$sSigninURL = false;
        
    $arrQueryElements = array(
      'client_id'     => $this->_sClientId,
      'redirect_uri'  => $this->_sRuName,
      'response_type' => 'code',
      'state'         => '123',
      'scope'         => 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.order.readonly https://api.ebay.com/oauth/api_scope/buy.guest.order https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly'
    );
    $sRequestURL = $this->_sEbayGetUserURL.'?'.http_build_query($arrQueryElements);

    try {
      $rscRequest = curl_init();
      curl_setopt($rscRequest, CURLOPT_URL, $sRequestURL);
      curl_setopt($rscRequest, CURLOPT_CONNECTTIMEOUT, 10);
      curl_setopt($rscRequest, CURLOPT_TIMEOUT, 10);
      curl_setopt($rscRequest, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($rscRequest, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($rscRequest, CURLOPT_SSL_VERIFYHOST, false);
      
      curl_setopt($rscRequest, CURLINFO_HEADER_OUT, 1);
      curl_setopt($rscRequest, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);

      // $sCurlResponse = curl_exec($rscRequest);
      $arrCurlInfo   = curl_getinfo($rscRequest);
      $nCurlError    = curl_errno($rscRequest);
      
      if (!empty($arrCurlInfo['redirect_url'])) {
        $sSigninURL = $arrCurlInfo['redirect_url'];
      } else {
        $sSigninURL = $arrCurlInfo['url'];
      }

      if ($nCurlError) {
        throw new Exception(__METHOD__.' throws exception making curl request to ebay for oauth redirect url.', $nCurlError);
      }

    } catch (Exception $objException) {
      echo $objException->getMessage();
    }

    curl_close($rscRequest);
    
    return $sSigninURL;
  }
  
  
  /**
   * Function charged with getting a token with no API scope associated with it
   */
  public function requestAccessToken() {
    
    $rscConnection = curl_init();
    curl_setopt($rscConnection, CURLOPT_URL, $this->_sEbayOAuthURL);
    curl_setopt($rscConnection, CURLOPT_POST, 1);
    
    $arrHeaders = array();
    $arrHeaders[] = 'content-type: application/x-www-form-urlencoded';
    $arrHeaders[] = 'authorization: Basic '.base64_encode($this->_sClientId.':'.$this->_sClientSecret);
    curl_setopt($rscConnection, CURLOPT_HTTPHEADER, $arrHeaders);
    
    curl_setopt($rscConnection, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($rscConnection, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($rscConnection, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($rscConnection, CURLINFO_HEADER_OUT, 1);
    
    $sBody = "grant_type=client_credentials&redirect_uri={$this->_sRuName}";
    curl_setopt($rscConnection, CURLOPT_POSTFIELDS, $sBody);
    
    $sResponse = curl_exec($rscConnection);
    
    $sInfo = curl_getinfo($rscConnection);
    
    curl_close($rscConnection);
    
    echo "<pre>";
    var_dump($sInfo);
    echo "</pre>";
    
    echo "<hr>";
    var_dump($sResponse);
  }
  
  public function getAccessToken() {
    return $this->_sEbayAccessToken;
  }
}