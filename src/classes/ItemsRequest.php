<?php
namespace ebay\classes;

require_once EBAY_CODEBASE_PATH.'classes/Request.php';

class ItemsRequest extends Request {
  private $_arrRequestFields = array(
    'nID'               => '',
    'objFields'         => '',
    'sOrderByField'     => 'product_name',
    'sOrderByDirection' => 'ASC',
    'nOffset'           => 0,
    'nLimit'            => 20,
    'nDeptID'           => 'all',
    'nCatID'            => 'all',
    'sBrandName'        => 'all',
    'sTheme'            => 'all'
  );
    
  public function __construct() {
    $this->_arrRequestFields['nID']               = isset($_GET['nID']) ? (int)$_GET['nID'] : '';
    $this->_arrRequestFields['objFields']         = isset($_GET['objFields']) ? db_escape($_GET['objFields']) : '';
    $this->_arrRequestFields['sOrderByField']     = isset($_GET['sOrderByField']) ? db_escape($_GET['sOrderByField']) : $this->_arrRequestFields['sOrderByField'];
    $this->_arrRequestFields['sOrderByDirection'] = isset($_GET['sOrderByDirection']) ? db_escape($_GET['sOrderByDirection']) : '';
    $this->_arrRequestFields['nOffset']           = isset($_GET['nOffset']) ? (int)$_GET['nOffset'] : $this->_arrRequestFields['nOffset'];
    $this->_arrRequestFields['nLimit']            = isset($_GET['nLimit']) ? (int)$_GET['nLimit'] : $this->_arrRequestFields['nLimit'] ;
    $this->_arrRequestFields['nDeptID']           = isset($_GET['nDeptID']) ? db_escape($_GET['nDeptID']) : '';
    $this->_arrRequestFields['nCatID']            = isset($_GET['nCatID']) ? db_escape($_GET['nCatID']) : '';
    $this->_arrRequestFields['sBrandName']        = isset($_GET['sBrandName']) ? db_escape($_GET['sBrandName']) : '';
    $this->_arrRequestFields['sTheme']            = isset($_GET['sTheme']) ? db_escape($_GET['sTheme']) : '';
  }
  
  public function getItemRequestField($sFieldName) {
    return (!empty($this->_arrRequestFields[$sFieldName])) ? $this->_arrRequestFields[$sFieldName] : false;
  }
  
  public function getItemRequestFields() {
    return $this->_arrRequestFields;
  }
}