define(['jquery', 'modules/ebayApi/restCaller'], function(nsc, objRestCaller) {
   
  var objInventoryApi = {};

  objInventoryApi.__proto__ = objRestCaller;
  
  objInventoryApi.sApiName = 'inventory';

  /**
   * GET /location
   * @param {type} sCallbackFunction
   * @returns {inventory_L1.objInventoryApi@call;makeCall}
   */
  objInventoryApi.getLocations = function(sCallbackFunction) {
    var objParams = {limit:100,offset:0};
    this.makeCall('get', objInventoryApi.sApiName, 'location', null, objParams, sCallbackFunction);
  };

  /**
   * POST /location/{merchantLocationKey}
   * @param {string} sLocationKey
   * @param {type} sSerializedData
   * @param {string} sCallbackFunction
   * @returns {inventory_L1.objInventoryApi@call;makeCall}
   */
  objInventoryApi.createLocation = function(sLocationKey, sSerializedData, sCallbackFunction) {
    this.makeCall('post', objInventoryApi.sApiName, 'location', sLocationKey, sSerializedData, sCallbackFunction);
  };
  
  objInventoryApi.enableLocation = function(sLocationKey, sCallbackFunction) {
    this.makeCall('post', objInventoryApi.sApiName, 'location', sLocationKey+'/enable', null, sCallbackFunction);
  };

  objInventoryApi.disableLocation = function(sLocationKey, sCallbackFunction) {
    this.makeCall('post', objInventoryApi.sApiName, 'location', sLocationKey+'/disable', null, sCallbackFunction);
  };

  objInventoryApi.deleteLocation = function(sLocationKey, sCallbackFunction) {  
    this.makeCall('delete', objInventoryApi.sApiName, 'location', sLocationKey, null, sCallbackFunction);
  };
  
  objInventoryApi.updateLocation = function(sLocationKey, sSerializedData, sCallbackFunction) {
    // POST https://api.ebay.com/sell/inventory/v1/location/{merchantLocationKey}/update_location_details
    this.makeCall('post', objInventoryApi.sApiName, 'location', sLocationKey+'/update_location_details', sSerializedData, sCallbackFunction);
  };
  
  objInventoryApi.getInventoryItems = function(nLimit, nOffset, sCallbackFunction) {
    // GET https://api.ebay.com/sell/inventory/v1/inventory_item?limit=string&offset=string
    this.makeCall('get', objInventoryApi.sApiName, 'inventory_item', '', {limit: nLimit, offset:nOffset}, sCallbackFunction);
  };
  
  objInventoryApi.createOrUpdateInventoryItem = function(sProductCode, sSerializedData, sCallbackFunction) {
    this.makeCall('put', objInventoryApi.sApiName, 'inventory_item', sProductCode, sSerializedData, sCallbackFunction);
  };
  
  return objInventoryApi;
});