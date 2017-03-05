define(['jquery', 'modules/panels/statusPanel'], function(nsc, objStatusPanel) {
   
  var objPoliciesPanel = {};

  objPoliciesPanel.__proto__ = objStatusPanel;
  
  objPoliciesPanel.sName = 'Policies';
  objPoliciesPanel.sCode = 'policiespanel';
  
  objPoliciesPanel.objChildPanels = {};
  
  objPoliciesPanel.initialize = function() {};
  
  objStatusPanel.getPanelContent = function() {
    
    var sActiveClass = (this.objSettings.bActive) ? 'status-panel-active' : 'status-panel-inactive';    
    
    var sHTML = '';
    
    sHTML += '<div class="panel panel-default status-panel '+sActiveClass+'" id="'+this.sCode+'">';
    sHTML += '<h3>'+this.sName+'</h3>';
    sHTML += '<p>set-up or modify</p>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objPoliciesPanel.setListeners = function() {};
  
  return objPoliciesPanel;
});