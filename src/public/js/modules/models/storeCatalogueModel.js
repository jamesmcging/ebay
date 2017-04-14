define([
  'jquery', 
  'modules/ebayApi/inventory'],
  function(
    nsc, 
    objApiInventory
  ) {
   
  var objStoreCatalogueModel = {};
  
  objStoreCatalogueModel.objData = {
    objDepartments    : {},
    objCataegories    : {},
    objBrands         : {},
    objThemes         : {},
    objStoreStructure : {}
  };
  
  objStoreCatalogueModel.objFilters = {
    nDeptID    : 0,
    nCatID     : 0,
    sBrandName : null,
    sTheme     : null
  };

  objStoreCatalogueModel.N_ITEM_DATA_TTL = (60 * 60 * 24 * 7); // Data has a TTL of 1 week
  objStoreCatalogueModel.sCatalogueKey = 'storeCatalogue';
  
  objStoreCatalogueModel.initialize = function() {
    /* Ask the store for details such as a list of departments, categories, 
     * brands, themes that can be used to filter store products */
    var jqxhr = nsc.ajax({
      url      : '/store/cataloguedata',
      data     : {},
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      objStoreCatalogueModel.objData = responsedata;
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    jqxhr.always(function() {
      console.log('storestructureupdated triggered');
      console.log(objStoreCatalogueModel.objData);
      nsc(document).trigger('storestructureupdated');
    });
  };
  
  objStoreCatalogueModel.setListeners = function() {};

  objStoreCatalogueModel.getStoreStructure = function() {
    return objStoreCatalogueModel.objData.objStoreStructure; 
  };
  
  objStoreCatalogueModel.getBrands = function() {
    return objStoreCatalogueModel.objData.objBrands; 
  };
    
  objStoreCatalogueModel.getThemes = function() {
    return objStoreCatalogueModel.objData.objThemes; 
  };  
  
  
  
  
  
  
  
  //////////////////////////////////////////////////////////////////////////////
  // The following is if we decide to use localstorage for the store catalogue//
  //////////////////////////////////////////////////////////////////////////////
  
  /**
   * Function charged with a adding a group of items to the model catalogue
   * 
   * @param {type} objItems
   * @returns {undefined}
   */
  objStoreCatalogueModel.loadItems = function(objItems) {
    for (var objKey in objItems) {
      this.updateItem(objItems[objKey]);
    }
  };
  
  /**
   * Function charged with updating an item in the model with a more up to date
   * or a more complete version of an existing product.
   * 
   * @param {type} objItem
   * @returns {undefined}
   */
  objStoreCatalogueModel.updateItem = function(objItem) {
    var sStoreKey = this.sCatalogueKey + '-' + objItem['product_id'];
    
    /* Retrieve any stored data we have on this item */
    var sItem = localStorage.getItem(sStoreKey);
    if (sItem) {
      /* localStorage only stores strings */
      var objStoredItem = JSON.parse(sItem);
      
      /* update the item with the new data */
      for (var sKey in objItem) {
        objStoredItem[sKey] = objItem[sKey];
      }
      
      objItem = objStoredItem;
    }
    
    /* Add a timestamp to the item indicating when it was updated */
    objItem.ttl = Date.now() + objStoreCatalogueModel.N_ITEM_DATA_TTL;
    
    /* Turn our item into a string before sticking it in local storage */
    localStorage.setItem(sStoreKey, JSON.stringify(objItem));
  };
  
  /**
   * Function charged with returning an item from the store catalogue model.
   * 
   * @param {int} nItemID
   * @returns {Boolean|objItem}
   */
  objStoreCatalogueModel.getItemById = function(nItemID) {
    var objItem = null;
    var sItemKey = this.sCatalogueKey + '-' + nItemID;
    var sItem = localStorage.getItem(sItemKey);
    if (sItem) {
      objItem = JSON.parse(sItem);
    }
    return objItem;
  };

  return objStoreCatalogueModel;
});