define(['jquery'], function(nsc) {
   
  var objEbayAuthorizationModel = {};

  objEbayAuthorizationModel.nStatus = 1;
  
  objEbayAuthorizationModel.initialize = function() {
    objEbayAuthorizationModel.updateStatus();
  };
  
  objEbayAuthorizationModel.updateStatus = function() {

    /* Ask the server if we have an eBay token */    
    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sStoreURL+'/authorization/status',
      data     : {},
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      objEbayAuthorizationModel.nStatus = responsedata['ebay_authorization_status'];
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    jqxhr.always(function() {
      /* We announce this momentious event so other panels can start their work */
      nsc(document).trigger('credentialsPanelUpdated', [objEbayAuthorizationModel.nStatus]);
    });
  };
  
  objEbayAuthorizationModel.getStatus = function() {
    return objEbayAuthorizationModel.nStatus;
  };
  
  return objEbayAuthorizationModel;
});