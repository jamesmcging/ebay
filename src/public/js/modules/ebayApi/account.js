define(['jquery', 
    'modules/ebayApi/restCaller'], 
  function(nsc, 
    objRestCaller) {
   
  var objAccountApi = {};

  objAccountApi.__proto__ = objRestCaller;
  
  objAccountApi.sApiName = 'account';
  
  //////////////////////////////////////////////////////////////////////////////
  //
  // Return Policies
  //
  //////////////////////////////////////////////////////////////////////////////
  objAccountApi.createReturnPolicy = function(objPolicyData, sCallbackFunction) {
    // POST https://api.ebay.com/sell/account/v1/return_policy
    this.makeCall('post', objAccountApi.sApiName, 'return_policy', '', objPolicyData, sCallbackFunction);
  };

  objAccountApi.deleteReturnPolicy = function(nPolicyId, objData, sCallbackFunction) {
    // DELETE https://api.ebay.com/sell/account/v1/return_policy/{nPolicyId}
    this.makeCall('delete', objAccountApi.sApiName, 'return_policy', nPolicyId, objData, sCallbackFunction);
  };
  
  objAccountApi.getReturnPoliciesByMarketplace = function(sMarketplaceId, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy?marketplace_id=MarketplaceIdEnum
    this.makeCall('get', objAccountApi.sApiName, 'return_policy', '?marketplace_id='+sMarketplaceId, {}, sCallbackFunction);
  };
  
  objAccountApi.getReturnPolicyById = function(nPolicyId, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy/{nPolicyId}
    this.makeCall('get', objAccountApi.sApiName, 'return_policy', nPolicyId, {}, sCallbackFunction);
  };
  
  objAccountApi.getReturnPolicyByName = function(sPolicyName, sMarketplaceId, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy/get_by_policy_name?marketplace_id=MARKETPLACEID&name=STRING
    this.makeCall('get', objAccountApi.sApiName, 'return_policy', '?marketplace_id='+sMarketplaceId+'&name='+sPolicyName, {}, sCallbackFunction);
  };
  
  objAccountApi.updatePolicy = function(nPolicyId, objPolicyData, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy/{nPolicyId}
    this.makeCall('put', objAccountApi.sApiName, 'return_policy', nPolicyId, objPolicyData, sCallbackFunction);
  };
    
  return objAccountApi;
});