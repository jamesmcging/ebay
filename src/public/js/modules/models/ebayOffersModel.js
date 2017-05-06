define([
  'jquery',
  'modules/ebayApi/inventory'],
  function(
    nsc,
    objApiInventory
  ) {
   
  var objEbayOffersModel = {};
  
  objEbayOffersModel.objOffers = {};
  
  objEbayOffersModel.objFilters = {};

  objEbayOffersModel.nEbayOfferCount = 'unknown';
  
  objEbayOffersModel.initialize = function() {};
  
  objEbayOffersModel.setListeners = function() {};
    
  
  /* ------------------------------------------------------------------------ */
  
  objEbayOffersModel.getOffersFromEbayByProductcode = function(sSku) {};
  
  objEbayOffersModel.getOffersFromEbayByProductcodeRestResponse = function(objData) {};
  
  
  objEbayOffersModel.getOfferFromEbayByOfferId = function(sOfferID) {};
  
  objEbayOffersModel.getOfferFromEbayByOfferIdRestResponse = function(objData, nOfferID) {};
  
  
  objEbayOffersModel.createOffer = function(objOfferData) {
    console.log('------------------ objEbayOffersModel.createOffer ---------');
    console.log(objOfferData);
    var objData = {
      availableQuantity   : objOfferData.quantity,
      categoryId          : objOfferData.categoryid,
      format              : objOfferData.format,
      listingDescription  : objOfferData.description,
      marketplaceId       : objOfferData.marketplaceid,
      merchantLocationKey : objOfferData.locationid,
      pricingSummary      : {
        price    : {
          value    : objOfferData.pricevalue,
          currency : objOfferData.currency
        }
      },
      sku : objOfferData.sku
    };
    objApiInventory.createOffer(objData, objEbayOffersModel.createOfferRestResponse);
  };
  
  objEbayOffersModel.createOfferRestResponse = function(objData) {
    console.log(objData);
    if (objData.nResponseCode === 201) {
      var nOfferId = objData.sResponseMessage.offerId;
      app.objModel.objEbayOffersModel.objOffers[nOfferId] = {};

      /* Ask eBay how much it willbe to public this listing */
      objEbayOffersModel.getListingFees([{offerId: nOfferId}]);
      
      /* Let the app know we have got a new offer */
      nsc(document).trigger('offercreated', [nOfferId]);
      
    } else {
      nsc(document).trigger('failedrestcall', ['create offer', objData.sResponseMessage]);
    }
  };
  
  
  objEbayOffersModel.updateOffer = function(objOfferData) {};
  
  objEbayOffersModel.updateOfferRestResponse = function(objData, nOfferID) {};
  
  
  objEbayOffersModel.deleteOffer = function(objOfferData) {};
  
  objEbayOffersModel.deleteOfferRestResponse = function(objData, nOfferID) {};
  
  
  objEbayOffersModel.getListingFees = function(arrOfferIDs) {
    var objData = {
      offers : arrOfferIDs
    };
    objApiInventory.getListingFeeds(objData, objEbayOffersModel.getListingFeesRestResponse);
  };
  
  objEbayOffersModel.getListingFeesRestResponse = function(objData) {
    console.log(objData);
    if (objData.nResponseCode === 201) {
      /* Add the listing fee somewhere useful*/
      
      
      
      //add the listing fee!!!
      
      
      

      /* Let the app know we have got a new offer */
      nsc(document).trigger('listingfeeobtained', [nOfferId]);
      
    } else {
      nsc(document).trigger('failedrestcall', ['Get listing fee', objData.sResponseMessage]);
    }
  };
  
  
  objEbayOffersModel.publishOffer = function(objOfferData) {};
  
  objEbayOffersModel.publishOfferRestResponse = function(objData, nOfferID) {};
  
  
  return objEbayOffersModel;
});