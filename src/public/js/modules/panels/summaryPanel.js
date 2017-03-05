define(['jquery', 'modules/panels/panel'], function(nsc, objPanel) {
   
  var objSummaryPanel = {};

  objSummaryPanel.__proto__ = objPanel;
  
  objSummaryPanel.sName = 'Summary';
  objSummaryPanel.sCode = 'summarypanel';

  objSummaryPanel.objChildPanels = {};
  objSummaryPanel.objSettings.nStoreSkuCount = 'unknown';
  objSummaryPanel.objSettings.nEbaySkuCount = 'unknown';
  objSummaryPanel.objSettings.nEbayOfferCount = 'unknown';
  objSummaryPanel.objSettings.nEbayListingCount = 'unknown';
  objSummaryPanel.objSettings.nEbayOrderCount = 'unknown';
  
  objSummaryPanel.initialize = function() {
    objSummaryPanel.refresh();
  };
  
  objSummaryPanel.getPanelContent = function() {
    var sHTML = '';
    
    sHTML += '<div class="panel panel-default" id="'+this.sCode+'">';
    
    sHTML += '<div class="panel-heading">'; 
    sHTML += this.sName;
    sHTML += '&nbsp;<button type="button" id="refresh-summary-panel" class="btn btn-small btn-default">Refresh</button>';
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
    sHTML += '<td>'+objSummaryPanel.objSettings.nEbaySkuCount+'</td>';
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
      objSummaryPanel.refresh();
    });
  };
  
  objSummaryPanel.refresh = function() {
    /* Ask the store for figures */    
    var jqxhr = nsc.ajax({
      url      : '/store',
      data     : {},
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      objSummaryPanel.objSettings.nStoreSkuCount = responsedata.nStoreSkuCount;
      objSummaryPanel.render();
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    /* Ask eBay for figures */
  };
  
  return objSummaryPanel;
});