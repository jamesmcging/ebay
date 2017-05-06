define(['jquery', 
  'modules/tabs/tab',
  'modules/panels/ebaycataloguelistingPanel'], 
  function(nsc, 
  objTab,
  objEbayCatalogueListingPanel) {
   
  var objEbayCatalogue = {};

  objEbayCatalogue.__proto__ = objTab;
  
  objEbayCatalogue.sName = 'eBay Catalogue';
  objEbayCatalogue.sCode = 'ebayCatalogue';
  
  objEbayCatalogue.objChildPanels = {
    listingpanel : objEbayCatalogueListingPanel
  };

  objEbayCatalogue.getPanelContent = function() {    
    var sHTML = '';
    for (var sPanelCode in objEbayCatalogue.objChildPanels) {
      sHTML += objEbayCatalogue.objChildPanels[sPanelCode].getPanelContent();
    }
    
    return sHTML;
  };
  
  objEbayCatalogue.setListeners = function() {
    for (var sPanelCode in objEbayCatalogue.objChildPanels) {
      objEbayCatalogue.objChildPanels[sPanelCode].setListeners();
    }  
  };
  
  objEbayCatalogue.initialize = function() {
    for (var sPanelCode in objEbayCatalogue.objChildPanels) {
      objEbayCatalogue.objChildPanels[sPanelCode].initialize();
    }
  };
  
  return objEbayCatalogue;
});