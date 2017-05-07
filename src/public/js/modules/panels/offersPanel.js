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
    
    /* React to an existing offer in the offer listing table being clicked */
    nsc('.offering-existing').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      var objOffer = app.objModel.objEbayOffersModel.objOffers[nOfferId];
      nsc('#offer-details').replaceWith(objOffersPanel.getOfferDetailMarkup(objOffer));
      objOffersPanel.setListeners();
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
    nsc(document).off('offercreated').on('offercreated', function(param1, param2) {
      console.log(param2);
      objOffersPanel.showMessage('Offer creation succeeded', 'success');
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
    sHTML += '  <div class="panel-heading">Offers</div>';
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
      sHTML += '<tr class="offering-existing" data-offerid="'+nOfferID+'">';
      sHTML += '  <td>'+nOfferID+'</td>';
      sHTML += '  <td>'+objOffer.marketplaceId+'</td>';
      sHTML += '  <td>'+objOffer.status+'</td>';
      sHTML += '</tr>';
    }
    
    /* The chance to create a new offer */
    sHTML += '    <tr id="offering-new" data-offerid="'+nOfferID+'">';
    sHTML += '      <td colspan="3">Click here to create new offering.</td>';
    sHTML += '    </tr>';
    
    sHTML += '  </table>';
    sHTML += '</div><!-- .panel -->';
    sHTML += '</div><!-- #offer-list -->';
    
    return sHTML;
  };
    
  objOffersPanel.getOfferDetailMarkup = function(objOffer) {
    var sItemCode    = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    var objEbayItem  = app.objModel.objEbayCatalogueModel.objItems[sItemCode];
    
    var sHTML = '';
    
    sHTML += '<div id="modal-alertbox"></div>';
    
    sHTML += '<form class="form-horizontal" id="create-offer-form">';
    
    sHTML += objOffersPanel.getLocationMarkup();
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-quantity" class="col-sm-2 control-label">Quantity</label>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <input type="text" class="form-control" id="item-quantity" name="quantity" value="'+objEbayItem.availability.shipToLocationAvailability.quantity+'">';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    
    sHTML += objOffersPanel.getCategoryMarkup();
    
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
    
    sHTML += '<div class="form-group">';
    sHTML += '<div class="col-sm-2"></div>';
    sHTML += '<div class="col-sm-10">';
    sHTML += '  <div class="btn-group" role="group">';
    sHTML += '    <button type="button" class="btn btn-default" id="create-ebay-offer" data-sku="'+sItemCode+'">Create Offer</button>';
    sHTML += '    <button type="button" class="btn btn-danger" id="delete-ebay-offer" data-sku="'+sItemCode+'">Delete Offer</button>';
    sHTML += '    <button type="button" class="btn btn-info" id="get-listing-fee" data-sku="'+sItemCode+'">Get Listing Fee</button>';
    sHTML += '    <button type="button" class="btn btn-primary" id="publish-offer" data-sku="'+sItemCode+'">Publish Offer</button>';
    sHTML += '  </div><!-- .btn-group -->';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';
    
    sHTML += '</form><!-- .form-horizontal -->';

    return sHTML;
  };

  objOffersPanel.getCategoryMarkup = function() {
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
    
  objOffersPanel.getMarketplaceMarkup = function() {
    var sHTML = '';
//    sHTML += '<div class="form-group">';
//    sHTML += '<label for="item-marketplaceid" class="col-sm-2 control-label">Marketplace</label>';
//    sHTML += '<div class="col-sm-10">';
    sHTML += '  <select name="marketplaceid" class="form-control input-group-sm">';
    sHTML += '    <option value="EBAY_US">ebay.com</option>';
    sHTML += '    <option value="EBAY_GB">ebay.co.uk</option>';
    sHTML += '    <option value="EBAY_CA">ebay.ca</option>';
    sHTML += '    <option value="EBAY_IE">ebay.ie</option>'; 
    sHTML += '  </select>';
//    sHTML += '</div>';
//    sHTML += '</div> <!-- .form-group -->';
    return sHTML;
  };

  objOffersPanel.getLocationMarkup = function() {
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
    
  objOffersPanel.showMessage = function(sMessage, sMessageType) {
    var sHTML = '';
    sHTML += '<div id="modal-alertbox" class="alert alert-'+sMessageType+'">';
    sHTML += sMessage;
    sHTML += '</div>';
    
    nsc('#modal-alertbox').replaceWith(sHTML);
  };
  
  return objOffersPanel;
});