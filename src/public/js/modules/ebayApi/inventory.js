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
    console.log('objInventoryApi.getLocations called');
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

  return objInventoryApi;
});