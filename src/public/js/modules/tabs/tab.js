define(['jquery',
    'modules/panels/panel'], 
  function(nsc, 
    objPanel) {
    
  var objTab = {};
  
  objTab.__proto__ = objPanel;
  
  objTab.sName = 'Default Tab Name';
  objTab.sCode = 'default_tab_code';

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
  
  objTab.setListeners = function() {};
  
  objTab.initialize = function() {};
  
  objTab.getPanelContent = function() {
    var sHTML = '';
    sHTML += this.sName;
    return sHTML;
  };
  
  return objTab;
});