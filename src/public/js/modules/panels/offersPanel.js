define(['jquery', 
  'modules/panels/panel',
  ], 
  function(nsc, 
  objPanel
  ) {
   
  var objOffersPanel = {};

  objOffersPanel.__proto__ = objPanel;
  
  objOffersPanel.sName = 'eBay Offers';
  objOffersPanel.sCode = 'offerspanel';

  objOffersPanel.objChildPanels = {};
  
  objOffersPanel.objSettings.bActive = false;
   
  objOffersPanel.getPanelMarkup = function() {
    var sHTML = '';
    sHTML += '<div id="'+objOffersPanel.sCode+'-panel">';
    
    /* Panel to display existing offers associated with this sku. We display a 
     * loading spinner that will be replaced when data becomes available */
    sHTML += '<div id="offer-list" class="text-center">';
    sHTML += '  <span class="fa fa-3x fa-refresh fa-spin fa-fw text-center"></span>';
    sHTML += '  <p class="text-center">Loading offers...</p>';
    sHTML += '</div>';
    
    /* Panel to display offering data or build a new offering */
    sHTML += '<div id="offer-details"></div>';
    
    sHTML += '</div><!-- #'+objOffersPanel.sCode+'-panel -->';
    return sHTML;
  };
  
  objOffersPanel.setListeners = function() {
    ////////////////////////////////////////////////////////////////////////////
    // 
    // Triggers near the offer listing panel
    // 
    ////////////////////////////////////////////////////////////////////////////    
    /* React to an existing offer in the offer listing table being clicked */
    nsc('.offer-existing').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      var objOffer = app.objModel.objEbayOffersModel.objOffers[nOfferId];
      nsc('#offer-details').replaceWith(objOffersPanel.getOfferDetailMarkup(objOffer));
      objOffersPanel.setListeners();
    });
    
    nsc('#offer-new').off().on('click', function() {
      nsc('#offer-details').replaceWith(objOffersPanel.getOfferDetailMarkup(''));
      objOffersPanel.setListeners();
    });
    
    /* Allow the reloading of the offer list */
    nsc('#offer-list-refresh').off().on('click', function() {
      console.log('refresh offer list clicked');
      nsc('#offerspanel-panel').replaceWith(objOffersPanel.getPanelMarkup());
      app.objModel.objEbayOffersModel.getOffersFromEbayByProductcode(app.objModel.objEbayCatalogueModel.nCurrentItemCode);
    });
    
    
    ////////////////////////////////////////////////////////////////////////////
    // 
    // Triggers in the new offer form
    // 
    ////////////////////////////////////////////////////////////////////////////
    nsc('#new-offer-marketplace').off().on('change', function() {
      nsc('#new-offer-marketplacevalue').val(this.value);
    });
    
    nsc('#new-offer-pricefield').off().on('change', function() {
      var sItemCode    = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
      var objStoreItem = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
      var sFieldValue  = objStoreItem[this.value];
      nsc('#price-value').val(sFieldValue);
      
      console.log('price field changed to '+this.value);
    });
    
    nsc('#new-offer-quantityfield').off().on('change', function() {
      var sItemCode    = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
      var objStoreItem = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
      var sFieldValue  = objStoreItem[this.value];
      nsc('#new-offer-quantity-value').val(sFieldValue);
      
      console.log('quantity field changed to '+this.value);
    });
    
    
    ////////////////////////////////////////////////////////////////////////////
    // 
    // Buttons at the bottom of the offer detail form
    // 
    ////////////////////////////////////////////////////////////////////////////
    nsc('#create-ebay-offer').off().on('click', function() {
      var objItemData  = nsc('#create-offer-form').serializeArray();
      
      /* serializeData needs massaged into a useful structure */
      var objData = {};
      for (var i in objItemData) {
        objData[objItemData[i].name] = objItemData[i].value;
      }
      objData.sku  = nsc(this).data('sku');

      app.objModel.objEbayOffersModel.createOffer(objData);
    });
    
    nsc('#delete-ebay-offer').off().on('click', function() {
      var sProductCode = nsc(this).data('sku');
      console.log('delete offer for product code '+sProductCode);
    });    
    
    nsc('#get-listing-fee').off().on('click', function() {
      var sProductCode = nsc(this).data('sku');
      console.log('get listing for product code '+sProductCode);
    });
    
    nsc('#publish-offer').off().on('click', function() {
      var sProductCode = nsc(this).data('sku');
      console.log('publish offer for product code '+sProductCode);
    });    


    ////////////////////////////////////////////////////////////////////////////
    // 
    // App wide events
    // 
    ////////////////////////////////////////////////////////////////////////////
    nsc(document).off('offercreated').on('offercreated', function() {
      objOffersPanel.showMessage('Offer creation succeeded', 'success');
      nsc('#offerspanel-panel').replaceWith(objOffersPanel.getPanelMarkup());
      app.objModel.objEbayOffersModel.getOffersFromEbayByProductcode(app.objModel.objEbayCatalogueModel.nCurrentItemCode);
    });
    
    nsc(document).off('failedrestcall').on('failedrestcall', function(param1, sRestCallName, objResponseData) {
      var sMessage = '';
      for (var i = 0, nLength = objResponseData.errors.length; i < nLength; i++) {
        sMessage += '<p>'+sRestCallName+' failed because:</p>';
        sMessage += '<ul>';
        sMessage += '<li>['+objResponseData.errors[i].errorId+'] '+objResponseData.errors[i].message+'</li>';
        sMessage += '</ul>';
      }
      objOffersPanel.showMessage(sMessage, 'danger');
    });
    
    nsc(document).off('offersfetched').on('offersfetched', function(event, nOfferCount) {
      nsc('#offer-list').replaceWith(objOffersPanel.getOfferListMarkup());
      objOffersPanel.setListeners();
    });
  };
  
  objOffersPanel.initialize = function() {
    var sProductCode = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    /* If we don't have any offers for the current product, we ask eBay if any
     * exist. */
    if (app.objModel.objEbayOffersModel.getOffersForProduct(sProductCode)) {
      nsc('#offer-list').replaceWith(objOffersPanel.getOfferListMarkup());
      objOffersPanel.setListeners();
    } else {
      app.objModel.objEbayOffersModel.getOffersFromEbayByProductcode(app.objModel.objEbayCatalogueModel.nCurrentItemCode);
    }
  };
  
  objOffersPanel.getOfferListMarkup = function() {
    var sProductCode = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objOffers = app.objModel.objEbayOffersModel.getOffersForProduct(sProductCode);

    var sHTML = '';
    
    sHTML += '<div id="offer-list">';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>Offers</span>';
    sHTML += '    <span class="fa fa-refresh" id="offer-list-refresh" style="float:right"></span>';
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Existing offers for a sku are displayed below. Click on an offer to view/amend it or create a new offer. eBay only allows a sku to exist once per marketplace.</p>';
    sHTML += '  </div>';
    sHTML += '  <table class="table table-hover table-condensed">';
    
    if (Object.keys(objOffers).length) {
      sHTML += '<tr>';
      sHTML += '  <th>Offer ID</th>';
      sHTML += '  <th>Marketplace</th>';
      sHTML += '  <th>Status</th>';
      sHTML += '</tr>';
    }
    
    /* Any existing offers */
    for (var nOfferID in objOffers) {
      var objOffer = objOffers[nOfferID];
      sHTML += '<tr class="offer-existing" data-offerid="'+nOfferID+'">';
      sHTML += '  <td>'+nOfferID+'</td>';
      sHTML += '  <td>'+objOffer.marketplaceId+'</td>';
      sHTML += '  <td>'+objOffer.status+'</td>';
      sHTML += '</tr>';
    }
    
    /* The chance to create a new offer */
    sHTML += '    <tr>';
    sHTML += '      <td colspan="3" align="center">';
    sHTML += '        <button id="offer-new" class="btn btn-default" data-offerid="'+nOfferID+'">';
    sHTML += '          <span class="fa fa-plus-circle"></span>';
    sHTML += ' Click here to create new offering.';
    sHTML += '        </button>';
    sHTML += '      </td>';
    sHTML += '    </tr>';
    
    sHTML += '  </table>';
    sHTML += '</div><!-- .panel -->';
    sHTML += '</div><!-- #offer-list -->';
    
    return sHTML;
  };
    
  objOffersPanel.getOfferDetailMarkup = function(objOffer) {
    
    console.log('getOfferDetailMarkup called');
    console.log(objOffer);
    
    var sItemCode           = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem        = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    var objEbayItem         = app.objModel.objEbayCatalogueModel.objItems[sItemCode];
    var objDataMappingModel = app.objModel.objDataMappings;

    var sHTML        = '<div id="offer-details">';
    
    /* Deal with new offer */
    if (objOffer === '') {
      sHTML += '<div id="modal-alertbox"></div>';

      sHTML += '<form class="form-horizontal" id="create-offer-form">';

      sHTML += '<div class="form-group">';
      sHTML += '<label class="col-sm-2 control-label">Marketplace</label>';
      sHTML += '<div class="col-sm-7">';
      sHTML += objOffersPanel.getMarketplaceMarkup('new-offer-marketplace');
      sHTML += '</div>';
      sHTML += '<div class="col-sm-3">';
      sHTML += '  <input type="text" class="form-control" id="new-offer-marketplacevalue" name="marketplaceid">';
      sHTML += '</div>';
      sHTML += '</div> <!-- .form-group -->';
      
      sHTML += objOffersPanel.getLocationMarkup();

      sHTML += '<div class="form-group">';
      sHTML += '<label for="item-quantity" class="col-sm-2 control-label">Quantity</label>';
      sHTML += '<div class="col-sm-7">';
      sHTML += objOffersPanel.getFieldsMarkup('new-offer-quantityfield', 'availability.shipToLocationAvailability.quantity', objStoreItem);
      sHTML += '</div>';
      sHTML += '<div class="col-sm-3">';
      sHTML += '  <input type="text" class="form-control" id="new-offer-quantityvalue" name="quantity" value="'+objDataMappingModel.getItemDataByField('availability.shipToLocationAvailability.quantity', objStoreItem)+'">';
      sHTML += '</div>';
      sHTML += '</div> <!-- .form-group -->';

      sHTML += objOffersPanel.getCategoryMarkup();

      sHTML += '<div class="form-group">';
      sHTML += '<label for="item-format" class="col-sm-2 control-label">Format</label>';
      sHTML += '<div class="col-sm-7">';
      sHTML += '  <input type="text" class="form-control" id="item-format" name="format" value="FIXED_PRICE" readonly>';
      sHTML += '</div>';
      sHTML += '</div> <!-- .form-group -->';    

      sHTML += '<div class="form-group">';
      sHTML += '<label for="item-description" class="col-sm-2 control-label">Description</label>';
      sHTML += '<div class="col-sm-7">';
      sHTML += objOffersPanel.getFieldsMarkup('descriptionfield', 'product.description', objStoreItem);
      sHTML += '</div>';
      sHTML += '<br>'
      sHTML += '<div class="col-sm-offset-2 col-sm-7">';
      sHTML += '  <textarea class="form-control" id="item-description" name="description">'+objDataMappingModel.getItemDataByField('product.description', objStoreItem)+'</textarea>';
      sHTML += '</div>';
      sHTML += '</div> <!-- .form-group -->';

      sHTML += '<div class="form-group">';
      sHTML += '<label for="item-pricecurrency" class="col-sm-2 control-label">Currency</label>';
      sHTML += '<div class="col-sm-7">';
      sHTML += '  <select name="currency" class="form-control">';
      sHTML += '    <option value="USD">US Dollars</option>';
      sHTML += '    <option value="GBP">Sterling</option>';
      sHTML += '    <option value="CAD">Canadian Dollars</option>';
      sHTML += '    <option value="EUR">Euros</option>';
      sHTML += '  </select>';
      sHTML += '</div>';
      sHTML += '</div> <!-- .form-group -->';

      sHTML += objOffersPanel.getPriceMarkup();

      sHTML += '<div class="form-group">';
      sHTML += '<div class="col-sm-offset-2 col-sm-10">';
      sHTML += '  <div class="btn-group" role="group">';
      sHTML += '    <button type="button" class="btn btn-default" id="create-ebay-offer" data-sku="'+sItemCode+'">Create Offer</button>';
      sHTML += '    <button type="button" class="btn btn-danger" id="delete-ebay-offer" data-sku="'+sItemCode+'">Delete Offer</button>';
      sHTML += '    <button type="button" class="btn btn-info" id="get-listing-fee" data-sku="'+sItemCode+'">Get Listing Fee</button>';
      sHTML += '    <button type="button" class="btn btn-primary" id="publish-offer" data-sku="'+sItemCode+'">Publish Offer</button>';
      sHTML += '  </div><!-- .btn-group -->';
      sHTML += '</div>';
      sHTML += '</div> <!-- .form-group -->';

      sHTML += '</form><!-- .form-horizontal -->';
    }
    sHTML += '</div><!-- #offer-details -->';
    console.log();
    return sHTML;
  };

  objOffersPanel.getCategoryMarkup = function() {
    var sHTML = '';
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-categoryid" class="col-sm-2 control-label">Category</label>';
    sHTML += '<div class="col-sm-7">';
    sHTML += '  <select name="categoryid" class="form-control">';
    sHTML += '    <option value="2545">Dungeons & Dragons</option>';
    sHTML += '  </select>';
    sHTML += '<p class="help-block">Select which eBay category you want to list in.</p>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    return sHTML;
  };
    
  objOffersPanel.getMarketplaceMarkup = function(sElementId) {
    if (typeof sElementId === 'undefined') {
      sElementId = 'marketplace';
    }
    var sHTML = '';
    sHTML += '  <select id="'+sElementId+'" class="form-control input-group-sm">';
    sHTML += '    <option value="EBAY_US">ebay.com</option>';
    sHTML += '    <option value="EBAY_GB">ebay.co.uk</option>';
    sHTML += '    <option value="EBAY_CA">ebay.ca</option>';
    sHTML += '    <option value="EBAY_IE">ebay.ie</option>'; 
    sHTML += '  </select>';
    return sHTML;
  };

  objOffersPanel.getLocationMarkup = function() {
    var objLocations        = app.objModel.objLocationModel.objLocations;
    var objDataMappingModel = app.objModel.objDataMappings;
    var sDefaultLocation    = objDataMappingModel.getStoreFieldDefaultByEbayField('location');
    var sHTML = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item[locationid]" class="col-sm-2 control-label">Location</label>';
    sHTML += '<div class="col-sm-7">';
    sHTML += '  <select id="location-dropdown" name="locationid" class="form-control">';
    for (var sLocationKey in objLocations) {
      sHTML += '<option';
      sHTML += ' value="'+sLocationKey+'"';
      sHTML += (sLocationKey === sDefaultLocation) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += objLocations[sLocationKey].name;
      
      /* If the location is currently disabled inform the user */
      if (objLocations[sLocationKey].merchantLocationStatus !== 'ENABLED') {
        sHTML += ' - disabled';
      }
      sHTML += '</option>';
    }
    sHTML += '  </select>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    sHTML += '<p class="help-block col-sm-offset-2">Select which of your stores you want to sell from.</p>';
    
    return sHTML;
  };
  
  objOffersPanel.getPriceMarkup = function() {
    var objPriceFields      = {
      product_price    : 'Price',
      product_priceweb : 'Web price',
      product_pricea   : 'Price A',
      product_priceb   : 'Price B',
      product_pricec   : 'Price C'
    };
    var sItemCode           = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem        = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    var objDataMappingModel = app.objModel.objDataMappings;
    var sDefaultField       = objDataMappingModel.getStoreFieldDefaultByEbayField('price');
    var sHTML               = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-pricevalue" class="col-sm-2 control-label">Price</label>';
    sHTML += '<div class="col-sm-7">';
    sHTML += '  <select id="new-offer-pricefield" class="form-control">';
    for (var sField in objPriceFields) {
      sHTML += '<option value="'+sField+'"';
      if (sField === sDefaultField) {
        sHTML += ' selected="selected"';
      }
      sHTML += '>';
      sHTML += objPriceFields[sField];
      sHTML += '</option>';
    }
    sHTML += '  </select>';
    sHTML += '</div>';
    sHTML += '<div class="col-sm-3">';
    sHTML += '  <input type="text" class="form-control" name="pricevalue" id="price-value" value="'+objDataMappingModel.getItemDataByField('price', objStoreItem)+'">';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';

    return sHTML;
  };
    
  objOffersPanel.showMessage = function(sMessage, sMessageType) {
    var sHTML = '';
    sHTML += '<div id="modal-alertbox" class="alert alert-'+sMessageType+'">';
    sHTML += sMessage;
    sHTML += '</div>';
    
    nsc('#modal-alertbox').replaceWith(sHTML);
  };
  
  objOffersPanel.getFieldsMarkup = function(sFieldId, sFieldPath, objItem) {
    var objDataMappings   = app.objModel.objDataMappings;
    var objPossibleFields = app.objModel.objDataMappings.arrProductFields;
    var sDefaultField     = objDataMappings.getStoreFieldDefaultByEbayField(sFieldPath, objItem);
    var sHTML = '';
    
    
    console.log('sFieldId      : '+sFieldId);
    console.log('sFieldPath    : '+sFieldPath);
    console.log('sDefaultField : '+sDefaultField);
    console.log(objItem);
    
    sHTML += '<select id="'+sFieldId+'" class="form-control">';
    for (var nKey in objPossibleFields) {      
      sHTML += '<option value="'+objPossibleFields[nKey]+'"';
      sHTML += (sDefaultField === objPossibleFields[nKey]) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += app.objModel.objDataMappings.arrProductFields[nKey];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  };
  
  return objOffersPanel;
});