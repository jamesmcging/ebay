<?php
namespace ebay\classes;

class Response {
  protected $_arrResponseBody = array();
  
  protected $_arrResponseTypes = array('application/json');
  
  protected $_nResponseCode = 404;
  
  protected $_arrHeaders = array();

  
  public function respond($nResponseCode = '') {
    
    if (!empty($nResponseCode)) {
      $this->setResponseCode($nResponseCode);
    }
    
    $this->renderResponseCode($this->_nResponseCode);
    
    foreach ($this->_arrHeaders as $sHeader) {
      header($sHeader);
    }
    
    if (count($this->_arrResponseBody)) {
      $this->renderBody();
    }
    
    exit;
  }
  
  public function setResponseCode($nCode) {
    $this->_nResponseCode = (int)$nCode;
  }
  
  public function setHeader($sHeader) {
    $this->_arrHeaders[] = (string)$sHeader;
  }

  public function addToResponseBody($response) {
    $this->_arrResponseBody[] = $response;
  }
  
  private function renderBody() {
    
    if (in_array('application/json', $this->_arrResponseTypes)) {
      $sBody = json_encode($this->_arrResponseBody);
      
    } else if (in_array('text/html', $this->_arrResponseTypes)) {
      $sBody = print_r($this->_arrResponseBody);
    
    } else if (in_array('*/*', $this->_arrResponseTypes)) {
      $sBody = print_r($this->_arrResponseBody);
      
    } else {
      $sBody = 'This API only handles content-type application/json';
    }
    
    echo $sBody;
  }
  
  private function renderResponseCode($nCode) {
    
    $this->_nResponseCode = (int)$nCode;
    
    switch ($this->_nResponseCode) {
      case 100: $sText = 'Continue'; break;
      case 101: $sText = 'Switching Protocols'; break;
      case 200: $sText = 'OK'; break;
      case 201: $sText = 'Created'; break;
      case 202: $sText = 'Accepted'; break;
      case 203: $sText = 'Non-Authoritative Information'; break;
      case 204: $sText = 'No Content'; break;
      case 205: $sText = 'Reset Content'; break;
      case 206: $sText = 'Partial Content'; break;
      case 300: $sText = 'Multiple Choices'; break;
      case 301: $sText = 'Moved Permanently'; break;
      case 302: $sText = 'Moved Temporarily'; break;
      case 303: $sText = 'See Other'; break;
      case 304: $sText = 'Not Modified'; break;
      case 305: $sText = 'Use Proxy'; break;
      case 400: $sText = 'Bad Request'; break;
      case 401: $sText = 'Unauthorized'; break;
      case 402: $sText = 'Payment Required'; break;
      case 403: $sText = 'Forbidden'; break;
      case 404: $sText = 'Not Found'; break;
      case 405: $sText = 'Method Not Allowed'; break;
      case 406: $sText = 'Not Acceptable'; break;
      case 407: $sText = 'Proxy Authentication Required'; break;
      case 408: $sText = 'Request Time-out'; break;
      case 409: $sText = 'Conflict'; break;
      case 410: $sText = 'Gone'; break;
      case 411: $sText = 'Length Required'; break;
      case 412: $sText = 'Precondition Failed'; break;
      case 413: $sText = 'Request Entity Too Large'; break;
      case 414: $sText = 'Request-URI Too Large'; break;
      case 415: $sText = 'Unsupported Media Type'; break;
      case 500: $sText = 'Internal Server Error'; break;
      case 501: $sText = 'Not Implemented'; break;
      case 502: $sText = 'Bad Gateway'; break;
      case 503: $sText = 'Service Unavailable'; break;
      case 504: $sText = 'Gateway Time-out'; break;
      case 505: $sText = 'HTTP Version not supported'; break;
      default:
          exit('Unknown http status code "' . htmlentities($nCode) . '"');
      break;
    }
    
    header($_SERVER["SERVER_PROTOCOL"].' '.$this->_nResponseCode.' '.$sText); 
  }
}

