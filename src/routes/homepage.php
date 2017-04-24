<?php
namespace ebay\routes;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use ebay\src\resources\Homepage as Homepage;

$app->get('/', function (Request $objRequest, Response $objResponse) {
  
  // Determine the URLs of the various services used by the app. These vary
  // depending on whether the pp is running in dev mode or on the live servers
  if (isset($_SERVER['EBAY_ENVIRONMENT']) && $_SERVER['EBAY_ENVIRONMENT'] == \ebay\interfaces\EnvironmentInterface::DEV_MODE) {
    $arrURLs = array(
      'sStoreURL'     => 'http://www.alaname.ie',
      'sCatalogueURL' => 'http://catalogue.alaname.ie'
    );
  } else {
    $arrURLs = array(
      'sStoreURL'     => 'https://www.alaname.com',
      'sCatalogueURL' => 'https://catalogue.alaname.com'
    );
  }
  $sURLs = 'objURLs = '.json_encode($arrURLs);

  $sHTML = <<<HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>eBay Project</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="description" content="My masters thesis project">
          <meta name="author" content="jamesmcging@gmail.com">

          <link rel="stylesheet" href="css/bootstrap.min.css">
          <link rel="stylesheet" href="css/ebay.css">
          <link rel="stylesheet" href="css/font-awesome.min.css">
          <link rel="shortcut icon" href="about:blank">
          </head>
        <body>
          <div>
            <script>{$sURLs}</script>
            <script src="js/config.js"></script>
            <script data-main="modules/main" src="js/lib/require.js"></script>
          </div>
        </body>
      </html>
HTML;
  
    $objResponse->getBody()->write($sHTML);

    return $objResponse;
});
