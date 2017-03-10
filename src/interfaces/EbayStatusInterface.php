<?php
namespace ebay\interfaces; 

interface EbayStatusInterface {
  const ERROR_IN_APP          = 0;
  const UNINITIALIZED         = 1;  // The app has never been used on this store
  const BEFORE_TOKEN          = 2;  // The app has been used but no token fetched 
  const AUTHORIZED            = 4;  // The app has been given permission by an eBay account holder to access their eBay account
  const UNAUTHORIZED          = 8;  // The app has not been given permission to use an ebay account
  const ACCESS_TOKEN_EXPIRED  = 16; // The app user token has expired
  const REFRESH_TOKEN_EXPIRED = 32; // When the refresh token has expired we need to start from the beginning and send the user to ebay to authorize us again
}