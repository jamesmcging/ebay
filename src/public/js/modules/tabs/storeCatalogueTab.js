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
  
  objStoreCatalogue.initialize = function() {
    
    /* Ensure the app has its authorization model */
    if (typeof app.objModel.objStoreCatalogueModel === 'undefined') {
      app.objModel.objStoreCatalogueModel = objStoreCatalogueModel;
      app.objModel.objStoreCatalogueModel.initialize();
    }
    
    for (var sPanelCode in objStoreCatalogue.objChildPanels) {
      objStoreCatalogue.objChildPanels[sPanelCode].initialize();
    }
  };
  
  objStoreCatalogue.getPanelContent = function() {
    var sHTML = '';
    sHTML += '<h3>Store Catalogue</h3>';
    sHTML += '<div>';
    for (var sPanelCode in objStoreCatalogue.objChildPanels) {
      sHTML += objStoreCatalogue.objChildPanels[sPanelCode].getPanelMarkup();
    }
    sHTML += '</div>';
    return sHTML;
  };
  
  objStoreCatalogue.setListeners = function() {};
  
  return objStoreCatalogue;
});