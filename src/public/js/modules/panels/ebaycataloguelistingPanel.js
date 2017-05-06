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
    
    /* Listing action button listeners */
    nsc('.create-offer').off().on('click', function() {
      app.objModel.objEbayCatalogueModel.nCurrentItemCode = nsc(this).data('productcode');
      objEbayCatalogueListingPanel.showModal();
      objEbayCatalogueListingPanel.setModalListeners();
    });
    
    nsc(document).on('ebayCatalogueItemDeleted', function(event, sProductCode) {
      console.log(app.objModel.objEbayCatalogueModel.objItems);
      nsc('#ebay-catalogue-item-'+sProductCode).fadeOut(300, function(){nsc(this).remove();});
    });
    
    nsc('.remove_from_ebay').off().on('click', function() {
      var sItemSku = nsc(this).data('itemsku');
      app.objModel.objEbayCatalogueModel.deleteItemFromEBay(sItemSku);
    });
  };
    
  objEbayCatalogueListingPanel.setModalListeners = function() {
    /* Modal window listeners */
    nsc('#create-ebay-offer').off().on('click', function() {
      var objItemData  = nsc('#create-offer-form').serializeArray();
      
      /*serializeData needs massaged into a useful structure */
      var objData = {};
      for (var i in objItemData) {
        objData[objItemData[i].name] = objItemData[i].value;
      }
      objData.sku  = nsc(this).data('sku');

      app.objModel.objEbayOffersModel.createOffer(objData);
    });
    
    nsc('#get-listing-fee').off().on('click', function() {
      var sProductCode = nsc(this).data('sku');
      console.log(sProductCode);
    });
    
    nsc(document).off('offercreated').on('offercreated', function(param1, param2) {
      console.log(param2);
      objEbayCatalogueListingPanel.showMessage('Offer creation succeeded', 'success');
    });
    
    nsc(document).off('failedrestcall').on('failedrestcall', function(param1, sRestCallName, objResponseData) {
      var sMessage = '';
      for (var i = 0, nLength = objResponseData.errors.length; i < nLength; i++) {
        sMessage += '<p>'+sRestCallName+' failed because:</p>';
        sMessage += '<ul>';
        sMessage += '<li>['+objResponseData.errors[i].errorId+'] '+objResponseData.errors[i].message+'</li>';
        sMessage += '</ul>';
      }
      objEbayCatalogueListingPanel.showMessage(sMessage, 'danger');
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
    sHTML += ' id="create_offer-' + objEbayItem.sku + '"';
    sHTML += ' class="btn btn-default create-offer"';
    sHTML += ' data-productcode="' + objEbayItem.sku + '"';
    sHTML += '>';
    sHTML += 'Create Offer';
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
    var sItemCode    = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    var objEbayItem  = app.objModel.objEbayCatalogueModel.objItems[sItemCode];

    var sHTML = '';
    
    sHTML += '<div id="modal-alertbox"></div>';
    
    sHTML += '<form class="form-horizontal" id="create-offer-form">';
    
    sHTML += objEbayCatalogueListingPanel.getMarketplaceMarkup();
    
    sHTML += objEbayCatalogueListingPanel.getLocationMarkup();
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-quantity" class="col-sm-2 control-label">Quantity</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <input type="text" class="form-control" id="item-quantity" name="quantity" value="'+objEbayItem.availability.shipToLocationAvailability.quantity+'">';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    
    sHTML += objEbayCatalogueListingPanel.getCategoryMarkup();
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-format" class="col-sm-2 control-label">Format</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <input type="text" class="form-control" id="item-format" name="format" value="FIXED_PRICE" readonly>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';    
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-description" class="col-sm-2 control-label">Description</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <textarea class="form-control" id="item-description" name="description">'+objEbayItem.product.description+'</textarea>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-pricecurrency" class="col-sm-2 control-label">Currency</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <select name="currency" class="form-control">';
    sHTML += '    <option value="USD">UD Dollars</option>';
    sHTML += '    <option value="GBP">Sterling</option>';
    sHTML += '    <option value="CAD">Canadian Dollars</option>';
    sHTML += '    <option value="EUR">Euros</option>';
    sHTML += '  </select>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-pricevalue" class="col-sm-2 control-label">Price</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <select name="pricevalue" class="form-control">';
    sHTML += '    <option value="'+objStoreItem.product_price+'">Price - '+objStoreItem.product_price+'</option>';
    sHTML += '    <option value="'+objStoreItem.product_priceweb+'">Web Price - '+objStoreItem.product_priceweb+'</option>';
    sHTML += '    <option value="'+objStoreItem.product_pricea+'">Price A - '+objStoreItem.product_pricea+'</option>';
    sHTML += '    <option value="'+objStoreItem.product_priceb+'">Price B - '+objStoreItem.product_priceb+'</option>';
    sHTML += '    <option value="'+objStoreItem.product_pricec+'">Price C - '+objStoreItem.product_pricec+'</option>';
    sHTML += '  </select>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';    
    
    sHTML += '</form><!-- .form-horizontal -->';
    
    return sHTML;
  };

  objEbayCatalogueListingPanel.getCategoryMarkup = function() {
    var sHTML = '';
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-categoryid" class="col-sm-2 control-label">Category</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <select name="categoryid" class="form-control">';
    sHTML += '    <option value="2545">Dungeons & Dragons</option>';
    sHTML += '  </select>';
    sHTML += '<p class="help-block">Select which eBay category you want to list in.</p>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    return sHTML;
  };
    
  objEbayCatalogueListingPanel.getMarketplaceMarkup = function() {
    var sHTML = '';
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-marketplaceid" class="col-sm-2 control-label">Marketplace</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <select name="marketplaceid" class="form-control">';
    sHTML += '    <option value="EBAY_US">ebay.com</option>';
    sHTML += '    <option value="EBAY_GB">ebay.co.uk</option>';
    sHTML += '    <option value="EBAY_CA">ebay.ca</option>';
    sHTML += '    <option value="EBAY_IE">ebay.ie</option>'; 
    sHTML += '  </select>';
    sHTML += '<p class="help-block">Select which eBay marketplace you want to list on.</p>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    return sHTML;
  };

  objEbayCatalogueListingPanel.getLocationMarkup = function() {
    var objLocations = app.objModel.objLocationModel.objLocations;
    var sHTML = '';
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item[locationid]" class="col-sm-2 control-label">Location</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <select name="locationid" class="form-control">';
    for (var sLocationKey in objLocations) {
      sHTML += '<option';
      sHTML += ' value="'+sLocationKey+'"';
      if (objLocations[sLocationKey].merchantLocationStatus !== 'ENABLED') {
        sHTML += ' readonly';
      }
      sHTML += '>';
      sHTML += objLocations[sLocationKey].name;
      sHTML += '</option>';
    }
    sHTML += '  </select>';
    sHTML += '<p class="help-block">Select which of your stores you want to sell from.</p>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    return sHTML;
  };
    
  objEbayCatalogueListingPanel.getModalFooterMarkup = function() {
    var sProductCode = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var sHTML = '';

    sHTML += '<button type="button" class="btn btn-primary" id="create-ebay-offer" data-sku="'+sProductCode+'">Create Offer</button>';
    sHTML += '<button type="button" class="btn btn-info" id="get-listing-fee" data-sku="'+sProductCode+'">Get Listing Fee</button>';
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