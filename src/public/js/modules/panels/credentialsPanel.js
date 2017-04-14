define(['jquery', 
  'modules/panels/statusPanel',
  'modules/models/ebayAuthorizationModel'
  ], 
  function(nsc, 
  objStatusPanel,
  objEbayAuthorizationPanel
  ) {
   
  var objCredentialsPanel = {};

  objCredentialsPanel.__proto__ = objStatusPanel;
  
  objCredentialsPanel.sName = 'Credentials';
  objCredentialsPanel.sCode = 'credentialspanel';

  objCredentialsPanel.objChildPanels = {};
  
  objCredentialsPanel.objSettings.bActive = false;
  
  objCredentialsPanel.initialize = function() {
    objCredentialsPanel.setUpdating('Updating...');
    
    /* Ensure the app has its authorization model */
    if (typeof app.objModel.objEbayAuthorization === 'undefined') {
      app.objModel.objEbayAuthorization = objEbayAuthorizationPanel
    }
    
    app.objModel.objEbayAuthorization.updateStatus();
  };
  
  objCredentialsPanel.getPanelContent = function() {
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="status-panel-icon" id="'+this.sCode+'-status-icon"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-10">';
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+'</h3>';
    sHTML += '<p id="'+this.sCode+'-status-text">';
    if (this.objSettings.bActive) {
      sHTML += 'Credentials valid, able to talk to eBay on your behalf.';
    } else {
      sHTML += 'Click to login to eBay and give us permission to act on your behalf.';
    }
    sHTML += '</p>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- .row -->';

    return sHTML;
  };
  
  objCredentialsPanel.setListeners = function() {    
    nsc('#'+this.sCode+'-panel').off().on('click', function() {
      objCredentialsPanel.showModal();
      objCredentialsPanel.setListeners();
    });
    
    nsc('#ebay-sign-in').on('click', function() {
      window.location="/authorization/access";
    });
    
    nsc(document).on('credentialsPanelUpdated', function(event, nEbayAuthorizationStatus) {
      if (nEbayAuthorizationStatus === 4) {
        objCredentialsPanel.setActive('App ready to use.');
      } else {
        objCredentialsPanel.setInactive('Click to login to eBay and give us permission to act on your behalf.');
      }
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