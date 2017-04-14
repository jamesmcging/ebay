define(['jquery', 'modules/tabs/tab'], function(nsc, objTab) {
   
  var objTools = {};

  objTools.__proto__ = objTab;
  
  objTools.sName = 'eBay Tools';
  objTools.sCode = 'tools';
  
  objTools.initialize = function() {};
  
  objTools.getPanelContent = function() {
    var sHTML = '';
    sHTML += '<a href="/store/marketplace">Get marketplace data</a>';
    return sHTML;
  };
  
  objTools.setListeners = function() {};
  
  return objTools;
});