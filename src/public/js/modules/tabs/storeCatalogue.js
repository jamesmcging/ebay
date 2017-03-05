define(['jquery', 'modules/tabs/tab'], function(nsc, objTab) {
  
  var objStoreCatalogue = {};

  objStoreCatalogue.__proto__ = objTab;
  
  objStoreCatalogue.sName = 'Store Catalogue';
  objStoreCatalogue.sCode = 'storeCatalogue';
  
  objStoreCatalogue.initialize = function() {};
  
  objStoreCatalogue.getPanelContent = function() {};
  
  objStoreCatalogue.setListeners = function() {};
  
  return objStoreCatalogue;
});