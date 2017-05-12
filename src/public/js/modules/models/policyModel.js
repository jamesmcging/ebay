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
    returnPolicies   : {
      newPolicy : {
        categoryTypes : {
          default : true,
          name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
        },
        description : 'Enter a short description of your return policy including: how quickly you will refund and whether you require the items before refunding. (max 250 characters)',
        extendedHolidayReturnsOffered : false,
        marketplaceId : 'EBAY_US',
        name : 'Default Return Policy',
        refundMethod : 'MONEY_BACK',
        restockingFeePercentage : '0.0',
        returnInstructions : 'Enter a detailed description of your return policy (max 5000 characters)',
        returnMethod : 'EXCHANGE',
        returnPeriod : {
          unit : 'DAY',
          value : 14
        },
        returnsAccepted : true,
        returnShippingCostPayer : 'BUYER'
      }
    },
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
  
  objPolicyModel.getPolicyById = function(sPolicyType, nPolicyId) {
    var sMarketplaceId = nsc('#marketplace-selector').val();
    var objResponse = {};
    
    if (typeof sPolicyType !== 'undefined' 
          && typeof sMarketplaceId !== 'undefined' 
          && typeof nPolicyId !== 'undefined'
          && typeof objPolicyModel.objPolicies[sPolicyType][sMarketplaceId][nPolicyId] !== 'undefined') {
      objResponse = objPolicyModel.objPolicies[sPolicyType][sMarketplaceId][nPolicyId];
    } else {
      objResponse = objPolicyModel.objPolicies[sPolicyType].newPolicy;
    }
    
    return objResponse;
  };


  //////////////////////////////////////////////////////////////////////////////
  // 
  // Calls to eBay
  // 
  //////////////////////////////////////////////////////////////////////////////
  objPolicyModel.createPolicy = function(sPolicyType, objFormData) {
    switch (sPolicyType)  {
      case 'returnPolicies' : 
        var objPolicy = {
          categoryTypes : [{
            default : true,
            name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
          }],
          description : objFormData.description,
          extendedHolidayReturnsOffered : false,
          marketplaceId : objFormData.marketplaceId,
          name : objFormData.name,
          refundMethod : objFormData.refundMethod,
          restockingFeePercentage : objFormData.restockingFeePercentage,
          returnInstructions : objFormData.returnInstructions,
          returnMethod : objFormData.returnMethod,
          returnPeriod : {
            unit : objFormData.returnsPeriodUnit,
            value : objFormData.returnsPeriodValue
          },
          returnsAccepted : objFormData.returnsAccepted,
          returnShippingCostPayer : objFormData.returnShippingCostPayer
        };

        objAccountApi.createReturnPolicy(objPolicy, objPolicyModel.createPolicyRestResponse);
        break;
        
      default:
        nsc(document).trigger('unrecognisedpolicytype', [{sPolicyType: sPolicyType}]);
    }
  };
  
  objPolicyModel.createPolicyRestResponse = function(objData) {
    if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('policycreationerror', [objData.sResponseMessage.errors]);
    } else if (objData.nResponseCode === 201) {
      var sMarketplaceId = nsc('#marketplace-selector').val();
      var nPolicyId = objData.sResponseMessage.returnPolicyId;
      objPolicyModel.objPolicies.returnPolicies[sMarketplaceId][nPolicyId] = objData.sResponseMessage;
      nsc(document).trigger('policycreated', [{nPolicyId: nPolicyId}]);
    }
  };
  
  objPolicyModel.deletePolicy = function(sPolicyType, nPolicyId) {
    switch (sPolicyType) {
      case 'returnPolicies' :
        var sMarketplaceId = nsc('#marketplace-selector').val();
        var objData = {sPolicyType: sPolicyType, sMarketplaceId: sMarketplaceId, nPolicyId: nPolicyId};
        objAccountApi.deleteReturnPolicy(nPolicyId, objData, objPolicyModel.deletePolicyRestResponse);
        break;
    }
  };
  
  objPolicyModel.deletePolicyRestResponse = function(objData) {
    console.log(objData);
    if (objData.nResponseCode === 204) {
      delete objPolicyModel.objPolicies[objData.arrParams.sPolicyType][objData.arrParams.sMarketplaceId][objData.arrParams.nPolicyId];
      nsc(document).trigger('policydeleted', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    } else if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('failedtodeletepolicy', [{arrErrors:objData.sResponseMessage.errors, sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);      
    } else {
      nsc(document).trigger('failedtodeletepolicy', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    }
  };
  
  objPolicyModel.getReturnPoliciesByMarketplaceFromEbay = function(sLocationKey) {
    objAccountApi.getReturnPoliciesByMarketplace(sLocationKey, objPolicyModel.getReturnPoliciesByMarketplaceRestResponse);
  };
  
  objPolicyModel.getReturnPoliciesByMarketplaceRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      if (objData.sResponseMessage.total > 0) {
        for (var nKey in objData.sResponseMessage.returnPolicies) {
          var sMarketplaceId = objData.sResponseMessage.returnPolicies[nKey].marketplaceId;
          
          /* Ensure that we have an entry for this marketplace so we can insert
           * a policy into it. */
          if (typeof objPolicyModel.objPolicies.returnPolicies[sMarketplaceId] === 'undefined') {
            objPolicyModel.objPolicies.returnPolicies[sMarketplaceId] = {};
          }
          
          var nPolicyId = objData.sResponseMessage.returnPolicies[nKey].returnPolicyId;
          objPolicyModel.objPolicies.returnPolicies[sMarketplaceId][nPolicyId] = objData.sResponseMessage.returnPolicies[nKey];
        }
      }
      nsc(document).trigger('returnpoliciesfetched', [objData.sResponseMessage.total]);
    } else {
      nsc(document).trigger('failedtofetchreturnpolicies', ['Fetch return policies', objData.sResponseMessage]);
    }
  };
  
  objPolicyModel.updatePolicy = function(sPolicyType, nPolicyId, objFormData) {
    switch (sPolicyType) {
      case 'returnPolicies':
        var objUpdatedPolicy = {
          categoryTypes : [{
            default : true,
            name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
          }],
          description : objFormData.description,
          extendedHolidayReturnsOffered : false,
          marketplaceId : objFormData.marketplaceId,
          name : objFormData.name,
          refundMethod : objFormData.refundMethod,
          restockingFeePercentage : objFormData.restockingFeePercentage,
          returnInstructions : objFormData.returnInstructions,
          returnMethod : objFormData.returnMethod,
          returnPeriod : {
            unit : objFormData.returnsPeriodUnit,
            value : objFormData.returnsPeriodValue
          },
          returnsAccepted : objFormData.returnsAccepted,
          returnShippingCostPayer : objFormData.returnShippingCostPayer
        };

        objAccountApi.updatePolicy(nPolicyId, objUpdatedPolicy, objPolicyModel.updatePolicyRestResponse);
        break;
    }
  };
  
  objPolicyModel.updatePolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      var nProductId = objData.sResponseMessage.returnPolicyId;
      nsc(document).trigger('policyupdated', [{nPolicyId:nProductId}])
    } else {
      nsc(document).trigger('policyupdatefailed');
    }
  };
    
  return objPolicyModel;
});