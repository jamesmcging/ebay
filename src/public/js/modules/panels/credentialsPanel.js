define(['jquery', 'modules/panels/statusPanel'], function(nsc, objStatusPanel) {
   
  var objCredentialsPanel = {};

  objCredentialsPanel.__proto__ = objStatusPanel;
  
  objCredentialsPanel.sName = 'Credentials';
  objCredentialsPanel.sCode = 'credentialspanel';

  objCredentialsPanel.objChildPanels = {};
  
  objCredentialsPanel.initialize = function() {
    nsc('#credential-panel-status').html('<p>Updating</p>');
    /* Ask the server if we have an eBay token */    
    var jqxhr = nsc.ajax({
      url      : '/authorization/status',
      data     : {},
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {

      objCredentialsPanel.objSettings.nStatus = responsedata['ebay_authorization_status'];
      
      objCredentialsPanel.objSettings.bActive = (objCredentialsPanel.objSettings.nStatus === 4) ? true : false;
      
      objCredentialsPanel.render();
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
  };
  
  objCredentialsPanel.getPanelContent = function() {
    
    var sActiveClass = (this.objSettings.bActive) ? 'status-panel-active' : 'status-panel-inactive';    
    
    var sHTML = '';
    
    sHTML += '<div class="panel panel-default status-panel '+sActiveClass+'" id="'+this.sCode+'">';
    sHTML += '<h3>'+this.sName+'</h3>';
    
    sHTML += '<p id="credential-panel-status">';
    if (this.objSettings.bActive) {
      sHTML += 'Credentials valid, able to talk to eBay on your behalf.';
    } else {
      sHTML += 'Click to login to eBay and give us permission to act on your behalf.';
    }
    sHTML += '</p>';
    
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objCredentialsPanel.setListeners = function() {
    nsc('#'+this.sCode).off().on('click', function() {
      objCredentialsPanel.showModal();
      objCredentialsPanel.setListeners();
    });
    
    nsc('#ebay-sign-in').on('click', function() {
      window.location="/authorization/access";
    });    
  };
  
  objCredentialsPanel.getModalBodyMarkup = function() {
    var sHTML = '';
    if (objCredentialsPanel.objSettings.bActive) {
      sHTML += '<p>You have authenticated with eBay, this app can now talk to eBay.</p>';
    } else {
      sHTML += '<p>You need to tell eBay to give us permission to act on your behalf. Click the sign-in button below. This will redirect you to eBay where you will be asked to give this app permission to act on your behalf. When you complete that process it will bring you back here.</p>';
      sHTML += '<button class="btn btn-primary" id="ebay-sign-in">Sign in</button>';
    }
    return sHTML;
  };
  
  return objCredentialsPanel;
});