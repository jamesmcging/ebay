<?php
namespace ebay\resources;

require_once EBAY_CODEBASE_PATH.'resources/Resource.php';
require_once EBAY_CODEBASE_PATH.'classes/HalResponse.php';
require_once EBAY_CODEBASE_PATH.'classes/ItemsRequest.php';

class Items extends Resource {
  
  protected $_objResponse = null;
  protected $_objRequest  = null;
  
  const MAX_RETURN_ITEMS = 100;
  
  const URI = '/store/administration/ajax/items.nsc';
  
  public function __construct(Request $objRequest, Response $objResponse) {
    
    $this->_objResponse = new HALResponse();
    
    $this->_objRequest = new ItemsRequest();
    
  }      
  
  /**
   * This function will look for certain fields in the $_GET array. Fields:
   *   - objFilter         - comma seperated list of product table fields;
   *   - sOrderByField     - product table field to sort return items by;
   *   - sOrderByDirection - expect ASC or DESC;
   *   - nOffset           - int to be used in limit clause
   *   - nLimit            - int to be used in limit clause (max 100)
   */
  public function get() {
    
    $objURLMapper = URLMapper::getInstance();
    
    $sSelectStatement  = $this->getSelectStatement();
    $sFromStatement    = $this->getFromStatement();
    $sJoinStatement    = $this->getJoinStatement();
    $sWhereStatement   = $this->getWhereStatement();
    $sOrderByStatement = $this->getOrderByStatement();
    $sLimitStatement   = $this->getLimitStatement();  
    $sItemQuery = $sSelectStatement . $sFromStatement . $sJoinStatement . $sWhereStatement . $sOrderByStatement . $sLimitStatement;

    $result = select_from_database($sItemQuery);

    if ($result && mysql_num_rows($result) > 0) {
      $this->_objResponse->setResponseCode(200);
      while ($row = mysql_fetch_assoc($result)) {
        
        // Add the product URL to the data
        $row['product_url'] = $objURLMapper->ProductLink($row);

        $row['department_url'] = $objURLMapper->DepartmentLink($row);
        
        $this->_objResponse->addEmbeddedResource('items', $row);
      }
      
      // We query again to determine how many products this filter could return
      $sItemCountQuery = 'SELECT count(*) as itemCount ' . $sFromStatement . $sJoinStatement . $sWhereStatement;
      $result = select_from_database($sItemCountQuery);
      if (mysql_num_rows($result)) {
        $row = mysql_fetch_assoc($result);
        $this->_objResponse->addKeyValue('nItemCount', $row['itemCount']);
      }
      
    } else {
      $this->_objResponse->setResponseCode(204);
      $this->_objResponse->addKeyValue('Message', 'No items returned from your query.');
    }

    /* Return the filters used to build this list */
    $this->_objResponse->addKeyValue('objFilters', $this->_objRequest->getItemRequestFields());
    
    /* Help dev out*/
    if (defined("DEVEL_MODE")) {
      $this->_objResponse->addKeyValue('Query', $sItemQuery);
    }
    
    $this->_objResponse->respond();
  }
  
  private function getSelectStatement() {
    $sStatement = 'SELECT ';
    
    // If we are looking for specific fields then return the fields sought
    if (!empty($this->_objRequest->getItemRequestField('objFields'))) {
      
      // objFields may contain the string all
      if (strpos($this->_objRequest->getItemRequestField('objFields'), 'all') !== false) {
        $sStatement .= '* ';
        
      // or it may request particular fields
      } else {
        $arrFields = explode(',', $this->_objRequest->getItemRequestField('objFields'));
        array_walk($arrFields, "trim");
        $arrFields = array_filter($arrFields, 'santitizeProductFields');
        $sStatement .= join(', ', $arrFields);
      }
      
    // If a specific field isn't sought then return the following fields by 
    // default. These are the fields required to render the initial item listing
    } else {
      $sStatement .= 'product_id, product_code, product_name, product_stock, product_price, product_image, product_departmentid as department_id, name as department_name, category_id, category_name ';
    }
    return $sStatement;
  }
  
  private function getFromStatement() {
    return 'FROM product ';
  }
  
  private function getJoinStatement() {
    return  'LEFT JOIN department on product_departmentid = department.id LEFT JOIN category on product.category_link = category.category_id ';
  }
  
  private function getWhereStatement() {
    $arrElements = array();
    
    /* We might be looking for a specific product */
    $nProductID = $this->_objRequest->getItemRequestField('nID');
    if ($nProductID) {
      $arrElements[] = 'product_id = '.$nProductID;
      
    /* If we are not looking for a specific product we cnan filter by department
     * and category */
    } else {
      /* We might be filtering on a department */
      $nDeptID = $this->_objRequest->getItemRequestField('nDeptID');
      if ($nDeptID && (strpos($nDeptID, 'all') === false) ) {
        $arrElements[] = 'product_departmentid = '.$nDeptID;
      }

      /* We might be filtering on a category */
      $nCatID = $this->_objRequest->getItemRequestField('nCatID');
      if ($nCatID && (strpos($nCatID, 'all') === false) ) {
        $arrElements[] = 'product.category_link = '.$nCatID;
      }
      
      /* We might be filtering on a brand */
      $sBrandName = $this->_objRequest->getItemRequestField('sBrandName');
      if ($sBrandName && (strpos($sBrandName, 'all') === false) ) {
        $arrElements[] = 'product_brandname = "'.$sBrandName.'"';
      }
      
      /* We might be filtering on a theme */
      $sTheme = $this->_objRequest->getItemRequestField('sTheme');
      if ($sTheme && (strpos($sTheme, 'all') === false) ) {
        $arrElements[] = 'product_theme = "'.$sTheme.'"';
      }
    }
    
    $sWhereStatement = '';
    if (count($arrElements) > 0) {
      $sWhereStatement .= 'WHERE '.join(' AND ', $arrElements).' ';
    }
    return $sWhereStatement;
  }
  
