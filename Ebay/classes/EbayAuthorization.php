<?php
namespace Ebay\classes;

use Ebay\interfaces\EbayStatusInterface as EbayStatus;
use Ebay\config\Credentials as Credentials;
use Ebay\model\db as db;

/**
 * Class designed to get a USER token from eBay
 */
class EbayAuthorization implements EbayStatus {
  
  private $_sClientId                 = '';
  private $_sClientSecret             = '';
  private $_sRuName                   = '';
  private $_sEbayAuthorizationCode    = '';
  private $_sEbayTokenRequestEndpoint = '';
  private $_sGetAuthorizationEndpoint = '';
  
  
  public $sRenewTokenResponse = '';
  
  // The current status of our authorization
  private $_bEbayStatus = EbayStatus::UNINITIALIZED;
  
  // The user token that we use to make API calls
  private $_arrUserToken = array(
    'sAccessToken'           => '',
    'sTokenType'             => '',
    'sAccessToken'           => '',
    'nExpiresIn'             => 0,
    'sRefreshToken'          => '',
    'nRefreshTokenExpiresIn' => 0,
    'nTokenExpiresAt'        => 0,
    'nRefreshTokenExpiresAt' => 0,
  );
  
  // Local copy of the PDO DB access object
  private $_objDB        = null;
  
  // We leave clues for dev in the DB
  private $_sMessageInDB = '';
  
  // We give the user five minutes of wriggle room, if the token is due to 
  // expire in these five minutes we renew the user token.
  const SAFE_WINDOW = 300;
  
  // Hadny for figuring out what is wrong with the curl requests - will cause 
  // the interface to fail as it spits out the curl response in verbose form to
  // the front end
  private $bDebug = false;
  
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
    
    // we then ask the db for a user token
    $sQuery = 'SELECT * FROM marketplace WHERE marketplace_type="ebay"';
    $arrData = $this->_objDB->query($sQuery)->fetchAll();
    if ($arrData) {
      
      // The user token is a json string in marketplace_data
      $sUserToken = $arrData[0]['marketplace_data'];

      // convert the json into an associative array
      $arrDbTokenData = json_decode($sUserToken, true);

      if (is_array($arrDbTokenData)) {
        // transfer the marketplace_data entry into the object variables
        $this->_arrUserToken = array_replace($this->_arrUserToken, $arrDbTokenData);

      } else {
        $this->_arrUserToken = '';
      }
    }
    
