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
  
  return objStatusPanel;
});