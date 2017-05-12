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
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+'</h3>';
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
        var sSelectedMarketplaceId = nsc('#marketplace-selector').val();
        if (sSelectedMarketplaceId !== '' && sSelectedMarketplaceId !== 'undefined') {
          app.objModel.objPolicyModel.getReturnPoliciesByMarketplaceFromEbay(sSelectedMarketplaceId);
        }
      }
    });
    
    nsc(document).on('returnpoliciesfetched', function(param1, nPolicyCountReturned) {
      var sMarketplaceId = nsc('#marketplace-selector').val();
        
      objReturnPoliciesPanel.setPanelStatus();
      objReturnPoliciesPanel.setModalFinishedUpdating();
      objReturnPoliciesPanel.showMessage(nPolicyCountReturned+' policies found for marketplace '+sMarketplaceId, 'success');
      objReturnPoliciesPanel.renderPolicyListMarkup(nsc('#marketplace-selector').val());
    });
    
    nsc(document).on('failedtofetchreturnpolicies', function(param1, sRestCallName, objResponseData) {
      var sMessage = '';
      if (typeof objResponseData.errors.length !== 'undefined') {
        for (var i = 0, nLength = objResponseData.errors.length; i < nLength; i++) {
          sMessage += '<p>'+sRestCallName+' failed because:</p>';
          sMessage += '<ul>';
          sMessage += '<li>['+objResponseData.errors[i].errorId+'] '+objResponseData.errors[i].message+'</li>';
          sMessage += '</ul>';
        }
      } else {
        sMessage = 'Unknown error on failedtofetchreturnpolicies';
      }
      objReturnPoliciesPanel.showMessage(sMessage, 'danger');
      objReturnPoliciesPanel.setModalFinishedUpdating();
    });
  };
  
  objReturnPoliciesPanel.setModalListeners = function() {
    nsc('#marketplace-selector').off().on('change', function() {
      objReturnPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.getReturnPoliciesByMarketplaceFromEbay(this.value);
    });
    
    nsc('#return-policy-list-refresh').off().on('click', function() {
      objReturnPoliciesPanel.renderPolicyListMarkup();
    });
    
    nsc('.policy-existing').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      console.log('fetching policy '+nPolicyId);
      objReturnPoliciesPanel.renderPolicyInterface(nPolicyId);
    });
    
    nsc('#policy-new').off().on('click', function() {
      objReturnPoliciesPanel.renderPolicyInterface();
    });
    
    nsc(document).off('policycreationerror').on('policycreationerror', function(event, objErrors) {
      var sAlertMessage = '';
      sAlertMessage += '<ul>';
      for (var i in objErrors) {
        sAlertMessage += '<li>('+objErrors[i].errorId+') '+objErrors[i].message+'</li>';
      }
      sAlertMessage += '</ul>';
      objReturnPoliciesPanel.showMessage(sAlertMessage, 'danger');
      objReturnPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('policycreated').on('policycreated', function(event, objData) {
      objReturnPoliciesPanel.showMessage('Return policy '+objData.nPolicyId+' created', 'success');
      objReturnPoliciesPanel.setModalFinishedUpdating();
      objReturnPoliciesPanel.renderPolicyListMarkup();
      objReturnPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('failedtodeletepolicy').on('failedtodeletepolicy', function(event, objData) {
      console.log(objData);
      var sAlertMessage = '';
      
      if (typeof objData.arrErrors !== 'undefined') {  
        sAlertMessage += '<ul>';
        for (var i = 0, nLength = objData.arrErrors.length; i < nLength; i++) {
          sAlertMessage += '<li>('+objData.arrErrors[i].errorId+') '+objData.arrErrors[i].message+'</li>';
        }
        sAlertMessage += '</ul>';
      } else {
        sAlertMessage += '<p>Failed to delete policy</p>';
      }
      objReturnPoliciesPanel.showMessage(sAlertMessage, 'warning');
      objReturnPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('policydeleted').on('policydeleted', function(event, objData) {
      objReturnPoliciesPanel.showMessage('Deleted policy in marketplace '+objData.sMarketplaceId, 'success');
      objReturnPoliciesPanel.setModalFinishedUpdating();
      objReturnPoliciesPanel.renderPolicyListMarkup();
      objReturnPoliciesPanel.hidePolicyInterface();
      objReturnPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('policyupdated').on('policyupdated', function(event, objData) {
      objReturnPoliciesPanel.showMessage('Return policy '+objData.nPolicyId+' updated', 'success');
      objReturnPoliciesPanel.setModalFinishedUpdating();
      objReturnPoliciesPanel.renderPolicyListMarkup();
      objReturnPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('policyupdatefailed').on('policyupdatefailed', function(event) {
      objReturnPoliciesPanel.showMessage('Return policy update failed', 'warning');
      objReturnPoliciesPanel.setModalFinishedUpdating();
      objReturnPoliciesPanel.renderPolicyListMarkup();
      objReturnPoliciesPanel.setPanelStatus();
    });    
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // Listeners attached to the policy details form
    //
    ////////////////////////////////////////////////////////////////////////////
    nsc('#refundMethod').off().on('change', function() {
      nsc('#refund-method-value').val(this.value);
    });
    
    nsc('#returns-accepted-selector').off().on('change', function() {
      nsc('#returns-accepted-value').val(this.value);
    });
    
    nsc('#return-shipping-cost-payer-selector').off().on('change', function() {
      nsc('#return-shipping-cost-payer-value').val(this.value);
    });
    
    nsc('#restock-fee-percentage-selector').off().on('change', function() {
      nsc('#restock-fee-percentage-value').val(this.value);
    });
    
    nsc('#return-method-selector').off().on('change', function() {
      nsc('#return-method-value').val(this.value);
    });
    
    nsc('#returns-period-selector').off().on('change', function() {
      nsc('#return-period-value').val(this.value+' days');
      nsc('#return-period-value-value').val(this.value);
    });
    
    nsc('#create-return-policy').off().on('click', function() {
      var objFormData = nsc('#create-return-policy-form').serializeArray();
      
      /* serializeData needs massaged into a useful structure */
      var objData = {};
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }
      objReturnPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.createPolicy('returnPolicies', objData);
    });
    
    nsc('#update-return-policy').off().on('click', function() {
      console.log('update-return-policy clicked');
      var nPolicyId = nsc(this).data('policyid');
      var objFormData = nsc('#create-return-policy-form').serializeArray();
      var objData = {};
      
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }

      objReturnPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.updatePolicy('returnPolicies', nPolicyId, objData);
    });
    
    nsc('#delete-return-policy').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      objReturnPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.deletePolicy('returnPolicies', nPolicyId);
    });
  };
  
  objReturnPoliciesPanel.initialize = function() {
    objReturnPoliciesPanel.setInactive();
  };
  
  objReturnPoliciesPanel.setPanelStatus = function() {
    var sMarketplaceId = nsc('#marketplace-selector').val();
    var objPolicies = app.objModel.objPolicyModel.getReturnPoliciesByMarketplace(sMarketplaceId);
    
    if (Object.keys(objPolicies).length) {
      objReturnPoliciesPanel.setActive('Return policy in place for '+sMarketplaceId);
    } else {
      objReturnPoliciesPanel.setInactive(sMarketplaceId+' needs a return policy');
    }
  };
      
  objReturnPoliciesPanel.getModalHeaderMarkup = function() {    
    var sHTML = '';
    
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<span id="updating-icon-span" style="float:right"></span>';
    sHTML += '<h2 class="modal-title">Return Policy Interface</h2>';
    
    return sHTML;
  };
  
  objReturnPoliciesPanel.getModalBodyMarkup = function() {
    var sDefaultMarketplace = nsc('#marketplace-selector').val();
    var sHTML = '';
    
    sHTML += objReturnPoliciesPanel.getPolicyListMarkup(sDefaultMarketplace);
    sHTML += '<div id="modal-alertbox">';
    sHTML += '  <div id="modal-alertbox-inner"></div>';
    sHTML += '</div>';
    sHTML += '<div id="return-policy-interface"></div>';
    
    return sHTML;
  };
    
  objReturnPoliciesPanel.getModalFooterMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-default" data-dismiss="modal" aria-label="Close">Close</button>';
    
    return sHTML;
  };
    
  objReturnPoliciesPanel.showMessage = function(sMessage, sMessageType) {
    var sHTML = '';
    sHTML += '<div id="modal-alertbox-inner" class="alert alert-'+sMessageType+'">';
    sHTML += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    sHTML += sMessage;
    sHTML += '</div>';
    
    nsc('#modal-alertbox').html(sHTML);
    nsc('#modal-alertbox-inner').delay(2000).slideUp(1000);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Panel specific code
  //
  //////////////////////////////////////////////////////////////////////////////
  objReturnPoliciesPanel.renderPolicyListMarkup = function(sMarketplaceId) {
    if (typeof sMarketplaceId === 'undefined') {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
    nsc('#return-policy-list').replaceWith(objReturnPoliciesPanel.getPolicyListMarkup(sMarketplaceId));
    objReturnPoliciesPanel.setModalListeners();
  };
  
  objReturnPoliciesPanel.getPolicyListMarkup = function(sMarketplaceId) {
    
    var objPolicies = app.objModel.objPolicyModel.getReturnPoliciesByMarketplace(sMarketplaceId);
    
    var sHTML = '';

    sHTML += '<div id="return-policy-list">';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>Return Policies</span>';
    sHTML += '    <span class="fa fa-refresh" id="return-policy-list-refresh" style="float:right"></span>';
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Policies are marketplace specific.</p>'
    sHTML += '  </div>';
    sHTML += '  <table class="table table-hover table-condensed">';
    
    if (Object.keys(objPolicies).length) {
      sHTML += '<tr>';
      sHTML += '  <th>Policy ID</th>';
      sHTML += '  <th>Marketplace</th>';
      sHTML += '  <th>Name</th>';
      sHTML += '</tr>';
    }
    
    /* Any existing policies */
    for (var nPolicyID in objPolicies) {
      var objPolicy = objPolicies[nPolicyID];
      sHTML += '<tr class="policy-existing" data-policyid="'+nPolicyID+'">';
      sHTML += '  <td>'+nPolicyID+'</td>';
      sHTML += '  <td>'+objPolicy.marketplaceId+'</td>';
      sHTML += '  <td>'+objPolicy.name+'</td>';
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
    sHTML += '</div>';
    sHTML += '</div><!-- #policy-list -->';

    return sHTML;
  };
  
  objReturnPoliciesPanel.renderPolicyInterface = function(nPolicyId) {
    nsc('#return-policy-interface').replaceWith(objReturnPoliciesPanel.getPolicyInterfaceMarkup(nPolicyId));
    objReturnPoliciesPanel.setModalListeners();
  };
  
  objReturnPoliciesPanel.hidePolicyInterface = function() {
    var sHTML = '<div id="return-policy-interface"></div>';
    nsc('#return-policy-interface').replaceWith(sHTML);
  };
  
  objReturnPoliciesPanel.getPolicyInterfaceMarkup = function(nPolicyId) {
    var objPolicy = app.objModel.objPolicyModel.getPolicyById('returnPolicies', nPolicyId);
    var sHTML = '';
    
    sHTML += '<div id="return-policy-interface" class="panel panel-default">';

    sHTML += '  <div class="panel-heading">';
    if (nPolicyId !== '') {
      sHTML += '<h3 class="panel-title">Policy Detail</h3>';   
    } else {
      sHTML += '<h3 class="panel-title">Existing policy interface for policy #'+nPolicyId+'</h3>';  
    }    
    sHTML += '  </div><!-- .panel-heading -->';
    
    sHTML += '  <div class="panel-body">';
    sHTML += '    <form class="form-horizontal" id="create-return-policy-form">';
    
    sHTML += '      <input type="hidden" name="marketplaceId" value="'+nsc('#marketplace-selector').val()+'">';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="name" class="col-sm-2">Name</label>';
    sHTML += '        <div class="col-sm-10">';
    sHTML += '          <input type="text" id="name" class="form-control" name="name" value="'+objPolicy.name+'" maxlength="64">';
    sHTML += '        </div>';
    sHTML += '      </div>';    
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="description" class="col-sm-2">Short Description (250 characters)</label>';
    sHTML += '        <div class="col-sm-10">';
    sHTML += '          <textarea id="description" class="form-control" name="description" rows="4" placeholder="Short Description of your return policy" maxlength="250">';
    sHTML += objPolicy.description;
    sHTML += '          </textarea>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="refund-method-selector" class="col-sm-2">Refund Method</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="refund-method-selector" class="form-control">';
    sHTML += '            <option value="MERCHANT_CREDIT"';
    if (objPolicy.refundMethod === 'MERCHANT_CREDIT') {
      sHTML += ' selected="selected"';
    }
    sHTML += '>';
    sHTML += '            Merchant Credit</option>';
    sHTML += '            <option value="MONEY_BACK"';
    if (objPolicy.refundMethod === 'MONEY_BACK') {
      sHTML += ' selected="selected"';
    }    
    sHTML += '>';
    sHTML += 'Money Back</option>';    
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="refund-method-value" class="form-control" name="refundMethod" value="'+objPolicy.refundMethod+'" readonly>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="returns-accepted-selector" class="col-sm-2">Returns Accepted</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="return-accepted-selector" class="form-control">';
    var arrReturnsAccepted = ['true', 'false'];
    for (var i = 0, nLength = arrReturnsAccepted.length; i < nLength; i++) {
      sHTML += '<option';
      if (objPolicy.returnsAccepted === arrReturnsAccepted[i]) {
        sHTML += ' selected="selected"';
      }
      sHTML += ' value="'+arrReturnsAccepted[i]+'">';
      sHTML += arrReturnsAccepted[i];
      sHTML += '</option>';
    }
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="returns-accepted-value" class="form-control" name="returnsAccepted" value="'+objPolicy.returnsAccepted+'" readonly>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="return-shipping-cost-payer-selector" class="col-sm-2">Who Pays for Returns</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="return-shipping-cost-payer-selector" class="form-control">';
    var arrReturnPayer = ['BUYER', 'SELLER'];
    for (var i = 0, nLength = arrReturnPayer.length; i < nLength; i++) {
      sHTML += '<option';
      if (objPolicy.returnShippingCostPayer === arrReturnPayer[i]) {
        sHTML += ' selected="selected"';
      }
      sHTML += ' value="'+arrReturnPayer[i]+'">';
      sHTML += arrReturnPayer[i];
      sHTML += '</option>';
    }
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="return-shipping-cost-payer-value" class="form-control" name="returnShippingCostPayer" value="'+objPolicy.returnShippingCostPayer+'" readonly>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="restock-fee-percentage-selector" class="col-sm-2">Restocking Fee %</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="restock-fee-percentage-selector" class="form-control">';
    var arrPossiblePercentage = ['0.0', '10.0', '15.0', '20.0'];
    for (var i = 0, nLength = arrPossiblePercentage.length; i < nLength; i++) {
      sHTML += '<option';
      if (objPolicy.restockingFeePercentage === arrPossiblePercentage[i]) {
        sHTML += ' selected="selected"';
      }
      sHTML += ' value="'+arrPossiblePercentage[i]+'">';
      sHTML += arrPossiblePercentage[i];
      sHTML += '</option>';
    }
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="restock-fee-percentage-value" class="form-control" name="restockingFeePercentage" value="'+objPolicy.restockingFeePercentage+'" readonly>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="return-instructions" class="col-sm-2">Return Instructions (5000 characters)</label>';
    sHTML += '        <div class="col-sm-10">';
    sHTML += '          <textarea id="return-instructions" class="form-control" name="returnInstructions" rows="4" maxlength="5000">';
    sHTML += objPolicy.returnInstructions;
    sHTML += '          </textarea>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="return-method-selector" class="col-sm-2">Return Method</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="return-method-selector" class="form-control">';
    var arrPossibleReturnMethod = ['EXCHANGE', 'REPLACEMENT'];
    for (var i = 0, nLength = arrPossibleReturnMethod.length; i < nLength; i++) {
      sHTML += '<option';
      if (objPolicy.returnMethod === arrPossibleReturnMethod[i]) {
        sHTML += ' selected="selected"';
      }
      sHTML += ' value="'+arrPossibleReturnMethod[i]+'">';
      sHTML += arrPossibleReturnMethod[i];
      sHTML += '</option>';
    }
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="return-method-value" class="form-control" name="returnMethod" value="'+objPolicy.returnMethod+'" readonly>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="returns-period-selector" class="col-sm-2">Return Period</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="returns-period-selector" class="form-control">';
    var objPossibleReturnPeriods = {14 : '14 days', 30 : '30 days', 60 : '60 days'};
    for (var sDays in objPossibleReturnPeriods) {
      sHTML += '<option';
      if (objPolicy.returnPeriod.value === sDays) {
        sHTML += ' selected="selected"';
      }
      sHTML += ' value="'+sDays+'">';
      sHTML += objPossibleReturnPeriods[sDays];
      sHTML += '</option>';
    }
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="return-period-value" class="form-control" value="'+objPolicy.returnPeriod.value+' days" readonly>';
    sHTML += '          <input type="hidden" id="return-period-unit-value" name="returnsPeriodUnit" value="DAY">';
    sHTML += '          <input type="hidden" id="return-period-value-value" name="returnsPeriodValue" value="'+objPolicy.returnPeriod.value+'">';
    sHTML += '        </div>';
    sHTML += '      </div>';
    

    sHTML += '      <div class="form-group text-center">';
    if (typeof nPolicyId === 'undefined') {
      sHTML += '        <button id="create-return-policy" class="btn btn-primary" type="button">Create New Policy</button>';
    } else {
      sHTML += '        <button id="update-return-policy" class="btn btn-primary" type="button" data-policyid="'+nPolicyId+'">Update Policy</button>';
      sHTML += '        <button id="delete-return-policy" class="btn btn-default" type="button" data-policyid="'+nPolicyId+'">Delete Policy</button>';
    }
    sHTML += '      </div>';

    sHTML += '    </form>';
    sHTML += '  </div><!-- .panel-body -->';
    
    sHTML += '</div><!-- .panel-->';
    
    return sHTML;
  };
  
  objReturnPoliciesPanel.setModalUpdating = function() {
    nsc('#return-policy-list-refresh').removeClass().addClass('fa fa-refresh fa-spin fa-fw');
  };

  objReturnPoliciesPanel.setModalFinishedUpdating = function() {
    nsc('#return-policy-list-refresh').removeClass().addClass('fa fa-refresh');
  };
  
  return objReturnPoliciesPanel;
});