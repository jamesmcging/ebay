define(['jquery',
    'modules/panels/panel'], function(nsc, objPanel) {
    
  var objTab = {};
  
  objTab.__proto__ = objPanel;
  
  objTab.sName = 'Default Panel Name';
  objTab.sCode = 'default_panel_code';
  
  objTab.initialize = function() {};
  
  objTab.render = function() {    
    nsc('#'+this.sCode+'-panel').replaceWith(this.getPanelMarkup());
    this.setListeners();
  };
  
  objTab.getPanelMarkup = function() {
    var sHTML = '';
    sHTML = '<div class="tab-pane active" id="'+this.sCode+'-panel">';
    sHTML += this.getPanelContent();
    sHTML += '</div>';
    return sHTML;
  };
  
  objTab.getPanelContent = function() {
    var sHTML = '';
    sHTML += this.sName;
    return sHTML;
  };
  
  objTab.setListeners = function() {};
  
  return objTab;
});