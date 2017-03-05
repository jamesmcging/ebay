define(['jquery', 'modules/panels/statusPanel'], function(nsc, objStatusPanel) {
   
  var objLocationsPanel = {};

  objLocationsPanel.__proto__ = objStatusPanel;
  
  objLocationsPanel.sName = 'Locations';
  objLocationsPanel.sCode = 'locationspanel';

  objLocationsPanel.objChildPanels = {};
  
  objLocationsPanel.initialize = function() {};
  
  objStatusPanel.getPanelContent = function() {
    
    var sActiveClass = (this.objSettings.bActive) ? 'status-panel-active' : 'status-panel-inactive';    
    
    var sHTML = '';
    
    sHTML += '<div class="panel panel-default status-panel '+sActiveClass+'" id="'+this.sCode+'">';
    sHTML += '<h3>'+this.sName+'</h3>';
    sHTML += '<p>set-up or modify</p>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objLocationsPanel.setListeners = function() {};
  
  return objLocationsPanel;
});