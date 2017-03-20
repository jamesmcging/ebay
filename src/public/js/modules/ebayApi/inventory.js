define(['jquery', 'modules/ebayApi/restCaller'], function(nsc, objRestCaller) {
   
  var objInventoryApi = {};

  objInventoryApi.__proto__ = objRestCaller;
  
  objInventoryApi.sApiName = 'inventory';
    
  objInventoryApi.getLocations = function(sCallbackFunction) {
    return this.makeCall('get', objInventoryApi.sApiName, 'location', [], sCallbackFunction);
  };

  return objInventoryApi;
});