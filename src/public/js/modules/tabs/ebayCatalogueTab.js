define(['jquery', 'modules/tabs/tab'], function(nsc, objTab) {
   
  var objEbayCatalogue = {};

  objEbayCatalogue.__proto__ = objTab;
  
  objEbayCatalogue.sName = 'eBay Catalogue';
  objEbayCatalogue.sCode = 'ebayCatalogue';
  
  objEbayCatalogue.initialize = function() {};
  
  objEbayCatalogue.getPanelContent = function() {};
  
  objEbayCatalogue.setListeners = function() {};
  
  return objEbayCatalogue;
});