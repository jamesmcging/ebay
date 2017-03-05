<?php
namespace ebay\classes;

use ebay\src\interfaces\EbayStatusInterface as EbayStatus;

class EbayUserToken implements EbayStatus {
    // Variables returned from eBay when requesting an access token
    private $sAccessToken           = '';
    private $sTokenType             = '';
    private $nAccessTokenExpiresIn  = 0;
    private $sRefreshToken          = '';
    private $nRefreshTokenExpiresIn = 0;

    // Variables created internally
    private $nAccessTokenExpiresAt  = 0;
    private $nRefreshTokenExpiresAt = 0;
    
    public $bTokenStatus = self::UNINITIALIZED;
    
    // If the user access token is to expire in the next five minutes we refresh
    // it now.
    const SAFE_WINDOW = 300;
    
    public function construct($arrTokenData) {
      $this->sAccessToken           = $arrTokenData['access_token'];
      $this->sTokenType             = $arrTokenData['token_type'];
      $this->nAccessTokenExpiresIn  = $arrTokenData['expires_in'];
      $this->sRefreshToken          = $arrTokenData['refresh_token'];
      $this->nRefreshTokenExpiresIn = $arrTokenData['refresh_token_expires_in'];
      
      $this->nAccessTokenExpiresAt  = time() + $this->nAccessTokenExpiresIn;
      $this->nRefreshTokenExpiresAt = time() + $this->nRefreshTokenExpiresIn;
      
      $this->bTokenStatus = self::AUTHORIZED;
    }
    
    public function update() {
      $bOutcome = true;
      
      // If the access token has expired or will expire shortly then we request
      // a new access token
      if (($this->nAccessTokenExpiresAt + self::SAFE_WINDOW) > time()) {
        
        $this->bTokenStatus = EbayStatus::ACCESS_TOKEN_EXPIRED;
        
        $bOutcome = $this->renewAccessToken();
      }
      
      return $bOutcome;
    }
    
    private function renewAccessToken() {
      $bOutcome = false;
      
      // If the refresh token has expired then the user is going to have to give
      // us permissions again.
      if ($this->nRefreshTokenExpiresAt > time()) {
        $this->bTokenStatus = EbayStatus::REFRESH_TOKEN_EXPIRED;
        
      // Otherwise we use the refresh token to ask Ebay for a new User Access 
      // token
      } else {
        
      }
      
      return $bOutcome;
    }

}