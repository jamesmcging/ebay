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
    
    nsc('#loading-screen').remove();
    
    var sHTML = '';

    sHTML += getNavMarkup();
    
    sHTML += '<div id="main-alert-container">';
    sHTML += '  <div class="container">';
    sHTML += '    <div id="alert-div"></div>';
    sHTML += '  </div>';
    sHTML += '</div>';

    sHTML += '<div id="app-body">';

    sHTML += '<div class="container">';

    sHTML += '<div id="modal-anchor"></div>';

    sHTML += getTabMarkup();
    
    sHTML += getTabContentMarkup();
    
    sHTML += '</div><!-- .container -->';
    sHTML += '</div><!-- #app-body -->';
    
    
    nsc('body').append(sHTML);
  };
  
  objInterface.setListeners = function() {
    /* Handle the tabs being clicked */
    nsc('a[data-toggle="tab"]').on('show.bs.tab', function (event) {
      var sTabPanelCode = nsc(this).parent().data('tabpanel');
      objInterface.objNavTabs[sTabPanelCode].render();
      objInterface.objNavTabs[sTabPanelCode].initialize();
    });
    
    nsc('#marketplace-selector').on('change', function() {
      nsc(document).trigger('marketplace-changed', [this.value]);
    });
    
  };
  
  getNavMarkup = function() {
    var sHTML = '';

    sHTML += '<nav class="navbar navbar-default navbar-fixed-top">';
    sHTML += '  <div class="container">';
    sHTML += '    <div class="navbar-header">';
    sHTML += '      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">';
    sHTML += '        <span class="sr-only">Toggle navigation</span>';
    sHTML += '        <span class="icon-bar">a</span>';
    sHTML += '        <span class="icon-bar">b</span>';
    sHTML += '        <span class="icon-bar">c</span>';
    sHTML += '      </button>';
    sHTML += '      <a class="navbar-brand" href="#">eBay Prototype</a>';
    sHTML += '    </div>';
    sHTML += '    <div id="navbar" class="navbar-collapse collapse">';
//    sHTML += '      <ul class="nav navbar-nav">';
//    sHTML += '        <li><a href="#about">About</a></li>';
//    sHTML += '        <li><a href="#contact">Contact</a></li>';
//    sHTML += '        <li class="dropdown">';
//    sHTML += '          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>';
//    sHTML += '          <ul class="dropdown-menu">';
//    sHTML += '            <li><a href="#">Action</a></li>';
//    sHTML += '            <li><a href="#">Another action</a></li>';
//    sHTML += '            <li><a href="#">Something else here</a></li>';
//    sHTML += '            <li role="separator" class="divider"></li>';
//    sHTML += '            <li class="dropdown-header">Nav header</li>';
//    sHTML += '            <li><a href="#">Separated link</a></li>';
//    sHTML += '            <li><a href="#">One more separated link</a></li>';
//    sHTML += '          </ul>';
//    sHTML += '        </li>';
//    sHTML += '      </ul>';
    sHTML += '      <ul class="nav navbar-nav navbar-right">';
    sHTML += '        <li><a href="#">'+getMarketplaceSelectorMarkup()+'</a></li>';
    sHTML += '      </ul>';
    sHTML += '    </div><!--/.nav-collapse -->';
    sHTML += '  </div>';
    sHTML += '</nav>';
    
    return sHTML;
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

  getMarketplaceSelectorMarkup = function() {

    var sDefaultMarketplace = app.objModel.objDataMappings.getDefaultMarketplace();
    
    var objMarketplaces = {
      EBAY_CA : 'ebay.ca',
      EBAY_GB : 'ebay.co.uk',
      EBAY_IE : 'ebay.ie',
      EBAY_US : 'ebay.com'
    };
    var sHTML = '';
    sHTML += '<select id="marketplace-selector" class="form-control input-group-sm">';
    for (var sKey in objMarketplaces) {
      sHTML += '<option';
      sHTML += ' value="'+sKey+'"';
      if (sKey === sDefaultMarketplace) {
        sHTML += ' selected="selected"';
      }
      sHTML += '>';
      sHTML += objMarketplaces[sKey];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  };
  
  objInterface.displayAlert = function(sType, sMessage) {
    var sHTML = '';

    sHTML += '<div id="alert-inner" class="alert alert-'+sType+'">';
    sHTML += sMessage;
    sHTML += '  <button type="button" class="close" data-dismiss="alert">&times;</button>';
    sHTML += '</div>';

    nsc('#alert-div').html(sHTML);
    nsc('#alert-inner').delay(2000).fadeOut(1000);
  };
  
  return objInterface;
});