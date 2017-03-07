<?php
namespace ebay\classes;

use ebay\interfaces\EbayStatusInterface as EbayStatus;
use ebay\config\Credentials as Credentials;
use ebay\model\db as db;

/**
 * Class designed to get a USER token from eBay
 */
class EbayAuthorization implements EbayStatus {
  
  private $_sClientId                 = '';
  private $_sClientSecret             = '';
  private $_sRuName                   = '';
  public $_sEbayAuthorizationCode     = '';
  private $_sEbayTokenRequestEndpoint = '';
  private $_sGetAuthorizationEndpoint = '';
  
  // The current status of our authorization
  private $_bEbayStatus = EbayStatus::UNINITIALIZED;
  
  // The user token that we use to make API calls
  private $_objEbayUserToken          = null;
  
  // Local copy of the PDO DB access object
  private $_objDB                     = null;
  
  public function __construct($objDB) {
    $this->_objDB = $objDB;
    
    if (Credentials::EBAY_PRODUCTION) {
      $this->_sClientId     = Credentials::EBAY_PRODUCTION_CLIENT_ID;
      $this->_sClientSecret = Credentials::EBAY_PRODUCTION_CLIENT_SECRET;
      $this->_sRuName       = Credentials::EBAY_PRODUCTION_RU_NAME;
      $this->_sEbayTokenRequestEndpoint = 'https://api.ebay.com/identity/v1/oauth2/token';
      $this->_sGetAuthorizationEndpoint = 'https://signin.ebay.com/authorize';
    } else {
      $this->_sClientId     = Credentials::EBAY_SANDBOX_CLIENT_ID;
      $this->_sClientSecret = Credentials::EBAY_SANDBOX_CLIENT_SECRET;
      $this->_sRuName       = Credentials::EBAY_SANDBOX_RU_NAME;
      $this->_sEbayTokenRequestEndpoint = 'https://api.sandbox.ebay.com/identity/v1/oauth2/token';
      $this->_sGetAuthorizationEndpoint = 'https://signin.sandbox.ebay.com/authorize';
    }
    
    $this->getCurrentAuthorization();
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
      'scope'         => 'https://api.ebay.com/oauth/api_scope/sell.inventory', //https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.order.readonly https://api.ebay.com/oauth/api_scope/buy.guest.order https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly',
      'state'         => '12345'
    );
    $sRequestURL = $this->_sGetAuthorizationEndpoint.'?'.http_build_query($arrQueryElements);
    
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
   * When eBay returns a succesfully authenticated user to our app, it returns
   * an authorization code. We use this to request an access token.
   * 
   * @param string $sAuthorizationCode
   */
  public function setAccessToken($sAuthorizationCode) {    
    $this->_sEbayAuthorizationCode = $sAuthorizationCode;
    
    // Now we exchange the authorization code for a user token.
    return $this->requestUserToken();
  }
  
