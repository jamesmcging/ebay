define(['jquery', 
  'modules/tabs/tab',
  'modules/models/storeCatalogueModel',
  'modules/panels/storecataloguefilterPanel',
  'modules/panels/storecataloguelistingPanel'
  ], 
  function(nsc, 
  objTab,
  objStoreCatalogueModel,
  objStoreCatalogueFilterPanel,
  objStoreCatalogueListingPanel
  ) {
  
  var objStoreCatalogue = {};

  objStoreCatalogue.__proto__ = objTab;
  
  objStoreCatalogue.sName = 'Store Catalogue';
  objStoreCatalogue.sCode = 'storeCatalogue';
  
  objStoreCatalogue.objChildPanels = {
    filterpanel  : objStoreCatalogueFilterPanel,
    listingpanel : objStoreCatalogueListingPanel
  };
  
  objStoreCatalogue.getPanelContent = function() {
    /* Ensure the panel has its model */
    if (typeof app.objModel.objStoreCatalogueModel === 'undefined') {
      app.objModel.objStoreCatalogueModel = objStoreCatalogueModel;
      app.objModel.objStoreCatalogueModel.initialize();
    }
    
    var sHTML = '';
    for (var sPanelCode in objStoreCatalogue.objChildPanels) {
      sHTML += objStoreCatalogue.objChildPanels[sPanelCode].getPanelMarkup();
    }
    
    return sHTML;
  };
  
  objStoreCatalogue.setListeners = function() {
    for (var sPanelCode in objStoreCatalogue.objChildPanels) {
      objStoreCatalogue.objChildPanels[sPanelCode].setListeners();
    }    
  };
    
  objStoreCatalogue.initialize = function() {
    for (var sPanelCode in objStoreCatalogue.objChildPanels) {
      objStoreCatalogue.objChildPanels[sPanelCode].initialize();
    }
  };
 
  return objStoreCatalogue;
});