  private function getOrderByStatement() {
    $sStatement = '';
    if (!empty($_GET['sOrderByField']) && $this->santitizeProductFields($_GET['sOrderByField'])) {
      $sStatement .= 'ORDER BY '.$_GET['sOrderByField'].' ';
    
      if (!empty($_GET['sOrderByDirection']) && in_array($_GET['sOrderByDirection'], array('ASC', 'DESC'))) {
        $sStatement .= $_GET['sOrderByDirection'].' ';
      }
    } else {
      $sStatement .= 'ORDER BY product_name ';
    }
    return $sStatement;
  }
  
  private function getLimitStatement() {
    $sStatement = '';
    
    // No need for a limit statement when we are returning a single product
    if (empty($_GET['id'])) {
      $sStatement .= ' LIMIT';
    
      // Deal with (optional) offset first
      if (!empty($_GET['nOffset'])) {
        $sStatement .= ' '.(int)$_GET['nOffset'].', ';
      }

      // Deal with limit
      if (!empty($_GET['nLimit']) 
              && ((int)$_GET['nLimit'] <= self::MAX_RETURN_ITEMS)) {
        $sStatement .= ' '.(int)$_GET['nLimit'];

      // Default limit
      } else {
        $sStatement .= ' 20';
      }
    }
    
    return $sStatement;
  }
  
  private function santitizeProductFields($sField) {
    $arrProductFields = array(
      '*',
      'product_id',
      'product_code',
      'product_name',
      'product_price',
      'product_image',
      'category_link',
      'product_desc',
      'product_modified',
      'product_stock',
      'product_pricea',
      'product_priceb',
      'product_pricec',
      'product_promotion',
      'product_specialoffer',
      'product_newproduct',
      'product_theme',
      'product_rating',
      'product_subdescription1',
      'product_subdescription2',
      'product_subdescription3',
      'product_leadtime',
      'product_lastreceived',
      'product_releasedate',
      'product_priority',
      'product_weight',
      'product_onorder',
      'product_orderdate',
      'product_restocklevel',
      'product_taxable',
      'product_itemtaxid',
      'product_brandname',
      'product_subcategory',
      'product_priceweb',
      'product_nowebsale',
      'product_shortdesc',
      'product_matrixid',
      'product_weblinxcustomnumber1',
      'product_weblinxcustomnumber2',
      'product_weblinxcustomnumber3',
      'product_weblinxcustomnumber4',
      'product_weblinxcustomnumber5',
      'product_weblinxcustomtext1',
      'product_weblinxcustomtext2',
      'product_weblinxcustomtext3',
      'product_weblinxcustomtext4',
      'product_weblinxcustomtext5',
      'product_weblinxcustomtext6',
      'product_weblinxcustomtext7',
      'product_weblinxcustomtext8',
      'product_weblinxcustomtext9',
      'product_weblinxcustomtext10',
      'product_weblinxcustomtext11',
      'product_weblinxcustomtext12',
      'product_weblinxcustomtext13',
      'product_weblinxcustomtext14',
      'product_weblinxcustomtext15',
      'product_weblinxcustomtext16',
      'product_weblinxcustomtext17',
      'product_weblinxcustomtext18',
      'product_weblinxcustomtext19',
      'product_weblinxcustomtext20',
      'product_notdiscountable',
      'product_qtydiscountid',
      'product_departmentid',
      'product_keywords',
      'checksum',
      'product_tagalong',
      'product_timestamp',
      'product_type'
    );
    return in_array($sField, $arrProductFields);
  }
  
  private function getTotalProductCount() {
    $nItemCount = false;
    
    $sQuery = 'show table status where name = "product"';
    $result = select_from_database($sQuery);
    if (mysql_num_rows($result) > 0) {
      $row = mysql_fetch_assoc($result);
      $nItemCount = $row['Rows'];
    }
    
    return $nItemCount;
  }
  
  private function getFilteredProductCount() {
    $nItemCount = false;
    
    $sSelectStatement  = $this->getSelectStatement();
    $sFromStatement    = $this->getFromStatement();
    $sJoinStatement    = $this->getJoinStatement();
    $sWhereStatement   = $this->getWhereStatement();
    $sOrderByStatement = $this->getOrderByStatement();
    $sLimitStatement   = $this->getLimitStatement();
    
    
    $result = select_from_database($sQuery);
    if (mysql_num_rows($result) > 0) {
      $row = mysql_fetch_assoc($result);
      $nItemCount = $row['Rows'];
    }
    
    return $nItemCount;
  }
}

