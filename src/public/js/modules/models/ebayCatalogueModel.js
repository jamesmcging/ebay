define([
  'jquery',
  'modules/ebayApi/inventory'],
  function(
    nsc,
    objApiInventory
  ) {
   
  var objEbayCatalogueModel = {};
  
  objEbayCatalogueModel.objItems = {};
  
  objEbayCatalogueModel.objFilters = {
    nOffset           : 0,
    nLimit            : 20,
    nItemCount        : 0,
    sOrderByField     : 'product_name',
    sOrderByDirection : 'ASC'
  };

  objEbayCatalogueModel.N_ITEM_DATA_TTL = (60 * 60 * 24 * 7); // Data has a TTL of 1 week
  objEbayCatalogueModel.sCatalogueKey   = 'ebayCatalogue';
  objEbayCatalogueModel.nEBayItemCount      = 'unknown';
  
  objEbayCatalogueModel.initialize = function() {
    objEbayCatalogueModel.setListeners();
    
    objEbayCatalogueModel.updateItemCount();
  };
  
  objEbayCatalogueModel.setListeners = function() {    
    nsc(document).on('credentialsPanelUpdated', function(event, nEbayAuthorizationStatus) {
      objEbayCatalogueModel.updateItemCount();
    });
  };
  
  objEbayCatalogueModel.updateItemCount = function() {
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      objEbayCatalogueModel.getItemsFromEbay();
    }
  };

  objEbayCatalogueModel.getItemCount = function() {
    return objEbayCatalogueModel.objFilters.nItemCount;
  };

  objEbayCatalogueModel.getItemsFromEbay = function() {
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      var nOffset = objEbayCatalogueModel.objFilters.nOffset;
      var nLimit  = objEbayCatalogueModel.objFilters.nLimit;
      objApiInventory.getInventoryItems(nLimit, nOffset, objEbayCatalogueModel.getItemsFromEbayRestResponse);
    }
  };

  objEbayCatalogueModel.getItemsFromEbayRestResponse = function(objData) {    
    if (objData.nResponseCode === 200) {
      /* Keep track of the total number of items in the eBay inventory */
      objEbayCatalogueModel.objFilters.nItemCount = objData.sResponseMessage.total;

      /* Inform the summary panel that the ebay product count has updated */
      nsc(document).trigger('updateSummaryPanel');

      /* Store the eBay items */
      for (var i = 0, nLength = objData.sResponseMessage.inventoryItems.length; i < nLength; i++) {
        /* We use the product code as the common key */
        var sProductCode = objData.sResponseMessage.inventoryItems[i].sku;

        /* Give the item a status */
        objData.sResponseMessage.inventoryItems[i].sStatus = 'ON_EBAY';

        /* Store the eBay item */
        objEbayCatalogueModel.objItems[sProductCode] = objData.sResponseMessage.inventoryItems[i];
      }
    }
  };

  objEbayCatalogueModel.pushItemToEBay = function(nItemID) {
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      /* Retrieve the item from the store catalogue */
      var objItem = app.objModel.objStoreCatalogueModel.getItemByID(nItemID);

      /* Get the data mapping object */
      var objMapper = app.objModel.objDataMappings;

      /* Build the json that pushes the item to eBay */
      var objProductData = {
        availability : {
  // EBAY REST does not yet support pick up at a location        
  //        pickupAtLocationAvailability : [
  //          {
  //            availabilityType : string,
  //            fulfillmentTime : {
  //              unit  : string,
  //              value : integer
  //            },
  //            merchantLocationKey : string,
  //            quantity : integer
  //          }
  //        ],
          shipToLocationAvailability : {
            quantity : objMapper.getItemDataByField('availability.shipToLocationAvailability.quantity', objItem)
          }
        },
        condition            : objMapper.getItemDataByField('condition', objItem),
  //      conditionDescription : objMapper.getItemDataByField('conditionDescription', objItem),
  //      packageWeightAndSize : {
  //        dimensions : {
  //          height : objMapper.getItemDataByField('packageWeightAndSize.dimensions.height', objItem),
  //          length : objMapper.getItemDataByField('packageWeightAndSize.dimensions.length', objItem),
  //          unit   : objMapper.getItemDataByField('packageWeightAndSize.dimensions.unit', objItem),
  //          width  : objMapper.getItemDataByField('packageWeightAndSize.dimensions.width', objItem)
  //        },
  //        packageType : objMapper.getItemDataByField('packageWeightAndSize.packageType', objItem),
  //        weight : {
  //          unit  : 'KILOGRAM', //objMapper.getItemDataByField('packageWeightAndSize.weight.unit', objItem),
  //          value : 1//objMapper.getItemDataByField('packageWeightAndSize.weight.value', objItem)
  //        }
  //      },
        product : {
  //        aspects     : {}, //objMapper.getItemDataByField('product.aspects', objItem)],
  //        brand       : objMapper.getItemDataByField('product.brand', objItem),
          description : 'test description',//objMapper.getItemDataByField('product.description', objItem),
  //        ean         : [objMapper.getItemDataByField('product.ean', objItem)],
          imageUrls   : [objMapper.getItemDataByField('product.imageUrls', objItem)],
  //        isbn        : [objMapper.getItemDataByField('product.isbn', objItem)],
  //        mpn         : objMapper.getItemDataByField('product.mpn', objItem),
  //        subtitle    : objMapper.getItemDataByField('product.subtitle', objItem),
          title       : objMapper.getItemDataByField('product.title', objItem),
  //        upc         : [objMapper.getItemDataByField('product.upc', objItem)]
        },
        sku : objItem['product_code']
      };

      /* Push the item to ebay */
      objApiInventory.createOrUpdateInventoryItem(objItem['product_code'], objProductData, objEbayCatalogueModel.pushItemToEbayRestResponse);

      /* Update the item action button on the store listing page */
      nsc('#push-to-ebay-'+nItemID).text('Updating');

      /* Update the model */
      app.objModel.objEbayCatalogueModel.objItems[objItem['product_code']] = {sStatus:'PUSHING_TO_EBAY'};
    }
  };
  
  objEbayCatalogueModel.pushItemToEbayRestResponse = function(objData, sItemCode, param3) {    
    /* The store listing panel uses product_ids, here we ask the store model for
     * the store objItem corresponding to the product code */
    var objItem = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    var nItemID = objItem.product_id;
    
    /* Check for success of call */
    if (objData.nResponseCode === 200) {      
      /* If call is successful add item to this model */
      app.objModel.objEbayCatalogueModel.objItems[sItemCode] = {sStatus : 'ON_EBAY'} ;//objData.sResponseMessage;// Once we get a 200 fill this out correctly!
      
      /* Update the item action button on the store listing page */
      nsc('#push-to-ebay-'+nItemID).text('On Ebay');
      
    } else {
      /* Update the item in the ebay catalogue */
      app.objModel.objEbayCatalogueModel.objItems[sItemCode] = {sStatus : 'ERROR_PUSHING_TO_EBAY'};
      
      /* Update the item action button on the store listing page */
      nsc('#push-to-ebay-'+nItemID).text('Unable to push');
    }
  };
  
  objEbayCatalogueModel.deleteItemFromEBay = function(nItemID) {
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      
      var objItem = app.objModel.objStoreCatalogueModel.getItemByID(nItemID);
      
      /* Use the eBay REST interface to delete the item from the eBay inventory */
      objApiInventory.deleteLocation(nItemID, objEbayCatalogueModel.deleteItemFromEbayRestResponse);
      
      /* Update the item action button on the store listing page */
      nsc('push-to-ebay-'+nItemID).text('Updating');

      /* Update the model */
      objEbayCatalogueModel.objItems[objItem['product_code']] = {sStatus:'DELETING_FROM_EBAY'};
    }
  };
  
  objEbayCatalogueModel.deleteItemFromEbayRestResponse = function(objData) {
    console.log(objData);
    // Need to remove the item from the model and update the ebay inventory listing panel
    // delete app.objModel.objEbayCatalogueModel.objItems[objData];
  };
  
  /**
   * Function charged with returning an item from the store catalogue model.
   * 
   * @param {int} nItemID
   * @returns {Boolean|objItem}
   */
  objEbayCatalogueModel.getItemById = function(nItemID) {};

  objEbayCatalogueModel.getItemStatus = function(nItemID) {
    var sItemStatus = 'UNKNOWN';
    
    /* Do we have the item in our ebay catalogue? */
    if (typeof objEbayCatalogueModel.objItems[nItemID] !== 'undefined') {
      sItemStatus = objEbayCatalogueModel.objItems[nItemID].sStatus;
    } else {
      sItemStatus = 'NOT_ON_EBAY';
    }
    
    return sItemStatus;
  };
  
  return objEbayCatalogueModel;
});