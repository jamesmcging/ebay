define([
  'jquery',
  'modules/ebayApi/inventory'],
  function(
    nsc,
    objApiInventory
  ) {
   
  var objEbayCatalogueModel = {};
  
  objEbayCatalogueModel.objData = {
    arrItems          : {}
  };
  
  objEbayCatalogueModel.objFilters = {
    nOffset           : 0,
    nLimit            : 20,
    nItemCount        : 0,
    sOrderByField     : 'product_name',
    sOrderByDirection : 'ASC'
  };

  objEbayCatalogueModel.N_ITEM_DATA_TTL = (60 * 60 * 24 * 7); // Data has a TTL of 1 week
  objEbayCatalogueModel.sCatalogueKey   = 'ebayCatalogue';
  objEbayCatalogueModel.nItemCount      = 'unknown';
  
  objEbayCatalogueModel.initialize = function() {
    objEbayCatalogueModel.setListeners();
    
    objEbayCatalogueModel.updateItemCount();
  };
  
  objEbayCatalogueModel.updateItemCount = function() {
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      objApiInventory.getInventoryItems(1, 0, objEbayCatalogueModel.updateItemCountInEbayCatalogueModel);
    }
  };

  objEbayCatalogueModel.updateItemCountInEbayCatalogueModel = function(objData) {
    objEbayCatalogueModel.nItemCount = objData.sResponseMessage.total;
    nsc(document).trigger('updateSummaryPanel');
  };

  objEbayCatalogueModel.setListeners = function() {    
    nsc(document).on('credentialsPanelUpdated', function(event, nEbayAuthorizationStatus) {
      objEbayCatalogueModel.updateItemCount();
    });
  };

  objEbayCatalogueModel.getItemCount = function() {
    return objEbayCatalogueModel.nItemCount;
  };
  
  
  
  objEbayCatalogueModel.pushItemToEBay = function(objItem) {};
  
  /**
   * Function charged with returning an item from the store catalogue model.
   * 
   * @param {int} nItemID
   * @returns {Boolean|objItem}
   */
  objEbayCatalogueModel.getItemById = function(nItemID) {};

  return objEbayCatalogueModel;
});