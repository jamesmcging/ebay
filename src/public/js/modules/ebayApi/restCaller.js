define(['jquery'], function(nsc) {
   
  var objRestApi = {};
    
  /**
   * 
   * @param {string} sMethod
   * @param {string} sApiName
   * @param {string} sResource
   * @param {string} sResourceId
   * @param {string} objCallParams
   * @param {string} sCallBackFunction
   * @returns {undefined}
   */
  objRestApi.makeCall = function(sMethod, sApiName, sResource, sResourceId, objCallParams, sCallBackFunction) {

    var objParams = {
      setMethod     : sMethod,
      setApiName    : sApiName,
      setApiVersion : 1,
      setResource   : sResource,
      setResourceId : sResourceId,
      setApiParams  : objCallParams
    };

    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sStoreURL+'/ebay/',
      data     : objParams,
      dataType : 'json',
      type     : 'get'
    });

    jqxhr.done(function(responsedata) {
      responsedata.bOutcome = true;
      sCallBackFunction(responsedata, sResourceId, objCallParams);
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
      xhr.bOutcome = false;
      sCallBackFunction(xhr, sResourceId, objCallParams);
    });
  };

  return objRestApi;
});