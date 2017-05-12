define(['jquery'], function(nsc) {
  var objPanel = {};
  
  objPanel.sName = 'Default Panel Name';
  objPanel.sCode = 'default_panel_code';
  objPanel.objSettings = {};
  
  objPanel.render = function() {
    nsc('#'+this.sCode+'-panel').replaceWith(this.getPanelMarkup());
    this.setListeners();
  };
  
  objPanel.getPanelMarkup = function() {
    var sHTML = '';
    sHTML += '<div id="'+this.sCode+'-panel">';
    sHTML += this.getPanelContent();
    sHTML += '</div>';
    return sHTML;
  };
  
  objPanel.getPanelContent = function() {
    var sHTML = '';
    sHTML += 'Panel name: '+this.sName;
    sHTML += 'Panel code: '+this.sCode;
    return sHTML;
  };
  
  objPanel.setListeners = function() {};
    
  objPanel.initialize = function() {};

  objPanel.showModal = function() {
    var sHTML = '';
    
    sHTML += '<div id="modal-anchor" class="modal fade" tabindex="-1" role="dialog">';
    sHTML += '  <div class="modal-dialog" role="document">';
    sHTML += '    <div class="modal-content">';
    sHTML += '      <div class="modal-header">';
    sHTML += this.getModalHeaderMarkup();
    sHTML += '      </div>';
    sHTML += '      <div class="modal-body">';
    sHTML += this.getModalBodyMarkup();
    sHTML += '      </div>';
    sHTML += '      <div class="modal-footer">';
    sHTML += this.getModalFooterMarkup();
    sHTML += '      </div>';
    sHTML += '    </div><!-- /.modal-content -->';
    sHTML += '  </div><!-- /.modal-dialog -->';
    sHTML += '</div><!-- /.modal-anchor -->';
    
    nsc('#modal-anchor').replaceWith(sHTML);
    nsc('#modal-anchor').modal('show');
  };
  
  objPanel.hideModal = function() {
    nsc('#modal-anchor').modal('hide');
  };
  
  objPanel.getModalHeaderMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<h4 class="modal-title">'+this.sName+'</h4>';
    return sHTML;
  };
  
  objPanel.getModalBodyMarkup = function() {
    return 'modal content needs overriden/ defined in the panel getModalBodyMarkup function';
  };
  
  objPanel.getModalFooterMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    return sHTML;
  };
  
  return objPanel;
});