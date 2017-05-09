define(['jquery', 
  'modules/panels/statusPanel'], 
function(nsc, 
  objStatusPanel) {
   
  var objReturnPoliciesPanel = {};

  objReturnPoliciesPanel.__proto__ = objStatusPanel;
  
  objReturnPoliciesPanel.sName = 'Return Policies';
  objReturnPoliciesPanel.sCode = 'returnpoliciespanel';
  
  objReturnPoliciesPanel.objChildPanels = {};
  
  objReturnPoliciesPanel.objSettings.bActive = false;
  
  objReturnPoliciesPanel.getPanelContent = function() {    
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="status-panel-icon" id="'+this.sCode+'-status-icon"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-10">';
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+' WORK IN PROGRESS!</h3>';
    sHTML += '<p id="'+this.sCode+'-status-text">';
    sHTML += 'Click to set or update return policies';
    sHTML += '</p>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- .row -->';
    
    return sHTML;
  };
  
  objReturnPoliciesPanel.setListeners = function() {
    nsc('#'+this.sCode+'-panel').off().on('click', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        objReturnPoliciesPanel.showModal();
        objReturnPoliciesPanel.setModalListeners();
      } else {
        objReturnPoliciesPanel.setInactive('Please sign in before using this panel');
      }
    });
    
    nsc(document).on('credentialsPanelUpdated', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        var sDefaultMarketplace = app.objModel.objDataMappings.getDefaultMarketplace();
        if (sDefaultMarketplace !== '' && sDefaultMarketplace !== 'undefined') {
          app.objModel.objPolicyModel.getReturnPoliciesByMarketplaceFromEbay(sDefaultMarketplace);
        }
      }
    });
    
    nsc(document).on('returnpoliciesfetched', function(param1, nPolicyCountReturned) {
      objReturnPoliciesPanel.setModalFinishedUpdating();
      objReturnPoliciesPanel.showMessage(nPolicyCountReturned+' policies found for marketplace', 'success');
      objReturnPoliciesPanel.renderPolicyListMarkup();
    });
    
    nsc(document).on('failedtofetchreturnpolicies', function(param1, sRestCallName, objResponseData) {
      var sMessage = '';
      for (var i = 0, nLength = objResponseData.errors.length; i < nLength; i++) {
        sMessage += '<p>'+sRestCallName+' failed because:</p>';
        sMessage += '<ul>';
        sMessage += '<li>['+objResponseData.errors[i].errorId+'] '+objResponseData.errors[i].message+'</li>';
        sMessage += '</ul>';
      }
      objReturnPoliciesPanel.showMessage(sMessage, 'danger');
      objReturnPoliciesPanel.setModalFinishedUpdating();
    });
  };
  
  objReturnPoliciesPanel.setModalListeners = function() {
    nsc('#marketplace-selector').on('change', function() {
      objReturnPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.getReturnPoliciesByMarketplaceFromEbay(this.value);
    });
  };
  
  objReturnPoliciesPanel.initialize = function() {
    objReturnPoliciesPanel.setInactive();
  };
  
  objReturnPoliciesPanel.getModalHeaderMarkup = function() {    
    var sHTML = '';
    
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<span id="updating-icon-span" style="float:right"></span>';
    sHTML += '<h2 class="modal-title">Return Policy Interface</h2>';
    
    return sHTML;
  };
  
  objReturnPoliciesPanel.getModalBodyMarkup = function() {
    var sHTML = '';
    sHTML += objReturnPoliciesPanel.getMarketplaceMarkup();
    sHTML += objReturnPoliciesPanel.getPolicyListMarkup();
    sHTML += '<div id="modal-alertbox"></div>';
    sHTML += objReturnPoliciesPanel.getPolicyInterfaceMarkup();
    return sHTML;
  };
    
  objReturnPoliciesPanel.getModalFooterMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close">Close</button>';
    
    return sHTML;
  };
    
  objReturnPoliciesPanel.showMessage = function(sMessage, sMessageType) {
    var sHTML = '';
    sHTML += '<div id="modal-alertbox" class="alert alert-'+sMessageType+'">';
    sHTML += sMessage;
    sHTML += '</div>';
    
    nsc('#modal-alertbox').replaceWith(sHTML);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Panel specific code
  //
  //////////////////////////////////////////////////////////////////////////////
  objReturnPoliciesPanel.getMarketplaceMarkup = function() {
    var sDefaultMarketplace = app.objModel.objDataMappings.getDefaultMarketplace();
    
    var objMarketplaces = {
      EBAY_US : 'ebay.com',
      EBAY_GB : 'ebay.co.uk',
      EBAY_CA : 'ebay.ca',
      EBAY_IE : 'ebay.ie'
    };
    var sHTML = '';
    
    sHTML += '<label for="marketplace-selector">Policies are marketplace specific, select the marketplace you want to use.</label>';
    sHTML += '<select id="marketplace-selector" class="form-control input-group-sm">';
    for (var sKey in objMarketplaces) {
      sHTML += '<option';
      sHTML += ' value="'+sKey+'"';
      if (sKey === sDefaultMarketplace) {
        sHTML += ' selected="selected"';
      }
      sHTML += '>';
      sHTML += objMarketplaces[sKey];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  };
  
  objReturnPoliciesPanel.renderPolicyListMarkup = function() {
    nsc('#return-policy-list').replaceWith(objReturnPoliciesPanel.getPolicyListMarkup());
  };
  
  objReturnPoliciesPanel.getPolicyListMarkup = function() {
    var sMarketplaceId = nsc('#marketplace-selector').val();
    var objPolicies = app.objModel.objPolicyModel.getReturnPoliciesByMarketplace(sMarketplaceId);
    var sHTML = '';

    sHTML += '<div id="return-policy-list">';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>Return Policies</span>';
    sHTML += '    <span class="fa fa-refresh" id="return-policy-list-refresh" style="float:right"></span>';
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Existing policies are displayed below. Click on an policy to view/amend it or create a new policy.</p>';
    sHTML += '  </div>';
    sHTML += '  <table class="table table-hover table-condensed">';
    
    if (Object.keys(objPolicies).length) {
      sHTML += '<tr>';
      sHTML += '  <th>Policy ID</th>';
      sHTML += '  <th>Marketplace</th>';
      sHTML += '  <th>Type</th>';
      sHTML += '</tr>';
    }
    
    /* Any existing policies */
    for (var nPolicyID in objPolicies) {
      var objPolicy = objPolicies[nPolicyID];
      sHTML += '<tr class="policy-existing" data-policyid="'+nPolicyID+'">';
      sHTML += '  <td>'+nPolicyID+'</td>';
      sHTML += '  <td>'+objPolicy.marketplaceId+'</td>';
      sHTML += '  <td>'+objPolicy.status+'</td>';
      sHTML += '</tr>';
    }
    
    /* The chance to create a new policy */
    sHTML += '    <tr>';
    sHTML += '      <td colspan="3" align="center">';
    sHTML += '        <button id="policy-new" class="btn btn-default">';
    sHTML += '          <span class="fa fa-plus-circle"></span>';
    sHTML += ' Click here to create new policy.';
    sHTML += '        </button>';
    sHTML += '      </td>';
    sHTML += '    </tr>';
    
    sHTML += '  </table>';
    sHTML += '</div><!-- .panel -->';
    sHTML += '</div><!-- #policy-list -->';

    return sHTML;
  };
  
  objReturnPoliciesPanel.renderPolicyInterface = function() {
    nsc('#return-policy-interface').replaceWith(objReturnPoliciesPanel.getPolicyInterfaceMarkup());
  };
  
  objReturnPoliciesPanel.getPolicyInterfaceMarkup = function(nPolicyId) {
    var sHTML = '';
    
    sHTML += '<div id="return-policy-interface">';
    if (nPolicyId !== '') {
      
    }
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objReturnPoliciesPanel.setModalUpdating = function() {
    nsc('#updating-icon-span').addClass('fa fa-2x fa-refresh fa-spin fa-fw');
  };

  objReturnPoliciesPanel.setModalFinishedUpdating = function() {
    nsc('#updating-icon-span').removeClass();
  };
  
  return objReturnPoliciesPanel;
});