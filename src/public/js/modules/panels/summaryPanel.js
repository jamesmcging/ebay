define(['jquery', 
  'modules/panels/panel',
  'modules/ebayApi/inventory',
  'modules/models/ebayCatalogueModel'
  ], function(nsc, 
  objPanel,
  objInventoryApi,
  objEbayCatalogueModel) {
   
  var objSummaryPanel = {};

  objSummaryPanel.__proto__ = objPanel;
  
  objSummaryPanel.sName = 'Summary';
  objSummaryPanel.sCode = 'summarypanel';

  objSummaryPanel.objChildPanels = {};
  objSummaryPanel.objSettings.nStoreSkuCount    = 'unknown';
  objSummaryPanel.objSettings.nEbaySkuCount     = objEbayCatalogueModel.getItemCount();
  objSummaryPanel.objSettings.nEbayOfferCount   = 'unknown';
  objSummaryPanel.objSettings.nEbayListingCount = 'unknown';
  objSummaryPanel.objSettings.nEbayOrderCount   = 'unknown';
  
  objSummaryPanel.initialize = function() {
    /* Ask the store for item count */
    objSummaryPanel.getStoreItemCount();
    
    /* Retrieving the Ebay sku count requires the app to be ebay authorized. We
     * therefore only fetch the ebay sku count on credentialsPanelUpdated. This
     * can be found in objSummaryPanel.setListeners. */
  };
  
  objSummaryPanel.getPanelContent = function() {
    var sHTML = '';
    
    sHTML += '<div class="panel panel-default" id="'+this.sCode+'">';
    
    sHTML += '<div class="panel-heading">'; 
    sHTML += this.sName;
    sHTML += '<span class="fa fa-refresh" id="refresh-summary-panel" style="float:right"></span>';
    sHTML += '</div><!-- .panel-heading -->';
    
    sHTML += '<div class="panel-body">';
    sHTML += '</div><!-- .panel.body -->';
    
    sHTML += '<table class="table">';
    sHTML += '<tbody>';
    sHTML += '<tr>';
    sHTML += '<td>Store Sku Count</td>';
    sHTML += '<td>'+objSummaryPanel.objSettings.nStoreSkuCount+'</td>';
    sHTML += '</tr>';
    sHTML += '<tr>';
    sHTML += '<td>eBay Sku Count</td>';
    sHTML += '<td>'+objEbayCatalogueModel.getItemCount()+'</td>';
    sHTML += '</tr>';
    sHTML += '<tr>';
    sHTML += '<td>eBay Offer Count</td>';
    sHTML += '<td>'+objSummaryPanel.objSettings.nEbayOfferCount+'</td>';
    sHTML += '</tr>';
    sHTML += '<tr>';
    sHTML += '<td>eBay Listing Count</td>';
    sHTML += '<td>'+objSummaryPanel.objSettings.nEbayListingCount+'</td>';
    sHTML += '</tr>';
    sHTML += '<tr>';
    sHTML += '<td>eBay Order Count</td>';
    sHTML += '<td>'+objSummaryPanel.objSettings.nEbayOrderCount+'</td>';
    sHTML += '</tr>';    
    sHTML += '</tbody>';
    sHTML += '</table>';
    
    
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objSummaryPanel.setListeners = function() {
    nsc('#refresh-summary-panel').off().on('click', function() {
      objSummaryPanel.render();
    });
    
    nsc(document).on('ebayCatalogueUpdated', function() {
      objSummaryPanel.render();
    });
  };
  
  objSummaryPanel.getStoreItemCount = function() {
    /* Ask the store for figures */    
    var jqxhr = nsc.ajax({
      url      : '/store/storedata',
      data     : {},
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      objSummaryPanel.updateStoreItemCount(responsedata);
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
  };
  
  objSummaryPanel.updateStoreItemCount = function(objData) {
    objSummaryPanel.objSettings.nStoreSkuCount = objData.nStoreSkuCount;
    objSummaryPanel.objSettings.objStoreData   = objData.objStoreData;
    objSummaryPanel.render();
  };
  
  objSummaryPanel.updateEbayItemCount = function(objData) {
    objSummaryPanel.objSettings.nEbaySkuCount = objData.sResponseMessage.total;
    objSummaryPanel.render();
  };
  
  return objSummaryPanel;
});