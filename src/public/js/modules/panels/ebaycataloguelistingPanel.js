define(['jquery', 
  'modules/panels/panel',
  'modules/panels/offersPanel'
  ], 
  function(nsc, 
  objPanel,
  objOffersPanel
  ) {
   
  var objEbayCatalogueListingPanel = {};

  objEbayCatalogueListingPanel.__proto__ = objPanel;
  
  objEbayCatalogueListingPanel.sName           = 'Ebay Catalogue Listing Panel';
  objEbayCatalogueListingPanel.sCode           = 'ebaycataloguelistingpanel';
  objEbayCatalogueListingPanel.sCurrencySymbol = '';

  objEbayCatalogueListingPanel.objChildPanels = {};
  
  objEbayCatalogueListingPanel.objSettings.bActive = false;
   
  /* At some point getPanelMarkup became getPanelContent but in order to call
   * objPanel.render() we still need getPanelMarkup */
  objEbayCatalogueListingPanel.getPanelMarkup = function() {
    return objEbayCatalogueListingPanel.getPanelContent();
  };
   
  objEbayCatalogueListingPanel.getPanelContent = function() {
    var sHTML = '';

    sHTML += '<div class="row">';

    /* The item listing panel (can be shrunk to show product details) */
    sHTML += '<div id="ebay-catalogue-main" class="col-sm-12">';      
    sHTML += objEbayCatalogueListingPanel.getItemListHeaderMarkup();
    sHTML += objEbayCatalogueListingPanel.getItemListMarkup();
    sHTML += '</div>';

    sHTML += '</div><!-- .row -->';
      
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.setListeners = function() {
    nsc(document).on('ebayCatalogueUpdated', function() {
      console.log('objEbayCatalogueListingPanel notices that ebayCatalogueUpdated has triggered');
    });
    
    /* Listing action button listeners */
    nsc('.manage-offer').off().on('click', function() {
      app.objModel.objEbayCatalogueModel.nCurrentItemCode = nsc(this).data('productcode');
      objEbayCatalogueListingPanel.showModal();
      objOffersPanel.render();
      objOffersPanel.initialize();
    });
    
    nsc(document).on('ebayCatalogueItemDeleted', function(event, sProductCode) {
      nsc('#ebay-catalogue-item-'+sProductCode).fadeOut(300, function(){nsc(this).remove();});
    });
    
    nsc(document).on('ebayCatalogueItemFailedToDelete', function(event, sProductCode) {
      nsc('#ebay-catalogue-item-'+sProductCode).text('Unable to delete');
    });    
    
    nsc('.remove_from_ebay').off().on('click', function() {
      var sItemSku = nsc(this).data('itemsku');
      nsc(this).text('deleting...');
      app.objModel.objEbayCatalogueModel.deleteItemFromEBay(sItemSku);
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
    var objStoreItem = app.objModel.objStoreCatalogueModel.getItemByCode(objEbayItem.sku);
    sHTML += app.objModel.objStoreCatalogueModel.objData.sCurrencySymbol + objStoreItem.product_price;
    sHTML += '</div>';
    
    /* The action button */
    sHTML += objEbayCatalogueListingPanel.getButtonMarkup(objEbayItem);

    sHTML += '</div>';
    
    
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.getButtonMarkup = function(objEbayItem) {
    var sHTML = '';
    sHTML += '<div class="col-sm-3 text-right" id="ebaycatalogueactionbutton-' + objEbayItem.sku + '">';
    sHTML += '<div class="btn-group">';
    sHTML += '<button';
    sHTML += ' type="button"';
    sHTML += ' id="manage_offer-' + objEbayItem.sku + '"';
    sHTML += ' class="btn btn-default manage-offer"';
    sHTML += ' data-productcode="' + objEbayItem.sku + '"';
    sHTML += '>';
    sHTML += 'Manage Offer';
    sHTML += '</button>';
    sHTML += '<button class="btn btn-default dropdown-toggle"';
    sHTML += 'data-toggle="dropdown" ';
    sHTML += '>';
    sHTML += '<span class="caret"></span>';
    sHTML += '</button>';
    sHTML += '<ul class="dropdown-menu">';
    sHTML += '<li><a href="#" class="btn btn-action remove_from_ebay" id="remove_from-ebay-'+objEbayItem.sku+'" data-itemsku="'+objEbayItem.sku+'">Delete</a></li>';
    sHTML += '</ul>';
    sHTML += '</div>';
    sHTML += '</div>';
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.getModalHeaderMarkup = function() {
    var sItemCode    = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    
    var sHTML = '';
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<h2 class="modal-title">'+objStoreItem.product_name+'</h2>';
    sHTML += '<span class="ghost">Sku '+objStoreItem.product_code+'</span>';
    sHTML += '&nbsp;<span class="ghost text-right">Product ID '+objStoreItem.product_id+'</span>';
    return sHTML;
  };
  
  objEbayCatalogueListingPanel.getModalBodyMarkup = function() {
    return '<div id="'+objOffersPanel.sCode+'-panel"></div>';
  };
    
  objEbayCatalogueListingPanel.getModalFooterMarkup = function() {
    var sProductCode = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close">Close</button>';
    
    return sHTML;
  };
    
  objEbayCatalogueListingPanel.showMessage = function(sMessage, sMessageType) {
    var sHTML = '';
    sHTML += '<div id="modal-alertbox" class="alert alert-'+sMessageType+'">';
    sHTML += sMessage;
    sHTML += '</div>';
    
    nsc('#modal-alertbox').replaceWith(sHTML);
  };
    
  return objEbayCatalogueListingPanel;
});