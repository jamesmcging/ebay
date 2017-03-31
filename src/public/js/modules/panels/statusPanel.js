define(['jquery', 'modules/panels/panel'], function(nsc, objPanel) {
   
  var objStatusPanel = {};

  objStatusPanel.__proto__ = objPanel;
  
  objStatusPanel.sName = 'Credentials';
  objStatusPanel.sCode = 'credentialspanel';
  objStatusPanel.objSettings.bActive = false;
  
  objStatusPanel.objChildPanels = {};
  
  objStatusPanel.initialize = function() {};
  
  objStatusPanel.getPanelContent = function() {
    
    var sActiveClass = (this.objSettings.bActive) ? 'status-panel-active' : 'status-panel-inactive';
    
    var sHTML = '';
    
    sHTML += '<div class="panel panel-default status-panel '+sActiveClass+'" id="'+this.sCode+'">';
    sHTML += '<h3>'+this.sName+'</h3>';
    sHTML += '<p>set-up or modify</p>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objStatusPanel.setListeners = function() {};
  
  objStatusPanel.render = function() {
    objPanel.render();
    
    if (objStatusPanel.objSettings.bActive) {
      this.setActive();
    } else {
      this.setInactive();
    }
    
  };
  
  objStatusPanel.getPanelMarkup = function() {
    var sHTML = '';
    sHTML += '<div id="'+this.sCode+'-panel" class="status-panel">';
    sHTML += this.getPanelContent();
    sHTML += '</div>';
    return sHTML;
  };
  
  objStatusPanel.setActive = function() {
    nsc('#'+this.sCode+'-panel').removeClass();
    nsc('#'+this.sCode+'-panel').addClass('panel status-panel status-panel-active');
    
    nsc('#'+this.sCode+'-status-icon').removeClass();
    nsc('#'+this.sCode+'-status-icon').addClass('status-panel-icon fa fa-3x fa-check');
  };
  
  objStatusPanel.getIsPanelActive = function() {
    return objStatusPanel.objSettings.bActive;
  };
  
  objStatusPanel.setInactive = function() {
    nsc('#'+this.sCode+'-panel').removeClass();
    nsc('#'+this.sCode+'-panel').addClass('panel status-panel status-panel-inactive');
    
    nsc('#'+this.sCode+'-status-icon').removeClass();
    nsc('#'+this.sCode+'-status-icon').addClass('status-panel-icon fa fa-3x fa-times');
  };
  
  objStatusPanel.setUpdating = function() {
    nsc('#'+this.sCode+'-panel').removeClass();
    nsc('#'+this.sCode+'-panel').addClass('panel status-panel status-panel-updating');
    
    nsc('#'+this.sCode+'-status-icon').removeClass();
    nsc('#'+this.sCode+'-status-icon').addClass('status-panel-icon fa fa-3x fa-refresh fa-spin fa-fw');
    
    nsc('#'+this.sCode+'-status-text').html('Updating...');
  };
  
  objStatusPanel.getSettings = function() {
    return this.objSettings;
  };
  
  return objStatusPanel;
});