  /**
   * Function charged with getting a user token using the previously fetched
   * authorization code. This is the second step of the OAuth procedure.
   * 
   * 
   * 
   * 
   * HTTP method:   POST
  URL (Sandbox): https://api.sandbox.ebay.com/identity/v1/oauth2/token

  HTTP headers:
    Content-Type = application/x-www-form-urlencoded
    Authorization = Basic <B64-encoded-oauth-credentials>

  Request body (wrapped for readability):
    grant_type=authorization_code&
    code=<authorization-code-value>&
    redirect_uri=<RuName-value>
   */
  public function requestUserToken() {
    $bOutcome = false;

    if (strlen($this->_sEbayAuthorizationCode)) {

      $arrData = http_build_query(array(
          'grant_type'   => 'authorization_code',
          'code'         => $this->_sEbayAuthorizationCode,
          'redirect_uri' => $this->_sRuName
      ));

      $rscConnection = curl_init();
      curl_setopt($rscConnection, CURLOPT_URL, $this->_sEbayTokenRequestEndpoint);
      curl_setopt($rscConnection, CURLOPT_HTTPHEADER, array(
        sprintf('Authorization: Basic %s', base64_encode(sprintf('%s:%s', $this->_sClientId, $this->_sClientSecret))),
        'Content-Type: application/x-www-form-urlencoded',
        //'Accept: application/json'
      ));

//      curl_setopt($rscConnection, CURLOPT_USERPWD, "$this->_sClientId:$this->_sClientSecret");
      
      curl_setopt($rscConnection, CURLOPT_SSL_VERIFYPEER, 0);
//      curl_setopt($rscConnection, CURLOPT_SSL_VERIFYHOST, 0);
      curl_setopt($rscConnection, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($rscConnection, CURLOPT_POST, 1);
      curl_setopt($rscConnection, CURLOPT_POSTFIELDS, $arrData);
      
      curl_setopt($rscConnection, CURLINFO_HEADER_OUT, 1);
      curl_setopt($rscConnection, CURLOPT_HEADER, true); // Display headers
      curl_setopt($rscConnection, CURLOPT_VERBOSE, true); // Display communication with server
      
      $sResponse = curl_exec($rscConnection);
      
      echo '<h3>Request for user token</h3>';
      echo '<b>Headers</b>';
      echo "<pre>";
      print_r(curl_getinfo($rscConnection, CURLINFO_HEADER_OUT));
      echo "</pre>";   
      echo '<b>Body</b>';
      echo '<p>'.$arrData.'</p>';
      echo '<hr>';
      
      echo '<h3>Response</h3>';
      echo '<b>Raw</b>';
      echo '<p>'.$sResponse.'</p>';
      echo '<hr>';
      
      echo '<b>Info</b>';
      echo "<pre>";
      print_r(curl_getinfo($rscConnection));
      echo "</pre>";
      
      $curl_error = curl_errno($rscConnection);
      if ($curl_error) {
        $curl_error = curl_error($rscConnection);
        echo '<h3>Curl Errors</h3>';
        echo $curl_error;
        echo '<hr>';
      }


      

      
   
      
      die();
      
      
      
      
      
      
      $this->sResponse = $sResponse;

      curl_close($rscConnection);

      $arrResponse = json_decode($sResponse, true);
      
      if (!empty($arrResponse['error'])) {
        $this->_sEbayUserToken   = isset($arrResponse['access_token']) ? $arrResponse['access_token'] : '';
        $this->_sTokenType       = isset($arrResponse['token_type']) ? $arrResponse['token_type'] : '';
        
        if (isset($arrResponse['expires_in'])) {
          $nTTL = (int)$arrResponse['expires_in'];
          $this->_nTokenExpiryDate = time() + $nTTL;
        }
        
        $this->_sRefreshToken    = isset($arrResponse['refresh_token']) ? $arrResponse['refresh_token'] : '';
        if (isset($arrResponse['refresh_token_expires_in'])) {
          $nTTL = (int)$arrResponse['refresh_token_expires_in'];
          $this->_nRefreshTokenExpiryDate = time() + $nTTL;
        }

        if (strlen($this->_sEbayUserToken)) {
          $bOutcome = $this->saveAuthorization();
        }
      }
      
    }
    return $bOutcome;
  }

  /**
   * Function charged with returning a user token for the front end to use in 
   * REST calls to eBay.
   * 
   * @return type
   */
  public function getUserToken() {
    return $this->_sEbayUserToken;
  }
  
  public function getStatus() {
    return $this->_bEbayStatus;
  }
  
  /**
   * function charged with fetching the current authorization from the DB
   */
  private function getCurrentAuthorization() {
    $sQuery = 'SELECT * FROM marketplace WHERE marketplace_type="ebay"';
    $objStatement = $this->_objDB->prepare($sQuery);
    if ($objStatement->execute()) {
      $arrData = $objStatement->fetch(\PDO::FETCH_ASSOC);
      if (strlen($arrData['marketplace_data'])) {
        $this->_objEbayUserToken = unserialize($arrData['marketplace_data']);
        
        // Ask the token to ensure it is up to date
        if ($this->_objEbayUserToken->update()) {
          $this->_bEbayStatus = EbayStatus::UNAUTHORIZED;
          
        // If we failed to refresh the token...
        } else {
          $this->_bEbayStatus = EbayStatus::ACCESS_TOKEN_EXPIRED;
        }
        
      } else {
        $this->_bEbayStatus = EbayStatus::UNINITIALIZED;
      }
      
    } else {
      $this->_bEbayStatus = EbayStatus::UNINITIALIZED;
    }
  }
  
  private function saveAuthorization() {
    
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
          '".serialize($this->_objEbayUserToken)."',
          '".$this->_bEbayStatus."',
          0,
          'Ebay marketplace entry added to DB',
          ''
        )
        ON DUPLICATE KEY UPDATE 
          marketplace_type           = 'ebay', 
          marketplace_webstoreid     = '".Credentials::STORE_ID."', 
          marketplace_data           = '".serialize($this->_objEbayUserToken)."', 
          marketplace_enabled        = '".$this->_bEbayStatus."',  
          marketplace_nextrefresh    = '0', 
          marketplace_lastmessage    = 'marketplace_data entry updated @".time()."'
      ";
            
      $objStatement = $this->_objDB->prepare($sQuery);
      return $objStatement->execute();

  }
}