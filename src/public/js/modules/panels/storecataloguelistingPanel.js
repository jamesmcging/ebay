define(['jquery', 
  'modules/panels/panel',
  ], 
  function(nsc, 
  objPanel
  ) {
   
  var objStoreCatalogueListingPanel = {};

  objStoreCatalogueListingPanel.__proto__ = objPanel;
  
  objStoreCatalogueListingPanel.sName = 'Store Catalogue Listing Panel';
  objStoreCatalogueListingPanel.sCode = 'storecataloguelistingpanel';

  objStoreCatalogueListingPanel.objChildPanels = {};
  
  objStoreCatalogueListingPanel.objSettings.bActive = false;
  
  objStoreCatalogueListingPanel.objSettings.nCurrentItem = false;
   
  objStoreCatalogueListingPanel.getPanelContent = function() {
    var sHTML = '';
    if (objStoreCatalogueListingPanel.objSettings.bActive) {
      sHTML += objStoreCatalogueListingPanel.getItemListPagination();
      
      sHTML += '<div class="row">';
      
      /* The item listing panel (can be shrunk to show product details) */
      sHTML += '<div id="store-catalogue-main" class="col-sm-12">';      
      sHTML += objStoreCatalogueListingPanel.getItemListHeaderMarkup();
      sHTML += objStoreCatalogueListingPanel.getItemListMarkup();
      sHTML += '</div>';

      sHTML += '</div><!-- .row -->';

    } else {
      sHTML += '<p>Current filter returns no items</p>';
    }

    return sHTML;
  };
  
  objStoreCatalogueListingPanel.setListeners = function() {
    
    nsc(document).on('objItemsUpdated', function() {
      objStoreCatalogueListingPanel.initialize();
    });
    
    /* Handles the # of items per page drop down */
    nsc('#item-limit-menu').off().on('change', function(event) {
      app.objModel.objStoreCatalogueModel.objFilters.nLimit = event.target.value;
      app.objModel.objStoreCatalogueModel.getItemsFromAPI();
    });
    
    /* This code handles the columns sorting */
    nsc('.sort-field').off().on('click', function() {
      if (app.objModel.objStoreCatalogueModel.objFilters.sOrderByDirection === 'ASC') {
        nsc('.sort-field').removeClass('sort-field-ascending');
        nsc('.sort-field').addClass('sort-field-descending');
        app.objModel.objStoreCatalogueModel.objFilters.sOrderByDirection = 'DESC';
      } else {
        nsc('.sort-field').removeClass('sort-field-descending');
        nsc('.sort-field').addClass('sort-field-ascending');
        app.objModel.objStoreCatalogueModel.objFilters.sOrderByDirection = 'ASC';
      }
      app.objModel.objStoreCatalogueModel.objFilters.sOrderByField = nsc(this).data('sortfield');
      app.objModel.objStoreCatalogueModel.getItemsFromAPI();
    });
    
    /* This code causes the selected product to be pushed to the ebay inventory */
    nsc('.push-to-ebay').off().on('click', function() {
      var nProductID = nsc(this).data('productid');
      app.objModel.objEbayCatalogueModel.pushItemToEBay(nProductID);
    });
    
    nsc('.view-details').off().on('click', function(){
      var itemId = nsc(this).data('itemid');
      objStoreCatalogueListingPanel.showItemDetails(itemId)
    });
    
    nsc('#item-limit-menu').on('change', function() {
      app.objModel.objStoreCatalogueModel.objFilters.nLimit = nsc(this).val();
      app.objModel.objStoreCatalogueModel.getItemsFromAPI();
    });
    
    nsc('.item_offset').on('click', function() {
      app.objModel.objStoreCatalogueModel.objFilters.nOffset = (nsc(this).val() * app.objModel.objStoreCatalogueModel.objFilters.nLimit);
    });
    
    nsc('.pagination-link').on('click', function() {
      app.objModel.objStoreCatalogueModel.objFilters.nOffset = nsc(this).data('noffset');
      app.objModel.objStoreCatalogueModel.getItemsFromAPI();
    });
    
    nsc(document).on('ebayCatalogueUpdated', function() {
      console.log('store catalogue listing panel has noticed that the enay catalogue has updated');
      var arrItems = app.objModel.objStoreCatalogueModel.objData.arrItems;
      for(var i in arrItems) {
        nsc('#storecatalogueactionbutton-' + arrItems[i].product_id).replaceWith(objStoreCatalogueListingPanel.getButtonMarkup(arrItems[i]));
      }
    });
    
  };
  
  objStoreCatalogueListingPanel.initialize = function() {
    
    /* Ensure the app has its store catalogue model */
    if (typeof app.objModel.objStoreCatalogueModel === 'undefined') {
      app.objModel.objStoreCatalogueModel = objStoreCatalogueModel;
      app.objModel.objStoreCatalogueModel.initialize();
    } else if (app.objModel.objStoreCatalogueModel.objData.objStoreStructure) {
      objStoreCatalogueListingPanel.objSettings.bActive = true;
      objStoreCatalogueListingPanel.render();
    } else {
      console.log('The item listing panel needs items to render');
    }
  };
  
  objStoreCatalogueListingPanel.sCatalogueKey = 'store_catalogue';
  
  objStoreCatalogueListingPanel.objPossibleProducts = {};
  
  objStoreCatalogueListingPanel.setActive = function() {
    objStoreCatalogueListingPanel.getItemsFromAPI();
  };
  
  objStoreCatalogueListingPanel.renderDetails = function(nProductID) {
    var objItemDetails = objStoreCatalogueListingPanel.getItem(nProductID);
    
    if (objItemDetails) {
      var sHTML = '';
      sHTML += '<div id="item-details-panel">';
      
      sHTML += '<div id="item-details-head">';
      sHTML += '<span>'+objItemDetails.product_name+'</span>';
      sHTML += '<button class="btn btn-info pull-right" id="toggle-itemdetails">Hide Details</button>';
      sHTML += '</div><!-- #item-details-head -->';
      
      sHTML += '<form class="form-horizontal">';
      sHTML += '<div class="control-group">';
      for (var key in objItemDetails) {
        if (key === '_links' || key == 'ttl') {
        } else if (key === 'product_desc') {
          sHTML += '<label class="control-label" for"detail-'+key+'">' + key + ':</label>';
          sHTML += '<div class="controls">';
          sHTML += '<textarea id="detail-'+key+'" rows="5" readonly>';
          sHTML += objItemDetails[key];
          sHTML += '</textarea>';          
          sHTML += '</div>';
        } else {
          sHTML += '<label class="control-label" for"detail-'+key+'">' + key + ':</label>';
          sHTML += '<div class="controls">';
          sHTML += '<input type="text" id="detail-'+key+'" value="' + objItemDetails[key] + '" readonly>';          
          sHTML += '</div>';
        }
      }
      sHTML += '</div>';
      sHTML += '</form>';
      
      sHTML += '<button class="btn" id="toggle-itemdetails">Hide Details</button>';
      sHTML += '</div>';

      nsc('#item-details-panel').replaceWith(sHTML);
      objStoreCatalogueListingPanel.setListeners();
      objStoreCatalogueListingPanel.toggleDetailsPanel(nProductID);
    }
  };
  
  objStoreCatalogueListingPanel.toggleDetailsPanel = function(nProductID) {
    if (nsc('#item-listing-panel').attr('class') === 'span12') {
      nsc('#item-listing-panel').toggleClass('span12').toggleClass('span7');
      nsc('#item-details-panel').toggleClass('span5').show();
      nsc('#store-catalogue-item-'+nProductID).addClass('selected-item');
      
    } else {
      nsc('#item-listing-panel').toggleClass('span12').toggleClass('span7');
      nsc('#item-details-panel').hide();
      nsc('.catalogue-item').removeClass('selected-item');
    }
  };
  
  objStoreCatalogueListingPanel.getSearchPanelMarkup = function() {
    var sHTML = '';
    
    sHTML += '<div id="store-catalogue-search-panel">';
    sHTML += '<select id="group-action" disabled>';
    sHTML += '<option value="none">Action on 0 selected</option>';
    sHTML += '<option value="push-to-ebay">Push to eBay</option>';
    sHTML += '</select>';
    sHTML += '&nbsp;&nbsp;';
    sHTML += '<input id="finditem" class="text" type="text" placeholder="Search by product name">';
    sHTML += '</div>';
    
    return sHTML;
  };
    
  objStoreCatalogueListingPanel.getItemListHeaderMarkup = function() {
    var sHTML = '';

    sHTML += '<div id="head-store-catalogue">';
    
    sHTML += '<div class="col-sm-1">';
    sHTML += '<input type="checkbox" id="checkbox-all-store-items">';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-1">';
    sHTML += 'Image';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_code">Item Lookup Code</span>';
    sHTML += '<br>';
    sHTML += '<span class="ghost">ID</span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-3">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_name">Product Name</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '<br>';
    sHTML += '<span class="ghost">Department/ Category</span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_stock">Available</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_price">Price</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-3 text-right">';
    sHTML += 'Action';
    sHTML += '</div>';
    
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objStoreCatalogueListingPanel.getItemListMarkup = function() {
    var sHTML = '';

    if (objStoreCatalogueListingPanel.objSettings.bActive) { 
      var arrItems = app.objModel.objStoreCatalogueModel.objData.arrItems;
      for(var i in arrItems) {
        sHTML += objStoreCatalogueListingPanel.getItemMarkup(arrItems[i]);
      }
    } else {
      sHTML += '<p>No products.</p>';
    }
    
    return sHTML;
  };

  objStoreCatalogueListingPanel.getItemMarkup = function(objItem) {
    var sHTML = '';
    var nItemID = objItem.product_id;
        
    sHTML += '<div class="catalogue-item" id="store-catalogue-item-'+nItemID+'">';
    
    /* The checkbox */
    sHTML += '<div class="col-sm-1">';
    sHTML += '  <input type="checkbox" class="item-checkbox" data-itemid="'+nItemID+'">';
    sHTML += '</div>';
    
    /* The item image */
    sHTML += '<div class="col-sm-1">';
    if (objItem.product_image.length) {
      sHTML += '  <img style="width:100%" src="'+objItem.product_image+'" title="image of '+objItem.productimage+'">';
    }
    sHTML += '</div>';
    
    /* The item code */
    sHTML += '<div class="col-sm-2">';
    sHTML += objItem.product_code;
    sHTML += '<br>';
    sHTML += '<span class="ghost">'+objItem.product_id+'</span>';
    sHTML += '</div>';
    
    /* The item name */
    sHTML += '<div class="col-sm-3">';
    sHTML += '  <span class="item-name">';
    sHTML += '    <a href="'+objItem.product_url+'" target="_blank">';
    sHTML += objItem.product_name;
    sHTML += '    </a>';
    sHTML += '  </span>';
    sHTML += '  <br>';
    sHTML += '  <span class="ghost">';
    sHTML += '    <a href="' + objStoreCatalogueListingPanel.getDepartmentLink(objItem.department_id) + '" target="_blank">';
    sHTML += objItem.department_name;
    sHTML += '    </a>';
    sHTML += '/ ';
    sHTML += '    <a href="' + objStoreCatalogueListingPanel.getCategoryLink(objItem.category_id) + '" target="_blank">';
    sHTML += objItem.category_name;
    sHTML += '</a>';
    sHTML += '  </span>';
    sHTML += '</div>';
    
    /* The item inventory */
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += objItem.product_stock;
    sHTML += '</div>';
    
    /* The item price */
    sHTML += '<div class="col-sm-1 text-right">';
    sHTML += app.objModel.objStoreCatalogueModel.objData.sCurrencySymbol + objItem.product_price;
    sHTML += '</div>';
    
    /* The action button */
    sHTML += objStoreCatalogueListingPanel.getButtonMarkup(objItem);

    sHTML += '</div>';
    
    return sHTML;
  };
    
  objStoreCatalogueListingPanel.getButtonMarkup = function(objItem) {
    var nItemStatus  = app.objModel.objEbayCatalogueModel.getItemStatus(objItem.product_code);
    var sButtonText  = 'Push to eBay';
    var sButtonClass = 'btn';
    var sDisabled    = '';
    
    switch (nItemStatus) {
      case "NOT_ON_EBAY":
        sButtonText  = 'Push to eBay';
        sButtonClass = 'btn btn-default push-to-ebay';
        break;
        
      case "ON_EBAY": 
        sButtonText = 'Update on eBay';
        sButtonClass = 'btn btn-default push-to-ebay';
        break;

      default: 
        sButtonText  = 'UNKNOWN';
        sButtonClass = 'btn btn-default';
        sDisabled    = 'disabled="disabled"';
    }

    var sHTML = '';
    sHTML += '<div class="col-sm-3 text-right" id="storecatalogueactionbutton-' + objItem.product_id + '">';
    sHTML += '<div class="btn-group">';
    sHTML += '<button id="push-to-ebay-' + objItem.product_id + '"';
    sHTML += ' data-productid="' + objItem.product_id + '"';
    sHTML += ' class="' + sButtonClass + '"';
    sHTML += sDisabled + '>';
    sHTML += sButtonText;
    sHTML += '</button>';
    sHTML += '<button class="btn btn-default dropdown-toggle"';
    sHTML += 'data-toggle="dropdown" ';
    sHTML += '>';
    sHTML += '<span class="caret"></span>';
    sHTML += '</button>';
    sHTML += '<ul class="dropdown-menu">';
    sHTML += '<li><a href="#" class="btn btn-action view-details" id="view-details-'+objItem.product_id+'" data-itemid="'+objItem.product_id+'">View details</a></li>';
    sHTML += '</ul>';
    sHTML += '</div>';
    sHTML += '</div>';
    return sHTML;
  }
    
  objStoreCatalogueListingPanel.getItemListPagination = function() {
    
    var arrLimitOptions = [5, 20, 30, 50, 100];
    
    var nCurrentLimit  = parseInt(objStoreCatalogueListingPanel.objFilters.nLimit);
    var nCurrentOffset = parseInt(objStoreCatalogueListingPanel.objFilters.nOffset);
    var nItemCount     = parseInt(objStoreCatalogueListingPanel.nItemCount);
    var nTotalPages    = Math.floor(nItemCount / nCurrentLimit) + 1;
    
    var nCurrentPage = 0;
    if (nCurrentOffset !== 0) {
      var nCurrentPage = Math.floor(nCurrentOffset / nCurrentLimit) + 1;
    }
    
    var sHTML = '';
    
    sHTML += '<div id="pagination-panel">';
    
    sHTML += '<div class="col-sm-3">';
    sHTML += '<label>Items per page </label>';
    sHTML += '<select id="item-limit-menu">';
    for (var i = 0; i < arrLimitOptions.length; i++) {
      sHTML += '<option value="'+arrLimitOptions[i]+'"';
      if (objStoreCatalogueListingPanel.objFilters.nLimit == arrLimitOptions[i]) {
        sHTML += 'selected="selected"';
      }
      sHTML += '>'+arrLimitOptions[i]+'</option>';
    }
    sHTML += '</select>';
    sHTML += '</div>';
    
    sHTML += '<div class="item-count col-sm-3">';
    sHTML += '<label>Items ';
    sHTML += '<input type="text" class="input-mini" value="'+nItemCount+'" readonly>';
    sHTML += '</label>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-6 pagination text-right">';
    sHTML += '<ul>';
    
    if (nTotalPages === 1) {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>1</a></li>';
      
    } else if (nTotalPages === 2) {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>Last</a></li>';
      
    } else if (nTotalPages === 3) {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>Last</a></li>';
      
    } else if (nTotalPages === 4) {
      sHTML += '<li class="pagination-link" data-nOffset="0""><a>First</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>3</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 3)+'"><a>Last</a></li>';
      
    } else if (nTotalPages < 10){
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      for (var i = 1; i < nTotalPages; i++) {
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * i)+'"><a>'+i+'</a></li>';
      }
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * nTotalPages)+'"><a>Last</a></li>';
      
    } else {
      
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      
      if (nCurrentPage === 0) {
        sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>3</a></li>';
        sHTML += '<li class="pagination-link"><a>...</a></li>';
        
      } else if (nCurrentPage === 1) {
        sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>3</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 3)+'"><a>4</a></li>';
        
      } else if (nCurrentPage === nTotalPages) {
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 3) * nCurrentLimit)+'"><a>'+(nCurrentPage - 3)+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 2) * nCurrentLimit)+'"><a>'+(nCurrentPage - 2)+'</a></li>';
        
      } else if  ((nCurrentPage + 2) > nTotalPages) {
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 1) * nCurrentLimit)+'"><a>'+(nCurrentPage - 1)+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentPage * nCurrentLimit)+'"><a>'+nCurrentPage+'</a></li>';
        if (nCurrentPage + 1 < nTotalPages) {
          sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage + 1) * nCurrentLimit)+'"><a>'+(nCurrentPage + 1)+'</a></li>';
        }
        
      } else {
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 1) * nCurrentLimit)+'"><a>'+(nCurrentPage - 1)+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentPage * nCurrentLimit)+'"><a>'+nCurrentPage+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage + 1) * nCurrentLimit)+'"><a>'+(nCurrentPage + 1)+'</a></li>';
      }
      
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * (nTotalPages - 1))+'"><a>Last</a></li>';
    }
    
    sHTML += '</ul>';
    sHTML += '</div>';
    
    
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objStoreCatalogueListingPanel.getDepartmentLink = function(nDepartmentID) {
    var objStoreStructure = app.objModel.objStoreCatalogueModel.objData.objStoreStructure;
    
    for (var key in objStoreStructure) {
      if (objStoreStructure[key].department_id === nDepartmentID) {
        return objStoreStructure[key].department_link;
      }
    }
  };
  
  objStoreCatalogueListingPanel.getCategoryLink = function(nCategoryID) {
    var objStoreStructure = app.objModel.objStoreCatalogueModel.objData.objStoreStructure;
    
    for (var deptKey in objStoreStructure) {
      for (var catKey in objStoreStructure[deptKey].children) {
        if (objStoreStructure[deptKey].children[catKey].category_id === nCategoryID) {
          return objStoreStructure[deptKey].children[catKey].category_link;
        }
      }
    }
  };
  
  objStoreCatalogueListingPanel.getProductDetails = function(nProductID, bRenderDetails) {
    var objDetails = app.objModel.objEbayCatalogueModel.getItem(nProductID);
    
    /* If we already have a details panel open, we first close it */
    if (nsc('#item-listing-panel').attr('class') !== 'span12') {
      objStoreCatalogueListingPanel.toggleDetailsPanel();
    }
    
    /* The general data fetch doesn't return product_weblinxcustomtextfields so
     * if it isn't present, we make the AJAX call. */
    if (typeof objDetails === 'undefined' 
      || typeof objDetails.product_weblinxcustomtext1 === 'undefined'
      || (objDetails.ttl < Date.now()) ) {
     
      var jsonData       = objStoreCatalogueListingPanel.objFilters;
      jsonData.nID       = nProductID;
      jsonData.objFields = 'all';

      var jqxhr = nsc.ajax({
        url      : objStoreCatalogueListingPanel.getSetting('sItemURL'),
        data     : jsonData,
        dataType : "json",
        type     : "get"
      });

      jqxhr.done(function(responsedata) {

        objStoreCatalogueListingPanel.objFilters = responsedata.objFilters;

        objStoreCatalogueListingPanel.loadItems(responsedata._embedded.items);

        if (bRenderDetails) {
          objStoreCatalogueListingPanel.renderDetails(nProductID);
        }
      });

      jqxhr.fail(function(xhr, status, errorThrown) {
        console.log('FAIL');
        console.log(xhr.responseText);
        console.log(status);
        console.log(errorThrown);
      });

      jqxhr.always(function() {

      });
    } else {
      objStoreCatalogueListingPanel.renderDetails(nProductID);
    }
  };
  
  objStoreCatalogueListingPanel.getItemListPagination = function() {
    var objFilterData = app.objModel.objStoreCatalogueModel.objFilters;
    var arrLimitOptions = [5, 20, 30, 50, 100];
    
    var nCurrentLimit  = parseInt(objFilterData.nLimit);
    var nCurrentOffset = parseInt(objFilterData.nOffset);
    var nItemCount     = parseInt(objFilterData.nItemCount);
    var nTotalPages    = Math.floor(nItemCount / nCurrentLimit) + 1;
    
    var nCurrentPage = 0;
    if (nCurrentOffset !== 0) {
      var nCurrentPage = Math.floor(nCurrentOffset / nCurrentLimit) + 1;
    }

    var sHTML = '';
    
    sHTML += '<div id="pagination-panel">';
    
    sHTML += '<span>';
    sHTML += '<label>Items per page&nbsp;</label>';
    sHTML += '<select id="item-limit-menu">';
    for (var i = 0; i < arrLimitOptions.length; i++) {
      sHTML += '<option value="'+arrLimitOptions[i]+'"';
      if (objFilterData.nLimit == arrLimitOptions[i]) {
        sHTML += 'selected="selected"';
      }
      sHTML += '>'+arrLimitOptions[i]+'</option>';
    }
    sHTML += '</select>';
    sHTML += '</span>';
    
    sHTML += '<span class="item-count">';
    sHTML += '&nbsp;<label>Items ';
    sHTML += '<input type="text" class="input-mini" value="'+nItemCount+'" readonly>';
    sHTML += '</label>';
    sHTML += '</span>';
    
    sHTML += '<span>';
    sHTML += '<ul class="pagination pagination-sm pull-right">';
    
    if (nTotalPages === 1) {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>1</a></li>';
      
    } else if (nTotalPages === 2) {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>Last</a></li>';
      
    } else if (nTotalPages === 3) {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>Last</a></li>';
      
    } else if (nTotalPages === 4) {
      sHTML += '<li class="pagination-link" data-nOffset="0""><a>First</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>3</a></li>';
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 3)+'"><a>Last</a></li>';
      
    } else if (nTotalPages < 10){
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      for (var i = 1; i < nTotalPages; i++) {
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * i)+'"><a>'+i+'</a></li>';
      }
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * nTotalPages)+'"><a>Last</a></li>';
      
    } else {
      sHTML += '<li class="pagination-link" data-nOffset="0"><a>First</a></li>';
      
      if (nCurrentPage === 0) {
        sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>3</a></li>';
        sHTML += '<li class="pagination-link"><a>...</a></li>';
        
      } else if (nCurrentPage === 1) {
        sHTML += '<li class="pagination-link" data-nOffset="'+nCurrentLimit+'"><a>2</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 2)+'"><a>3</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * 3)+'"><a>4</a></li>';
        
      } else if (nCurrentPage === nTotalPages) {
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 3) * nCurrentLimit)+'"><a>'+(nCurrentPage - 3)+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 2) * nCurrentLimit)+'"><a>'+(nCurrentPage - 2)+'</a></li>';
        
      } else if  ((nCurrentPage + 2) > nTotalPages) {
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 1) * nCurrentLimit)+'"><a>'+(nCurrentPage - 1)+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentPage * nCurrentLimit)+'"><a>'+nCurrentPage+'</a></li>';
        if (nCurrentPage + 1 < nTotalPages) {
          sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage + 1) * nCurrentLimit)+'"><a>'+(nCurrentPage + 1)+'</a></li>';
        }
        
      } else {
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage - 1) * nCurrentLimit)+'"><a>'+(nCurrentPage - 1)+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentPage * nCurrentLimit)+'"><a>'+nCurrentPage+'</a></li>';
        sHTML += '<li class="pagination-link" data-nOffset="'+((nCurrentPage + 1) * nCurrentLimit)+'"><a>'+(nCurrentPage + 1)+'</a></li>';
      }
      
      sHTML += '<li class="pagination-link" data-nOffset="'+(nCurrentLimit * (nTotalPages - 1))+'"><a>Last</a></li>';
    }
    
    sHTML += '</ul>';
    sHTML += '</span>';
    
    sHTML += '</div>';
    
    return sHTML;
  };  
  
  objStoreCatalogueListingPanel.showItemDetails = function(itemID) {
    app.objModel.objStoreCatalogueModel.nCurrentItem = itemID;
    objStoreCatalogueListingPanel.showModal();
  };
  
  objStoreCatalogueListingPanel.getModalBodyMarkup = function() {
    var objItem = app.objModel.objStoreCatalogueModel.getItemById(app.objModel.objStoreCatalogueModel.nCurrentItem);
    
    var sHTML = '';
    
    sHTML += '<dl>';
    for (var sKey in objItem) {
      sHTML += '<dt>'+sKey+'</dt>';
      sHTML += '<dd>'+objItem[sKey]+'</dd>';
    }
    sHTML += '</dl>';
    
    return sHTML;
  };
  
  objStoreCatalogueListingPanel.getModalFooterMarkup = function() {
    var sHTML = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    return sHTML;
  };
  
  return objStoreCatalogueListingPanel;
});