define(['jquery', 'modules/panels/panel'], function(nsc, objPanel) {
   
  var objStatusPanel = {};

  objStatusPanel.__proto__ = objPanel;
  
  objStatusPanel.sName = 'Generic Status Panel Name';
  objStatusPanel.sCode = 'genericstatuspanel';
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
    
    if (this.objSettings.bActive) {
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
  
  objStatusPanel.setActive = function(sMessage) {
//    console.log('objStatusPanel.setActive('+this.sCode+')');
    
    this.objSettings.bActive = true;
    
    nsc('#'+this.sCode+'-panel').removeClass();
    nsc('#'+this.sCode+'-panel').addClass('panel status-panel status-panel-active');
    
    nsc('#'+this.sCode+'-status-icon').removeClass();
    nsc('#'+this.sCode+'-status-icon').addClass('status-panel-icon fa fa-3x fa-check');
    
    if (sMessage) {
      nsc('#'+this.sCode+'-status-text').text(sMessage);
    }  
  };
  
  objStatusPanel.getIsPanelActive = function() {
    return this.objSettings.bActive;
  };
  
  objStatusPanel.setInactive = function(sMessage) {
//    console.log('objStatusPanel.setInactive('+this.sCode+')');
    this.objSettings.bActive = false;
    
    nsc('#'+this.sCode+'-panel').removeClass();
    nsc('#'+this.sCode+'-panel').addClass('panel status-panel status-panel-inactive');
    
    nsc('#'+this.sCode+'-status-icon').removeClass();
    nsc('#'+this.sCode+'-status-icon').addClass('status-panel-icon fa fa-3x fa-times');
    
    if (sMessage) {
      nsc('#'+this.sCode+'-status-text').text(sMessage);
    }
  };
  
  objStatusPanel.setUpdating = function(sMessage) {
    this.objSettings.bActive = false;
    
    nsc('#'+this.sCode+'-panel').removeClass();
    nsc('#'+this.sCode+'-panel').addClass('panel status-panel status-panel-updating');
    
    nsc('#'+this.sCode+'-status-icon').removeClass();
    nsc('#'+this.sCode+'-status-icon').addClass('status-panel-icon fa fa-3x fa-refresh fa-spin fa-fw');
    
    if (sMessage) {
      nsc('#'+this.sCode+'-status-text').text(sMessage);
    } else {
      nsc('#'+this.sCode+'-status-text').text('Updating...');
    }
  };
  
  objStatusPanel.getSettings = function() {
    return this.objSettings;
  };
  
  return objStatusPanel;
});