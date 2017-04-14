// Start the main app logic.
define(['jquery',
  'modules/panels/panel', 
  'modules/tabs/dashboardTab', 
  'modules/tabs/storeCatalogueTab', 
  'modules/tabs/ebayCatalogueTab', 
  'modules/tabs/ebayListingsTab', 
  'modules/tabs/ebayOrdersTab',
  'modules/tabs/toolsTab'
],
function(nsc, 
  objPanel, 
  objDashboard, 
  objStoreCatalogue, 
  objEbayCatalogue, 
  objEbayListings, 
  objEbayOrders,
  objTools
) {

  var objInterface = {};
  objInterface.__proto__ = objPanel;

  objInterface.sName = 'Interface';
  objInterface.sCode = 'interface';
  objInterface.objNavTabs = {
    dashboard      : objDashboard,
    storeCatalogue : objStoreCatalogue,
    ebayCatalogue  : objEbayCatalogue,
    ebayListings   : objEbayListings,
    orders         : objEbayOrders,
    tools          : objTools
  };
  
  objInterface.render = function() {
    
    var sHTML = '';
    
    sHTML += '<div id="app-body" class="container">';
    sHTML += '  <h1>eBay Prototype</h1>';
    sHTML += '  <div id="modal-anchor"></div>';
    
    sHTML += getTabMarkup();
    
    sHTML += getTabContentMarkup();
    
    sHTML += '</div>';
    
    nsc('body').append(sHTML);
  };
  
  objInterface.setListeners = function() {
    /* Handle the tabs being clicked */
    nsc('a[data-toggle="tab"]').on('show.bs.tab', function (event) {
      var sTabPanelCode = nsc(this).parent().data('tabpanel');
      objInterface.objNavTabs[sTabPanelCode].render();
      objInterface.objNavTabs[sTabPanelCode].initialize();
    });
    
  };
  
  getTabMarkup = function() {
    var sHTML = '';
    
    /* Tabs representing the primary navigation */
    sHTML += '<ul class="nav nav-tabs" id="main-nav">';
    for (var sTab in objInterface.objNavTabs) {
      sHTML += '<li data-tabpanel="'+objInterface.objNavTabs[sTab].sCode+'">';
      sHTML += '<a href="#'+objInterface.objNavTabs[sTab].sCode+'-panel" data-toggle="tab">';
      sHTML += objInterface.objNavTabs[sTab].sName;
      sHTML += '</a>';
      sHTML += '</li>';
    }
    sHTML += '</ul>';
    
    return sHTML;
  };
  
  getTabContentMarkup = function() {
    var sHTML = '';
    
    /* Content divs containing the different tab content */
    sHTML += '<div class="tab-content">';
    for (var sTab in objInterface.objNavTabs) {
      sHTML += '<div class="tab-pane" id="'+objInterface.objNavTabs[sTab].sCode+'-panel">';
      sHTML += objInterface.objNavTabs[sTab].sName;
      sHTML += '</div>';
    }
    sHTML += '</div>';
    
    return sHTML;
  };
  
  return objInterface;
});