    // now that we have token data we try to set the status
    $this->setStatus();
  }
  
  /**
   * Function that asks eBay for a URL that we can redirect the user to in order
   * to give the app API privileges on their behalf.
   * 
   * @return type
   * @throws Exception
   */
  public function requestSigninURL() {        
    $arrQueryElements = array(
      'client_id'     => $this->_sClientId,
      'response_type' => 'code',
      'redirect_uri'  => $this->_sRuName,
      'scope'         => Credentials::EBAY_SCOPE,
      'state'         => '12345'
    );
    
    return $this->_sGetAuthorizationEndpoint.'?'.http_build_query($arrQueryElements);
  }
  
  /**
   * When eBay returns a succesfully authenticated user to our app, it returns
   * an authorization code. We use this to request an access token.
   * 
   * @param string $arrQueryParams
   */
  public function setAccessToken($arrQueryParams) {    
    $this->_sEbayAuthorizationCode = $arrQueryParams['code'];
    
    // Now we exchange the authorization code for a user token.
    return $this->requestUserToken();
  }
  
  public function getUserToken() {
    return !empty($this->_arrUserToken['sAccessToken']) ? $this->_arrUserToken['sAccessToken'] : false;
  }
  
  /**
   * Function charged with getting a user token using the previously fetched
   * authorization code. This is the second step of the OAuth procedure.
   * 
   */
  public function requestUserToken() {
    $bOutcome = false;

    if (strlen($this->_sEbayAuthorizationCode)) {

      // The way it should be done
      $arrData = http_build_query(array(
        'grant_type'   => 'authorization_code',
        'code'         => $this->_sEbayAuthorizationCode,
        'redirect_uri' => $this->_sRuName
      ));

      $rscConnection = curl_init();
      curl_setopt($rscConnection, CURLOPT_URL, $this->_sEbayTokenRequestEndpoint);
      curl_setopt($rscConnection, CURLOPT_HTTPHEADER, array(
        'Authorization: Basic '.base64_encode($this->_sClientId.':'.$this->_sClientSecret),  
        'Content-Type: application/x-www-form-urlencoded',
      ));

      curl_setopt($rscConnection, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($rscConnection, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($rscConnection, CURLOPT_POST, 1);
      curl_setopt($rscConnection, CURLOPT_POSTFIELDS, $arrData);
      curl_setopt($rscConnection, CURLINFO_HEADER_OUT, 1);
      
      // The following two lines will cause the json_decode below to fail as 
      // the sResponse include non-json elements (the header data)
      if ($this->bDebug) {
        curl_setopt($rscConnection, CURLOPT_HEADER, true); // Display headers
        curl_setopt($rscConnection, CURLOPT_VERBOSE, true); // Display communication with server
      }
      
      $sResponse = curl_exec($rscConnection);

      curl_close($rscConnection);

      $arrResponse = json_decode($sResponse, true);
      
      if (!empty($arrResponse['errors'])) {
        $this->_sMessageInDB = 'User token request failed errors: '.print_r($arrResponse['errors'], 1);
        $this->_bEbayStatus = self::ERROR_IN_APP;
        
      } else {
        $this->_arrUserToken['sAccessToken']           = $arrResponse['access_token'];
        $this->_arrUserToken['sTokenType']             = $arrResponse['token_type'];
        $this->_arrUserToken['nExpiresIn']             = $arrResponse['expires_in']; 
        $this->_arrUserToken['sRefreshToken']          = $arrResponse['refresh_token'];
        $this->_arrUserToken['nRefreshTokenExpiresIn'] = $arrResponse['refresh_token_expires_in'];

        $this->_arrUserToken['nTokenExpiresAt']        = time() + $this->_arrUserToken['nExpiresIn'];
        $this->_arrUserToken['nRefreshTokenExpiresAt'] = time() + $this->_arrUserToken['nRefreshTokenExpiresIn'];

        $this->setStatus();
        $this->_sMessageInDB = 'User token successfully requested';
      }
      
      // Save our status to the db, this includes a user token
      $bOutcome = $this->saveAuthorization();
      
    }
    return $bOutcome;
  }
 
  /**
   * Function charged with updating $this->bEBayStatus depending on the
   * values currently in $this->_arrUserToken. If the user token is out of date 
   * or due to be out of date shortly, it attempts to renew it.
   * 
   * @return EBayStatus
   */
  private function setStatus() {
    // If we have no token we are in virgin territory
    if (empty($this->_arrUserToken) || strlen($this->_arrUserToken['sAccessToken']) === 0) {
      $this->_bEbayStatus = self::UNINITIALIZED;

    // If we have a token...
    } else {
      // we check if it has or is about to expire
      if (!empty($this->_arrUserToken['sRefreshToken']) 
          && (int)$this->_arrUserToken['nTokenExpiresAt'] < (time() - self::SAFE_WINDOW)) {
        $this->renewAccessToken();
        
      // otherwise we deem the user access token to be valid
      } else {
        $this->_bEbayStatus = self::AUTHORIZED;
      }
    }

    return $this->_bEbayStatus;
  }

  /**
   * Method charged with updating $this->_bEbayStatus depending on 
   * $this->_arrUserToken
   * 
   * @return type
   */
  public function getStatus() {
    return $this->_bEbayStatus;
  }
  
  /**
   * Function charged with updating the current user token.
   * 
   * @return EbayStatus
   */
  private function renewAccessToken() {

    // If the refresh token has expired then the user is going to have to give
    // us permissions again.
    if (!empty($this->_arrUserToken['nRefreshTokenExpiresAt']) 
        && $this->_arrUserToken['nRefreshTokenExpiresAt'] < time()) {
      $this->_bEbayStatus = EbayStatus::REFRESH_TOKEN_EXPIRED;

    // Otherwise we use the refresh token to ask Ebay for a new User Access 
    // token
    } else {
      // The way it should be done
      $arrData = http_build_query(array(
        'grant_type'   => 'refresh_token',
        'code'         => $this->_arrUserToken['sRefreshToken'],
        'scope'        => Credentials::EBAY_SCOPE
      ));

      $rscConnection = curl_init();
      curl_setopt($rscConnection, CURLOPT_URL, $this->_sEbayTokenRequestEndpoint);
      curl_setopt($rscConnection, CURLOPT_HTTPHEADER, array(
        'Authorization: Basic '.base64_encode($this->_sClientId.':'.$this->_sClientSecret),  
        'Content-Type: application/x-www-form-urlencoded',
      ));

      curl_setopt($rscConnection, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($rscConnection, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($rscConnection, CURLOPT_POST, 1);
      curl_setopt($rscConnection, CURLOPT_POSTFIELDS, $arrData);

      curl_setopt($rscConnection, CURLINFO_HEADER_OUT, 1);
      
      // The following two lines will cause the json_decode below to fail as 
      // the sResponse include non-json elements (the header data)
      if ($this->bDebug) {
        curl_setopt($rscConnection, CURLOPT_HEADER, true); // Display headers
        curl_setopt($rscConnection, CURLOPT_VERBOSE, true); // Display communication with server
      }
      
      $sResponse = curl_exec($rscConnection);

      $this->sResponse = $sResponse;
$this->sRenewTokenResponse = $sResponse;
      curl_close($rscConnection);

      $arrResponse = json_decode($sResponse, true);

      if (!empty($arrResponse['errors'])) {
        $this->_bEbayStatus = self::ERROR_IN_APP;
        $this->_sMessageInDB = 'User token refresh failed errors: '.print_r($arrResponse['errors'], 1);
        
      } else {
        $this->_arrUserToken['sAccessToken']    = isset($arrResponse['access_token']) ? $arrResponse['access_token'] : '';
        $this->_arrUserToken['sTokenType']      = isset($arrResponse['token_type'])   ? $arrResponse['token_type']   : '';
        $this->_arrUserToken['nExpiresIn']      = isset($arrResponse['expires_in'])   ? $arrResponse['expires_in']   : 0;
        $this->_arrUserToken['nTokenExpiresAt'] = time() + $this->_arrUserToken['nExpiresIn'];

        $this->_bEbayStatus = self::AUTHORIZED;
        $this->_sMessageInDB = 'User token successfully refreshed'; 
      }
      // Save our status to the db, this includes a user token
      $this->saveAuthorization();
    }

    return $this->_bEbayStatus;
  }
  
  /**
   * Function charged with saving the current ebay set up, this stuffs the user
   * token into marketplace_data as a json encoded array.
   * 
   * @return type
   */
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
          '".json_encode($this->_arrUserToken)."',
          '".$this->_bEbayStatus."',
          0,
          'Ebay marketplace entry added to DB',
          ''
        )
        ON DUPLICATE KEY UPDATE 
          marketplace_type           = 'ebay', 
          marketplace_webstoreid     = '".Credentials::STORE_ID."', 
          marketplace_data           = '".json_encode($this->_arrUserToken)."', 
          marketplace_enabled        = '{$this->_bEbayStatus}',  
          marketplace_nextrefresh    = '0', 
          marketplace_lastmessage    = '{$this->_sMessageInDB} (updated @".time().")'
      ";
      
      $objStatement = $this->_objDB->prepare($sQuery);
      return $objStatement->execute();
  }
}