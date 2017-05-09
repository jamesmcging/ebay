define(['jquery', 
  'modules/tabs/tab',
  'modules/panels/summaryPanel',
  'modules/panels/credentialsPanel', 
  'modules/panels/locationsPanel',
  'modules/panels/datamappingPanel',
  'modules/panels/returnpolicyPanel'
],
function(nsc, 
  objTab, 
  objSummaryPanel, 
  objCredentialsPanel, 
  objLocationsPanel, 
  objDatamappingPanel,
  objReturnsPanel
) {
   
  var objDashboard = {};

  objDashboard.__proto__ = objTab;
  
  objDashboard.sName = 'Dashboard';
  objDashboard.sCode = 'dashboard';
  
  objDashboard.objSettings.bFirstShow = true;
  
  objDashboard.objChildPanels = {
    summarypanel     : objSummaryPanel,
    credentialspanel : objCredentialsPanel,
    locationspanel   : objLocationsPanel,
    datamappingpanel : objDatamappingPanel,
    returnpoliciespanel : objReturnsPanel
  };
  objDashboard.objStatusPanels = {
    credentialspanel    : objCredentialsPanel,
    locationspanel      : objLocationsPanel,
    datamappingpanel    : objDatamappingPanel,
    returnpoliciespanel : objReturnsPanel
  };  
  
  objDashboard.initialize = function() {
    for (var sPanelCode in objDashboard.objChildPanels) {
      objDashboard.objChildPanels[sPanelCode].initialize();
    }
  };
  
  objDashboard.getPanelContent = function() {
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    /* The main panel area*/
    sHTML += '<div class="col-md-8">';
    if (objDashboard.objSettings.bFirstShow) {
      sHTML += objDashboard.getWelcomePanelMarkup();
    }
    sHTML += objSummaryPanel.getPanelMarkup();
    sHTML += '</div><!-- .col-md-8 -->';
    
    /* The right hand side panel */
    sHTML += '<div class="col-md-4">';
    for (var sPanelCode in objDashboard.objStatusPanels) {
      sHTML += objDashboard.objStatusPanels[sPanelCode].getPanelMarkup();
    }
    sHTML += '</div><!-- .col-md-4 -->';
    
    sHTML += '</div><!-- .row -->';
    
    return sHTML;
  };
  
  objDashboard.setListeners = function() {
    for (var sPanelCode in objDashboard.objChildPanels) {
      objDashboard.objChildPanels[sPanelCode].setListeners();
    }
  };
  
  objDashboard.getWelcomePanelMarkup = function() {
    var sHTML = '';
      
    sHTML += '<div class="panel panel-default">';
    sHTML += '<div class="panel-heading">';
    sHTML += '<b>Welcome</b> to your eBay management app!';
    sHTML += '</div>';
    sHTML += '<div class="panel-body">';
    sHTML += '<p>Use this dashboard to set up and manage your eBay account. Panels that are red need attention, simply click on them. Panels that are green indicate working functionality.</p>';
    sHTML += '</div>';
    sHTML += '</div>';

    objDashboard.objSettings.bFirstShow = false;

    return sHTML;
  };
  
  return objDashboard;
});