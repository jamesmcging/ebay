<?php

namespace Ebay\resources;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

/**
 * Description of Homepage
 *
 * @author James McGing <jamesmcging@gmail.com>
 */
class Homepage {
  
  public function getHomePage(Request $objRequest, Response $objResponse) {  

    $sHTML = <<<HTML
      <!DOCTYPE html>
      <html lang="en">
            
        <head>
          <meta charset="utf-8">
          <title>eBay Project - ebay interface</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="description" content="Ebay prototype for Masters in Software Development at CIT">
          <meta name="author" content="jamesmcging@gmail.com">
        </head>
            
        <body>
          <h1>Ebay Interface Resource</h1>
          <p>This is a service that interfaces with the eBay API. List of resources offered:</p>
          <ul>
            <li>General Resources</li>
            <ul>
              <li>GET <a href="\">/</a> this page</li>
            </ul>
            <li>Authorization Resources</li>             
            <ul>
              <li>GET <a href="/authorization/access">/authorization/access</a>  : ask Ebay for an access token, this is the first part of the authentication process</li>
              <!-- <li>GET <a href="/authorization/token">/authorization/token</a>   : ask Ebay for a user token, this is the last part of the authentication process</li> -->
              <li>GET <a href="/authorization/status">/authorization/status</a>  : ask the app for the status of the ebay authorisation - must be 4 to talk to Ebay</li>
              <li>GET <a href="/authorization/accept">/authorization/accept</a>  : landing page Ebay returns user to when the user accepts OAuth</li>
              <li>GET <a href="/authorization/decline">/authorization/decline</a> : landing page Ebay returns user to when the user declines OAuth</li>
            </ul>
            <li>Ebay API Interface</li>
            <ul>
              <li>GET <a href="/ebay/">/ebay/?params</a> - the portal that the app uses to question eBay</li>
            </ul>
          </ul>
        </body>
            
      </html>
HTML;
  
    $objResponse->getBody()->write($sHTML);

    return $objResponse;
  }
}
