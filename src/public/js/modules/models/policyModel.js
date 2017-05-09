define([
  'jquery', 
  'modules/ebayApi/account'],
  function(
    nsc, 
    objAccountApi
  ) {
   
  /* Keyed on policy type followed by marketplaceid, followed by policy id */
  var objPolicyModel = {};
  
  objPolicyModel.objPolicies = {
    returnPolicies   : {},
    paymentPolicies  : {},
    shipmentPolicies : {}
  };
  
  objPolicyModel.initialize = function() {};
  
  objPolicyModel.setListeners = function() {};

  //////////////////////////////////////////////////////////////////////////////
  // 
  // Calls to local model
  // 
  //////////////////////////////////////////////////////////////////////////////
  objPolicyModel.getReturnPoliciesByMarketplace = function(sLocationKey) {
    var response = false;
    if (typeof objPolicyModel.objPolicies.returnPolicies[sLocationKey] !== 'undefined') {
      response = objPolicyModel.objPolicies.returnPolicies[sLocationKey];
    }
    
    return response;
  };


  //////////////////////////////////////////////////////////////////////////////
  // 
  // Calls to eBay
  // 
  //////////////////////////////////////////////////////////////////////////////
  objPolicyModel.createPolicy = function(objPolicyData) {
    objAccountApi.createReturnPolicy(objPolicyData, objPolicyModel.createPolicyRestResponse);
  };
  
  objPolicyModel.createPolicyRestResponse = function(objData) {
    console.log('objPolicyModel.createPolicyRestResponse not yet implemented');
    console.log(objData);
  };
  
  objPolicyModel.deletePolicy = function(nPolicyId) {
    objAccountApi.deleteReturnPolicy(nPolicyId, objPolicyModel.deletePolicyRestResponse);
  };
  
  objPolicyModel.deletePolicyRestResponse = function(objData) {
    console.log('objPolicyModel.deletePolicyRestResponse not yet implemented');
    console.log(objData);
  };
  
  objPolicyModel.getReturnPoliciesByMarketplaceFromEbay = function(sLocationKey) {
    objAccountApi.getReturnPoliciesByMarketplace(sLocationKey, objPolicyModel.getReturnPoliciesByMarketplaceRestResponse);
  };
  
  objPolicyModel.getReturnPoliciesByMarketplaceRestResponse = function(objData) {
    console.log(objData);
    if (objData.nResponseCode === 200) {
      if (objData.sResponseMessage.total > 0) {
        for (var sPolicyId in objData.sResponseMessage.returnPolicies) {
          objPolicyModel.objPolicies.returnPolicies[sMarketplaceId][sPolicyId] = objData.sResponseMessage.returnPolicies[sPolicyId];
        }
      }
      nsc(document).trigger('returnpoliciesfetched', [objData.sResponseMessage.total]);
    } else {
      nsc(document).trigger('failedtofetchreturnpolicies', ['Fetch return policies', objData.sResponseMessage]);
    }
  };
  
  objPolicyModel.updatePolicy = function(nPolicyId, objPolicyData) {
    objAccountApi.updatePolicy(nPolicyId, objPolicyData, objPolicyModel.updatePolicyRestResponse);
  };
  
  objPolicyModel.updatePolicyRestResponse = function(objData) {
    console.log('objPolicyModel.updatePolicyRestResponse not yet implemented');
    console.log(objData);
  };
    
  return objPolicyModel;
});