define(['jquery', 
  'modules/panels/panel'
  ], 
  function(nsc, 
  objPanel
  ) {
   
  var objStoreCatalogueListingPanel = {};

  objStoreCatalogueListingPanel.__proto__ = objPanel;
  
  objStoreCatalogueListingPanel.sName = 'Store Catalogue Listing Panel';
  objStoreCatalogueListingPanel.sCode = 'storecataloguelistingpanel';

  objStoreCatalogueListingPanel.objChildPanels = {};
  
  objStoreCatalogueListingPanel.objSettings.bActive = false;
  
  objStoreCatalogueListingPanel.initialize = function() {};
  
  objStoreCatalogueListingPanel.getPanelContent = function() {
    var sHTML = '';
    
    sHTML += '<div>';
    sHTML += '<h3>'+this.sName+'</h3>';
    sHTML += '</div>';

    return sHTML;
  };
  
  objStoreCatalogueListingPanel.setListeners = function() {};
  
  return objStoreCatalogueListingPanel;
});