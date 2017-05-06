define(['jquery', 
  'modules/panels/panel',
  ], 
  function(nsc, 
  objPanel
  ) {
   
  var objEbayCatalogueListingPanel = {};

  objEbayCatalogueListingPanel.__proto__ = objPanel;
  
  objEbayCatalogueListingPanel.sName           = 'Ebay Catalogue Listing Panel';
  objEbayCatalogueListingPanel.sCode           = 'ebaycataloguelistingpanel';
  objEbayCatalogueListingPanel.sCurrencySymbol = '';

  objEbayCatalogueListingPanel.objChildPanels = {};
  
  objEbayCatalogueListingPanel.objSettings.bActive = false;
   
  objEbayCatalogueListingPanel.getPanelContent = function() {
    var sHTML = '';

    sHTML += '<div class="row">';

    /* The item listing panel (can be shrunk to show product details) */
    sHTML += '<div id="ebay-catalogue-main" class="col-sm-12">';      
    sHTML += objEbayCatalogueListingPanel.getItemListHeaderMarkup();
    sHTML += objEbayCatalogueListingPanel.getItemListMarkup();
    sHTML += '</div>';

    /* The item detail panel */
    sHTML += '<div id="item-details-panel" class="col-sm-0">';
    sHTML += '</div><!-- #item-details-panel -->';

    sHTML += '</div><!-- .row -->';
      
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.setListeners = function() {
    nsc(document).on('ebayCatalogueUpdated', function() {
      console.log('objEbayCatalogueListingPanel notices that ebayCatalogueUpdated has triggered');
    });
  };
  
  objEbayCatalogueListingPanel.initialize = function() {};
  
  objEbayCatalogueListingPanel.getItemListHeaderMarkup = function() {
    var sHTML = '';
    
    sHTML += '<div id="head-ebay-catalogue">';
    
    sHTML += '<div class="col-sm-1">';
    sHTML += '<input type="checkbox" id="checkbox-all-store-items">';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-1">';
    sHTML += 'Image';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_code">Item Lookup Code</span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-3">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_name">Product Name</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_stock">Available</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_price">Price</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-3 text-right">';
    sHTML += 'Action';
    sHTML += '</div>';
    
    sHTML += '</div>';
    
    return sHTML;
  };

  objEbayCatalogueListingPanel.getItemListMarkup = function() {
    var sHTML = '';
    var objEbayInventory = app.objModel.objEbayCatalogueModel.objItems;
    
    if (Object.keys(objEbayInventory).length) {
      for (var sItemCode in objEbayInventory) {
        sHTML += objEbayCatalogueListingPanel.getItemMarkup(objEbayInventory[sItemCode]);
      }
    } else {
      sHTML = '<div class="alert alert-warning" role="alert">No eBay Items to list</div>';
    }
    
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.getItemMarkup = function(objEbayItem) {
    var sHTML = '';
        
    sHTML += '<div class="catalogue-item" id="ebay-catalogue-item-'+objEbayItem.sku+'">';
    
    /* The checkbox */
    sHTML += '<div class="col-sm-1">';
    sHTML += '  <input type="checkbox" class="item-checkbox" data-itemid="'+objEbayItem.sku+'">';
    sHTML += '</div>';
    
    /* The item image */
    sHTML += '<div class="col-sm-1">';
    if (typeof objEbayItem.product !== 'undefined' && typeof objEbayItem.product.imageUrls[0] !== 'undefined') {
      sHTML += '  <img style="width:100%" src="'+objEbayItem.product.imageUrls[0]+'">';
    }
    sHTML += '</div>';
    
    /* The item code */
    sHTML += '<div class="col-sm-2">';
    sHTML += objEbayItem.sku;
    sHTML += '</div>';
    
    /* The item name */
    sHTML += '<div class="col-sm-3">';
    sHTML += '  <span class="item-name">';
    if (typeof objEbayItem.product !== 'undefined' && typeof objEbayItem.product.title !== 'undefined') {
      sHTML += objEbayItem.product.title;
    }
    sHTML += '  </span>';
    sHTML += '</div>';
    
    /* The item inventory */
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += objEbayItem.availability.shipToLocationAvailability.quantity;
    sHTML += '</div>';
    
    /* The item price */
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += '';//objStoreCatalogueListingPanel.sCurrencySymbol + objEbayItem.product_price;
    sHTML += '</div>';
    
    /* The action button */
    sHTML += objEbayCatalogueListingPanel.getButtonMarkup(objEbayItem);

    sHTML += '</div>';
    
    
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.getButtonMarkup = function() {
    return '';
  };
    
  return objEbayCatalogueListingPanel;
});