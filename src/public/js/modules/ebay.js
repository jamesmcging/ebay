/*global nsc, localStorage, objInterface*/

/**
 * A panel object is the base of all interfaces. This is to be extended for each
 * panel (or tab) that you want to appear in an interface.
 * 
 * @returns {Panel.objPanel}
 */
var Panel = function() {
  
  var objPanel = {
    sName          : 'Vanilla Panel',
    sCode          : 'vanilla_panel',
    objChildPanels : {},
    objSettings    : {}
  };
  
  objPanel.getPanelName = function() {
    return objPanel.sName;
  };
  
  objPanel.getPanelCode = function() {
    return objPanel.sCode;
  };
  
  objPanel.initialize = function(objSettings) {
    
    /* First give the panel its settings */
    if (typeof objSettings[objPanel.sCode] !== 'undefined') {
      objPanel.objSettings = objSettings[objPanel.sCode];
    }
    
    /* Add child panels */
    objPanel.addChildPanels();
        
    /* Initial render of the panel */
    objPanel.renderPanel();
    
    /* Build any child panels */
    objPanel.initializeChildPanels(objSettings);

    /* Make the panel interactive */
    objPanel.setListeners();
    
    /* Trigger each child panel post-rendering code */
    objPanel.run();
  };
  
  
  objPanel.addChildPanels = function() {};
  
  /**
   * This function must put in place elements for the panels child panels to be 
   * rendered into. No more than that needs done. The panel can be fleshed out
   * when run is called on it or even later when setActive is called on it.
   * 
   * @returns {String}
   */
  objPanel.renderPanel = function() {
    var sHTML = '';
    sHTML += '<div class="panel" id="'+objPanel.getPanelCode()+'">';
    for (var sChildPanel in objPanel.objChildPanels) {
      sHTML += '<div class="panel" id="'+objPanel.objChildPanels[sChildPanel].getPanelCode()+'">'+objPanel.objChildPanels[sChildPanel].getPanelCode()+' content</div>';
    }
    sHTML += '</div><!-- .class -->';
    nsc('#'+objPanel.getPanelCode()).replaceWith(sHTML);
  };
  
  objPanel.initializeChildPanels = function(objSettings) {
    for (var sChildPanel in objPanel.objChildPanels) {
      objPanel.objChildPanels[sChildPanel].initialize(objSettings);
    }
  };
  
  /**
   * Function called when the panel is rendered. Allows the panel to re-attach
   * listeners to itself;
   * 
   * @returns {Boolean}
   */
  objPanel.setListeners = function() {
    /* This is to be over ridden by panel specific code. */
    return true;
  };
  
  /**
   * Function triggered when a user clicks into this panel. Override it in the 
   * panel code if you need an action to happen when this panel becomes active.
   * 
   * @returns {Boolean}
   */
  objPanel.setActive = function() {
    /* This is to be over ridden by panel specific code. */
    nsc('#'+objPanel.sCode).show();
    return true;
  };
  
  objPanel.getSettings = function() {
    return objSettings;
  };
  
  objPanel.getSetting = function(sSettingName) {
    var sResponse = undefined;
    if (objPanel.objSettings[sSettingName]) {
      sResponse = objPanel.objSettings[sSettingName];
    }

    return sResponse;
  };
  
  objPanel.run = function() {
    for (var sChildPanel in objPanel.objChildPanels) {
      objPanel.objChildPanels[sChildPanel].run();
    }
  };
  
  return objPanel;
};


/**
 * The root panel into which all other panels are placed. This panel is created
 * and initialized with settings from the back end code.
 *  
 * @returns {Panel|Interface.objInterface}
 */
var Interface = function() {
  
  var objInterface = new Panel();
  
  objInterface.sCode = 'interface';
  objInterface.sName = 'Interface';
  
  objInterface.addChildPanels = function() {
    objInterface.objChildPanels.dashboard = new Dashboard();
    
    objInterface.objChildPanels.storecatalogue = new StoreCatalogue();
    
    objInterface.objChildPanels.ebaycatalogue = new EbayCatalogue();
    
    objInterface.objChildPanels.ebaylistings = new EbayListings();
    
    objInterface.objChildPanels.ebayorders = new EbayOrders();
  };
  
  objInterface.renderPanel = function() {
    var sHTML = '';
    sHTML += '<div class="panel" id="'+objInterface.getPanelCode()+'">';
    sHTML += '  <ul class="nav nav-tabs" id="main-nav">';
    for (var sChildPanel in objInterface.objChildPanels) {
      var sPanelName = objInterface.objChildPanels[sChildPanel].getPanelName();
      var sPanelCode = objInterface.objChildPanels[sChildPanel].getPanelCode(); 
      sHTML += '<li><a data-panelkey="'+sPanelCode+'" data-toggle="tab">'+sPanelName+'</a></li>';
    }
    sHTML += '  </ul>';
    
    sHTML += '  <div class="tab-content">';
    for (var sChildPanel in objInterface.objChildPanels) {
      sHTML += '<div class="panel tab-pane" id="'+objInterface.objChildPanels[sChildPanel].getPanelCode()+'"></div>';
    }
    sHTML += '  </div>';
    sHTML += '</div>';
    nsc('#pagebody').replaceWith(sHTML);
  };
  
  objInterface.setListeners = function() {
    
    /* Handle the switching of tabs on the main nav menu. When a tab is clicked
     * the tab content of all the tabs are hidden, the tab being activated is 
     * told it is about to be made active, then the panel associated with the 
     * tab is shown.*/
    nsc('#main-nav a').on('click', function() {
      /* Hide all tabbed panel content */
      nsc('.tab-pane').hide();
      
      /* Get the tab being activated */
      var sPanelkey = this.dataset['panelkey'];
      
      /* Tell the panel it is being made active */
      objInterface.objChildPanels[sPanelkey].setActive();
    });
    
    /* Make the first tab active */
    nsc('#main-nav a:first').click();
    
    /* while we are working on the store catalogue cheat and automatically click it */
    //nsc('[data-panelkey="storecatalogue"]').click();
  };
  
  return objInterface;
};

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// Dashboard Tab                                                              //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
/**
 * This panel is the first panel that the user will see when using this 
 * interface. It acts as the nerve centre of the interface where all relevent 
 * information should be visible at once. It contains links to other panels that
 * deal specific parts in detail.
 * 
 * This extends Panel.
 * 
 * @returns {Panel|Dashboard.objDashboard}
 */
var Dashboard = function() {
  
  var objDashboard = new Panel();
  
  objDashboard.sCode = 'dashboard';
  objDashboard.sName = 'Dashboard';
  
  objDashboard.addChildPanels = function() {
    objDashboard.objChildPanels.welcomepanel    = new WelcomePanel();
    objDashboard.objChildPanels.ebaystatuspanel = new EbayStatusPanel();
    objDashboard.objChildPanels.credentialpanel = new EbayCredentialStatusPanel();
    objDashboard.objChildPanels.policypanel     = new EbayPolicyStatusPanel();
    objDashboard.objChildPanels.locationpanel   = new EbayLocationStatusPanel();
    objDashboard.objChildPanels.mappingpanel    = new EbayMappingStatusPanel();
    objDashboard.objChildPanels.pushtoebay      = new StoreCatalogueStatusPanel();
    objDashboard.objChildPanels.createoffer     = new EbayOfferStatusPanel();
    objDashboard.objChildPanels.createlisting   = new EbayListingStatusPanel();
    objDashboard.objChildPanels.manageorders    = new EbayOrderStatusPanel();
  };
  
  objDashboard.renderPanel = function() {
    var sHTML = '';
    sHTML += '<div class="tab-pane" id="'+objDashboard.getPanelCode()+'">';    
    sHTML += '<div class="row-fluid">';

    sHTML += '<div id="dashboard-main-panel" class="span8">';
    sHTML += '  <div class="panel" id="welcomepanel"></div>';
    sHTML += '  <div class="panel" id="ebaystatuspanel"></div>';
    sHTML += '</div><!-- #dashboard-main-panel -->';
    
    sHTML += '<div id="dashboard-secondary-panel" class="span4">';
    sHTML += '  <div class="panel status-panel" id="credentialpanel"></div>';
    sHTML += '  <div class="panel status-panel" id="policypanel"></div>';
    sHTML += '  <div class="panel status-panel" id="locationpanel"></div>';
    sHTML += '  <div class="panel status-panel" id="mappingpanel"></div>';
    sHTML += '  <div class="panel status-panel" id="pushtoebay"></div>';
    sHTML += '  <div class="panel status-panel" id="createoffer"></div>';
    sHTML += '  <div class="panel status-panel" id="createlisting"></div>';
    sHTML += '  <div class="panel status-panel" id="manageorders"></div>';
    sHTML += '</div><!-- #dashboard-secondary-panel -->';    
    
    sHTML += '</div><!-- .row-fluid -->';
    sHTML += '</div><!-- .tab-pane -->';
    
    nsc('#' + objDashboard.getPanelCode()).replaceWith(sHTML);
    
    nsc('#' + objDashboard.getPanelCode()).show();
  };
  
  objDashboard.setListeners = function() {
    /* This is to be over ridden by panel specific code. */
    return true;
  };
  
  return objDashboard;
};

var WelcomePanel = function() {
  var objWelcomePanel = new Panel();
  
  objWelcomePanel.sCode = 'welcomepanel';
  objWelcomePanel.sName = 'Welcome';
  
  objWelcomePanel.renderPanel = function() {
    var sHTML = '';
    sHTML += '<div class="panel bordered-panel" id="'+objWelcomePanel.getPanelCode()+'">';
    sHTML += '  <div class="panel-title">'+objWelcomePanel.getPanelName()+'</div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Welcome to your eBay mangement tool.</p>';    
    sHTML += '    <p>Here you can set various eBay policies, push items from ';
    sHTML += 'your store to eBay, create eBay offerings, create or remove eBay ';
    sHTML += 'listings and view any orders that arise.</p>';
    sHTML += '    <p>The status panels on your right should be visited in turn. ';
    sHTML += 'As you successfully complete the step in the status panel it will ';
    sHTML += 'turn green indicating that it is complete.';
    sHTML += '    <p>Good luck!</p>';
    sHTML += '  </div>';
    sHTML += '</div><!-- #welcomepanel -->';
    nsc('#' + objWelcomePanel.getPanelCode()).replaceWith(sHTML);
  };
  
  return objWelcomePanel;
};

var EbayStatusPanel = function() {
  var objEbayStatusPanel = new Panel();
  
  objEbayStatusPanel.sCode = 'ebaystatuspanel';
  objEbayStatusPanel.sName = 'eBay Status';
  
  objEbayStatusPanel.renderPanel = function() {
    var sHTML = '';
    sHTML += '<div class="panel bordered-panel" id="'+objEbayStatusPanel.getPanelCode()+'">';
    sHTML += '  <div class="panel-title">Summary</div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <table class="table table-striped">';
    sHTML += '      <tr>';
    sHTML += '        <td>Store Sku Count</td>';
    sHTML += '        <td>0</td>';
    sHTML += '      </tr>';
    sHTML += '      <tr>';
    sHTML += '        <td>eBay Sku Count</td>';
    sHTML += '        <td>0</td>';
    sHTML += '      </tr>';
    sHTML += '      <tr>';
    sHTML += '        <td>eBay Offer Count</td>';
    sHTML += '        <td>0</td>';
    sHTML += '      </tr>';
    sHTML += '      <tr>';
    sHTML += '        <td>eBay Listing Count</td>';
    sHTML += '        <td>0</td>';
    sHTML += '      </tr>';
    sHTML += '      <tr>';
    sHTML += '        <td>eBay Order Count</td>';
    sHTML += '        <td>0</td>';
    sHTML += '      </tr>';
    sHTML += '    </table>';
    sHTML += '  </div>';
    sHTML += '</div><!-- #ebaystatuspanel -->';
    nsc('#' + objEbayStatusPanel.getPanelCode()).replaceWith(sHTML);
  };
  
  return objEbayStatusPanel;
};

var StatusPanel = function() {
  var objStatusPanel = new Panel();
  
  objStatusPanel.sStatus = 'inactive';
  objStatusPanel.sInfo = '';
  
  objStatusPanel.renderPanel = function() {
    var sHTML = '';
    var sActivationClass = (objStatusPanel.sStatus === 'active') ? 'status-panel-active' : 'status-panel-inactive';
    sHTML += '<div ';
    sHTML += 'class="panel status-panel '+sActivationClass+'" ';
    sHTML += 'id="'+objStatusPanel.getPanelCode()+'" ';
    sHTML += 'data-toggle="tooltip" title="'+objStatusPanel.sInfo+'" ';
    sHTML += '>';
    sHTML += '<span class="status-panel-title">'+objStatusPanel.sName+'</span>';
    sHTML += '<br>';
    sHTML += '<span class="status-panel-link ghost">Click to set or modify</span>';
    sHTML += '</div><!-- #statuspanel -->';
        
    nsc('#' + objStatusPanel.getPanelCode()).replaceWith(sHTML);
  };
  
  objStatusPanel.setListeners = function() {
    nsc('.status-panel').tooltip({placement : 'left'});
  };
  
  return objStatusPanel; 
};

var EbayCredentialStatusPanel = function() {
  var objCredentialPanel = new StatusPanel();
  
  objCredentialPanel.sCode = 'credentialpanel';
  objCredentialPanel.sName = 'eBay Credentials';  
  objCredentialPanel.sInfo = 'Use this to enter your eBay credentials so that we can talk to eBay on your behalf.';
  
  return objCredentialPanel;
};

var EbayPolicyStatusPanel = function() {
  var objPolicyPanel = new StatusPanel();
  
  objPolicyPanel.sCode = 'policypanel';
  objPolicyPanel.sName = 'eBay Policies';
  objPolicyPanel.sInfo = 'Use this to add/modify your eBay shipping, return and payment policies.';

  
  return objPolicyPanel;
};

var EbayLocationStatusPanel = function() {
  var objLocationPanel = new StatusPanel();
  
  objLocationPanel.sCode = 'locationpanel';
  objLocationPanel.sName = 'Store Location';
  objLocationPanel.sInfo = 'Use this to add/modify you seller location.';

  
  return objLocationPanel;
};

var EbayMappingStatusPanel = function() {
  var objMappingPanel = new StatusPanel();
  
  objMappingPanel.sCode = 'mappingpanel';
  objMappingPanel.sName = 'Mappings';
  objMappingPanel.sInfo = 'Use this to add/modify how your store data is mapped to your eBay listings.';

  
  return objMappingPanel;
};

var StoreCatalogueStatusPanel = function() {
  var objPushToEbay = new StatusPanel();
  
  objPushToEbay.sCode = 'pushtoebay';
  objPushToEbay.sName = 'Store Catalogue';
  objPushToEbay.sInfo = 'Select items on your store to push to your eBay catalogue.';
  
  objPushToEbay.setListeners = function() {    
    nsc('#'+objPushToEbay.getPanelCode()).off().on('click', function() {
      nsc('[data-panelkey="storecatalogue"]').click();
    });
  };
  
  return objPushToEbay;
};

var EbayOfferStatusPanel = function() {
  var objCreateOfferPanel = new StatusPanel();
  
  objCreateOfferPanel.sCode = 'createoffer';
  objCreateOfferPanel.sName = 'Create eBay Offers';
  objCreateOfferPanel.sInfo = 'Select items in your eBay catalogue to turn into Ebay listings.';
  
  return objCreateOfferPanel;
};

var EbayListingStatusPanel = function() {
  var objListingPanel = new StatusPanel();
  
  objListingPanel.sCode = 'createlisting';
  objListingPanel.sName = 'Create eBay Listings';
  objListingPanel.sInfo = 'View your eBay listings.';

  
  return objListingPanel;
};

var EbayOrderStatusPanel = function() {
  var objManageOrders = new StatusPanel();
  
  objManageOrders.sCode = 'manageorders';
  objManageOrders.sName = 'View eBay Orders';
  objManageOrders.sInfo = 'View your eBay orders.';
  
  return objManageOrders;
};

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// Store Catalogue  Tab                                                       //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
var Catalogue = function() {
  
  var objCatalogue = new Panel();
  
  objCatalogue.sCatalogueKey = 'catalogue';
  
  objCatalogue.N_ITEM_DATA_TTL = (60 * 60 * 24 * 7); // Data has a TTL of 1 week

  objCatalogue.loadItems = function(arrItems) {
    for (var key in arrItems) {  
      this.putItem(arrItems[key]);
    }
  };

  objCatalogue.putItem = function(objItem) {

    var sStoreKey = this.sCatalogueKey + '-' + objItem['product_id'];
    
    /* Retrieve any stored data we have on this item */
    var sItem = localStorage.getItem(sStoreKey);
    if (sItem) {
      /* localStorage only stores strings */
      var objStoredItem = JSON.parse(sItem);
      
      /* update the item with the new data */
      for (var sKey in objItem) {
        objStoredItem[sKey] = objItem[sKey];
      }
      
      objItem = objStoredItem;
    }
    
    /* Add a timestamp to the item indicating when it was updated */
    objItem.ttl = Date.now() + objCatalogue.N_ITEM_DATA_TTL;
    
    /* Turn our item into a string before sticking it in local storage */
    localStorage.setItem(sStoreKey, JSON.stringify(objItem));
  };

  objCatalogue.getItem = function(sID) {
    var sItemKey = this.sCatalogueKey + '-' + sID;
    var sItem = localStorage.getItem(sItemKey);
    var objItem = JSON.parse(sItem);
    return objItem;
  };

  return objCatalogue;
};

var StoreCatalogue = function() {
  
  var objStoreCatalogue = new Catalogue();
  
  objStoreCatalogue.sCode = 'storecatalogue';
  
  objStoreCatalogue.sName = 'Store Catalogue';
  
  objStoreCatalogue.sCatalogueKey = 'store_catalogue';
  
  objStoreCatalogue.sCurrencySymbol = '';
  
  objStoreCatalogue.objPossibleProducts = {};
  
  objStoreCatalogue.objFilters = {};
  
  objStoreCatalogue.initialize = function(objSettings) {
    objStoreCatalogue.objSettings = objSettings[objStoreCatalogue.sCode];
    objStoreCatalogue.objFilters = objSettings[objStoreCatalogue.sCode].objSearchSettings;
    objStoreCatalogue.sCurrencySymbol = objSettings[objStoreCatalogue.sCode].sCurrencySymbol;
  };
  
  objStoreCatalogue.setListeners = function() {
    /* This code handles the columns sorting */
    nsc('.sort-field').off().on('click', function() {
      if (objStoreCatalogue.objFilters.sOrderByDirection === 'ASC') {
        nsc('.sort-field').removeClass('sort-field-ascending');
        nsc('.sort-field').addClass('sort-field-descending');
        objStoreCatalogue.objFilters.sOrderByDirection = 'DESC';
      } else {
        nsc('.sort-field').removeClass('sort-field-descending');
        nsc('.sort-field').addClass('sort-field-ascending');
        objStoreCatalogue.objFilters.sOrderByDirection = 'ASC';
      }
      objStoreCatalogue.objFilters.sOrderByField = nsc(this).data('sortfield');
      objStoreCatalogue.getItemsFromAPI();
    });
    
    /* This code makes the category filter drop down adjust depending on the
     * selected department. */
    nsc('#department-filter').off().on('change', function() {
      objStoreCatalogue.objFilters.nDeptID = nsc(this).val();
      
      nsc('#category-filter').replaceWith(objStoreCatalogue.getCategoryFilterMarkup(objStoreCatalogue.objFilters.nDeptID));
      
      objStoreCatalogue.objFilters.nOffset = 0;
      
      objStoreCatalogue.setListeners();
    });
    
    /* This code makes the department filter down down adjust depending on the 
     * selected category. */
    nsc('#category-filter').off().on('change', function() {
      var nCurrentCategoryID = nsc(this).val();
      var objStoreStructure = objStoreCatalogue.getSetting('objStoreStructure');
      for (var nDeptID in objStoreStructure) {
        for (var nCatID in objStoreStructure[nDeptID].children) {
          if (objStoreStructure[nDeptID].children[nCatID].category_id === nCurrentCategoryID) {
            objStoreCatalogue.objFilters.nDeptID = nDeptID;
          }
        }
      }
      
      /* Reset the offset */
      objStoreCatalogue.objFilters.nOffset = 0;
      
      objStoreCatalogue.objFilters.nCatID = nCurrentCategoryID;
      nsc('#department-filter').val(objStoreCatalogue.objFilters.nDeptID);
    });
    
    nsc('#brand-filter').off().on('change', function() {
      objStoreCatalogue.objFilters.sBrandName = nsc(this).val();
    });
    
    nsc('#theme-filter').off().on('change', function() {
      objStoreCatalogue.objFilters.sTheme = nsc(this).val();
    });
    
    nsc('#button-filter').off().on('click', function() {
      objStoreCatalogue.getItemsFromAPI();
    });
    
    nsc('#button-filter-reset').off().on('click', function() {
      objStoreCatalogue.objFilters.nID = '';
      objStoreCatalogue.objFilters.nCatID = 'all';
      objStoreCatalogue.objFilters.nDeptID = 'all';
      objStoreCatalogue.objFilters.sBrandName = '';
      objStoreCatalogue.objFilters.sTheme = '';
      nsc('#store-catalogue-filter-box').replaceWith(objStoreCatalogue.getFilterPanelMarkup());
      objStoreCatalogue.getItemsFromAPI();
      objStoreCatalogue.setListeners();
    });
    
    nsc('.btn-action').off().on('click', function() {
      var nProductID = nsc(this).parent().data('product_id');
      objStoreCatalogue.getProductDetails(nProductID, true);
    });
    
    nsc('#toggle-itemdetails').off().on('click', function() {
      objStoreCatalogue.toggleDetailsPanel();
    });
    
    nsc('#item-limit-menu').on('change', function() {
      objStoreCatalogue.objFilters.nLimit = nsc(this).val();
      objStoreCatalogue.getItemsFromAPI();
    });
    
    nsc('.item_offset').on('click', function() {
      objStoreCatalogue.objFilters.nOffset = (nsc(this).val() * objStoreCatalogue.objFilters.nLimit);
    });
    
    nsc('.pagination-link').on('click', function() {
      objStoreCatalogue.objFilters.nOffset = nsc(this).data('noffset');
      objStoreCatalogue.getItemsFromAPI();
    });
    
    /* Make the search input into a typeahead search box. This uses the
     * native Bootstrap 2.3.2 Typeahead, NOT the Twitter typeahead.js */
    var MIN_QUERY_LENGTH = 3;
    var NUMBER_OF_ITEMS_TO_SHOW = 15;
    nsc('#finditem').typeahead({
      minLength : MIN_QUERY_LENGTH,
      items : NUMBER_OF_ITEMS_TO_SHOW,
      source: function (sQueryValue, process) {
        /* Reset the array of matches */
        var arrMatches = [];

        /* Ask the server for products that match the query string */
        var jqxhr = nsc.ajax({url  : '/store/administration/ajax/findproduct.nsc',
                              data : {action : 'typeaheadlookup',
                                      query  : nsc('#finditem').val()
                              },
                              dataType : "json",
                              type     : "post"
        });

        /* Stick all products returned into objCharityManager.objProductData */
        jqxhr.done(function(responsedata, textStatus, jqXHR) {
          if (responsedata.bOutcome) {
            for (var nProductID in responsedata.arrProducts) {
              objStoreCatalogue.objPossibleProducts[nProductID] = responsedata.arrProducts[nProductID];
              arrMatches.push(nProductID);
            }
          }
          process(arrMatches);
        });
      },

      updater: function (nProductID) {
        objStoreCatalogue.objFilters.nID = nProductID;
        objStoreCatalogue.getItemsFromAPI();
        return '';
      },

      matcher: function (item) {
        return true;
      },

      sorter: function (items) {
        return items;
      },

      highlighter: function (nProductID) {
        var sProductName = objStoreCatalogue.objPossibleProducts[nProductID]['product_name'];
        var regex = new RegExp( '(' + this.query + ')', 'gi');
        var sProductName = sProductName.replace(regex, "<strong>$1</strong>");
        return sProductName;
      }
    });

    /* Make the search box the default input on the interface */
    nsc('#finditem').focus();


    nsc('#checkbox-all-store-items').off().on('click', function() {
      if (nsc(this).attr('checked')) {
        nsc('.item-checkbox').attr('checked', 'checked');
        nsc('#group-action').removeAttr('disabled');
      } else {
        nsc('.item-checkbox').removeAttr('checked');
        nsc('#group-action').attr('disabled', 'disabled');
      }
    });
    
    nsc('.item-checkbox').off().on('click', function() {
      if (nsc(this).attr('checked')) {
        nsc('#group-action').removeAttr('disabled');
      } else {
        var arrCheckboxes = nsc('.item-checkbox:checked');
        if (arrCheckboxes.length === 0) {
          nsc('#group-action').attr('disabled', 'disabled');
        }
      }
    });
  };
  
  objStoreCatalogue.setActive = function() {
    objStoreCatalogue.getItemsFromAPI();
  };

  objStoreCatalogue.renderPanel = function(arrItemIDs) {
    var sHTML = '';
    
    sHTML += '<div class="tab-pane" id="'+objStoreCatalogue.getPanelCode()+'">';
    
    sHTML += objStoreCatalogue.getSearchPanelMarkup();
    
    sHTML += '<div class="row-fluid" style="height:100%;">';
    
    sHTML += '<div id="item-listing-panel" class="span12">';
    if (arrItemIDs && arrItemIDs.length) {
      sHTML += objStoreCatalogue.getFilterPanelMarkup();
      sHTML += objStoreCatalogue.getItemListMarkup(arrItemIDs);
      sHTML += objStoreCatalogue.getItemListPagination();
      
    /* If the app is unable to retrieve items from the store */  
    } else {
      sHTML += objStoreCatalogue.getFilterPanelMarkup();
      sHTML += 'Current filter returns no items.';
    }
    sHTML += '</div><!-- #item-listing-panel -->';
    
    sHTML += '<div id="item-details-panel">';
    sHTML += '</div><!-- #item-details-panel -->';
    
    sHTML += '</div><!-- .row-fluid -->';
    
    sHTML += '</div><!-- .tab-pane -->';

    nsc('#' + objStoreCatalogue.getPanelCode()).replaceWith(sHTML);

    nsc('#' + objStoreCatalogue.getPanelCode()).show();
  };
  
  objStoreCatalogue.renderDetails = function(nProductID) {
    var objItemDetails = objStoreCatalogue.getItem(nProductID);
    
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
      objStoreCatalogue.setListeners();
      objStoreCatalogue.toggleDetailsPanel(nProductID);
    }
  };
  
  objStoreCatalogue.toggleDetailsPanel = function(nProductID) {
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
  
  objStoreCatalogue.getSearchPanelMarkup = function() {
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
  
  objStoreCatalogue.getFilterPanelMarkup = function() {
    var sHTML = '';
    
    sHTML += '<div id="store-catalogue-filter-box">';
    sHTML += 'Filters: ';
    sHTML += objStoreCatalogue.getDepartmentFilterMarkup();
    sHTML += objStoreCatalogue.getCategoryFilterMarkup();
    sHTML += objStoreCatalogue.getBrandFilterMarkup();
    sHTML += objStoreCatalogue.getThemeFilterMarkup();
    sHTML += objStoreCatalogue.getPriceFilterMarkup();
    sHTML += objStoreCatalogue.getStockFilterMarkup();
    sHTML += '<div class="btn-group pull-right">';
    sHTML += '<button id="button-filter-reset" class="btn">Clear Filters</button>';
    sHTML += '<button id="button-filter" class="btn btn-info pull-right">Filter</button>';
    sHTML += '</div>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objStoreCatalogue.getDepartmentFilterMarkup = function() {
    var sHTML = '';
    var objStoreStructure = objStoreCatalogue.getSetting('objStoreStructure');
    
    sHTML += '<span class="catalogue-filter">';
    sHTML += '<select id="department-filter">';
    sHTML += '<option value="all">All Departments</option>';
    for (var key in objStoreStructure) {
      sHTML += '<option value="'+objStoreStructure[key].department_id+'"';
      if (objStoreStructure[key].department_id === objStoreCatalogue.objFilters.nDeptID) {
        sHTML += 'selected="selected"';
      }
      sHTML += '>'+objStoreStructure[key].department_name+'</option>';
    }
    sHTML += '</select>';
    sHTML += '</span>';
    return sHTML;
  };

  objStoreCatalogue.getCategoryFilterMarkup = function(nDepartmentID) {
    var sHTML = '';
    var objStoreStructure = objStoreCatalogue.getSetting('objStoreStructure');
    if (typeof nDepartmentID === 'undefined') {
      nDepartmentID = nsc('#department-filter').val() || 'all';
    }
    
    sHTML += '<span class="catalogue-filter">';
    sHTML += '<select id="category-filter">';
    sHTML += '<option value="all">All Categories</option>';
    
    // If we are showing all categories
    if (nDepartmentID === 'all') {
      for (var nDepartmentKey in objStoreStructure) {
        for (var nCategoryKey in objStoreStructure[nDepartmentKey].children) {
          sHTML += '<option value="'+objStoreStructure[nDepartmentKey].children[nCategoryKey].category_id+'"';
          if (objStoreStructure[nDepartmentKey].children[nCategoryKey].category_id == objStoreCatalogue.objFilters.nCatID) {
            sHTML += 'selected="selected"';
          }
          sHTML +='>'+objStoreStructure[nDepartmentKey].children[nCategoryKey].category_name+'</option>';
        }
      }
      
    // If we are only showing categories belonging to a department
    } else {
      for (var nDepartmentKey in objStoreStructure) {
        if (objStoreStructure[nDepartmentKey].department_id === nDepartmentID) {
          for (var nCategoryKey in objStoreStructure[nDepartmentKey].children) {
            sHTML += '<option value="'+objStoreStructure[nDepartmentKey].children[nCategoryKey].category_id+'">'+objStoreStructure[nDepartmentKey].children[nCategoryKey].category_name+'</option>';
          }
        }
      }
    }
    sHTML += '</select>';
    sHTML += '</span>';
    return sHTML;
  };
  
  objStoreCatalogue.getBrandFilterMarkup = function() {
    var sHTML = '';
    var objStoreBrands = objStoreCatalogue.getSetting('objStoreBrands');
    if (objStoreBrands.length > 0) {
      sHTML += '<span class="catalogue-filter">';
      sHTML += '<select id="brand-filter">';
      sHTML += '<option value="all">All Brands</option>';
      for (var key in objStoreBrands) {
        sHTML += '<option value="'+objStoreBrands[key].product_brandname+'"';
        if (objStoreCatalogue.objFilters.sBrandName === objStoreBrands[key].product_brandname) {
          sHTML += ' selected="select"';
        }
        sHTML += '>'+objStoreBrands[key].product_brandname+'</option>';
      }
      sHTML += '</select>';
      sHTML += '</span>';
    }
  
    return sHTML;
  };
  
  objStoreCatalogue.getThemeFilterMarkup = function() {
    var sHTML = '';
    var objStoreThemes = objStoreCatalogue.getSetting('objStoreThemes');

    if (objStoreThemes.length > 0) {
      sHTML += '<span class="catalogue-filter">';
      sHTML += '<select id="theme-filter">';
      sHTML += '<option value="all">All Themes</option>';
      for (var key in objStoreThemes) {
        sHTML += '<option value="'+objStoreThemes[key].product_theme+'"';
        if (objStoreCatalogue.objFilters.sTheme === objStoreThemes[key].product_theme) {
          sHTML += ' selected="select"';
        }
        sHTML += '>'+objStoreThemes[key].product_theme+'</option>';
      }
      sHTML += '</select>';
      sHTML += '</span>';
    }
    return sHTML;
  };
  
  objStoreCatalogue.getPriceFilterMarkup = function() {
    var sHTML = '';
    return sHTML;
  };  
  
  objStoreCatalogue.getStockFilterMarkup = function() {
    var sHTML = '';
    return sHTML;
  };
  
  objStoreCatalogue.getItemListMarkup = function(arrItemIDs) {
    var sHTML = '';

    sHTML += '<div class="row-fluid" id="head-store-catalogue">';
    
    sHTML += '<div class="span1">';
    sHTML += '<input type="checkbox" id="checkbox-all-store-items">';
    sHTML += '</div>';
    
    sHTML += '<div class="span1">';
    sHTML += 'Image';
    sHTML += '</div>';
    
    sHTML += '<div class="span2">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_code">Item Lookup Code</span>';
    sHTML += '<br>';
    sHTML += '<span class="ghost">ID</span>';
    sHTML += '</div>';
    
    sHTML += '<div class="span3">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_name">Product Name</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '<br>';
    sHTML += '<span class="ghost">Department/ Category</span>';
    sHTML += '</div>';
    
    sHTML += '<div class="span1 text-right">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_stock">Available</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="span1 text-right">';
    sHTML += '<span class="sort-field sort-field-ascending" data-sortfield="product_price">Price</span>';
    sHTML += '<span class="sort-direction"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="span3 text-right">';
    sHTML += 'Action';
    sHTML += '</div>';
    
    sHTML += '</div>';

    if (typeof arrItemIDs !== null) {
      for(var i = 0; i < arrItemIDs.length; i++) {
        sHTML += objStoreCatalogue.getItemMarkup(arrItemIDs[i]);
      }
    }
    
    return sHTML;
  };
  
  objStoreCatalogue.getItemListPagination = function() {
    
    var arrLimitOptions = [5, 20, 30, 50, 100];
    
    var nCurrentLimit  = parseInt(objStoreCatalogue.objFilters.nLimit);
    var nCurrentOffset = parseInt(objStoreCatalogue.objFilters.nOffset);
    var nItemCount     = parseInt(objStoreCatalogue.nItemCount);
    var nTotalPages    = Math.floor(nItemCount / nCurrentLimit) + 1;
    
    var nCurrentPage = 0;
    if (nCurrentOffset !== 0) {
      var nCurrentPage = Math.floor(nCurrentOffset / nCurrentLimit) + 1;
    }
    
    var sHTML = '';
    
    sHTML += '<div id="pagination-panel" class="row-fluid">';
    
    sHTML += '<div class="span3">';
    sHTML += '<label>Items per page </label>';
    sHTML += '<select id="item-limit-menu">';
    for (var i = 0; i < arrLimitOptions.length; i++) {
      sHTML += '<option value="'+arrLimitOptions[i]+'"';
      if (objStoreCatalogue.objFilters.nLimit == arrLimitOptions[i]) {
        sHTML += 'selected="selected"';
      }
      sHTML += '>'+arrLimitOptions[i]+'</option>';
    }
    sHTML += '</select>';
    sHTML += '</div>';
    
    sHTML += '<div class="item-count span3">';
    sHTML += '<label>Items ';
    sHTML += '<input type="text" class="input-mini" value="'+nItemCount+'" readonly>';
    sHTML += '</label>';
    sHTML += '</div>';
    
    sHTML += '<div class="span6 pagination text-right">';
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
  
  objStoreCatalogue.getItemMarkup = function(sItemID) {
    
    var sHTML = '';
    
    var objItem = objStoreCatalogue.getItem(sItemID);
    
    sHTML += '<div class="catalogue-item row-fluid" id="store-catalogue-item-'+sItemID+'">';
    
    /* The checkbox */
    sHTML += '<div class="span1">';
    sHTML += '  <input type="checkbox" class="item-checkbox" data-itemid="'+sItemID+'">';
    sHTML += '</div>';
    
    /* The item image */
    sHTML += '<div class="span1">';
    if (objItem.product_image.length) {
      sHTML += '  <img src="/product_images/1/3/'+objItem.product_image+'" title="image of '+objItem.productimage+'">';
    }
    sHTML += '</div>';
    
    /* The item code */
    sHTML += '<div class="span2">';
    sHTML += objItem.product_code;
    sHTML += '<br>';
    sHTML += '<span class="ghost">'+objItem.product_id+'</span>';
    sHTML += '</div>';
    
    /* The item name */
    sHTML += '<div class="span3">';
    sHTML += '  <span class="item-name">';
    sHTML += '    <a href="'+objItem.product_url+'" target="_blank">';
    sHTML += objItem.product_name;
    sHTML += '    </a>';
    sHTML += '  </span>';
    sHTML += '  <br>';
    sHTML += '  <span class="ghost">';
    sHTML += '    <a href="' + objStoreCatalogue.getDepartmentLink(objItem.department_id) + '" target="_blank">';
    sHTML += objItem.department_name;
    sHTML += '    </a>';
    sHTML += '/ ';
    sHTML += '    <a href="' + objStoreCatalogue.getCategoryLink(objItem.category_id) + '" target="_blank">';
    sHTML += objItem.category_name;
    sHTML += '</a>';
    sHTML += '  </span>';
    sHTML += '</div>';
    
    /* The item inventory */
    sHTML += '<div class="span1 text-right">';
    sHTML += objItem.product_stock;
    sHTML += '</div>';
    
    /* The item price */
    sHTML += '<div class="span1 text-right">';
    sHTML += objStoreCatalogue.sCurrencySymbol + objItem.product_price;
    sHTML += '</div>';
    
    /* The action button */
    sHTML += '<div class="span3 text-right">';
    sHTML += '<div>';
    sHTML += '<div class="btn-group" ';
    sHTML += 'data-product_id="'+objItem.product_id+'"';
    sHTML += '>';
    sHTML += '<button class="btn btn-action">View Details</button>';
    sHTML += '<button class="btn dropdown-toggle"';
    sHTML += 'data-toggle="dropdown" ';
    sHTML += '>';
    sHTML += '<span class="caret"></span>';
    sHTML += '</button>';
    sHTML += '<ul class="dropdown-menu">';
    sHTML += '<li><a href="btn-action2" class="btn-action">Action 2</a></li>';
    sHTML += '</ul>';
    sHTML += '</div>';
    sHTML += '</div>';
    sHTML += '</div>';

    
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objStoreCatalogue.getDepartmentLink = function(nDepartmentID) {
    var objStoreStructure = objStoreCatalogue.getSetting('objStoreStructure');
    
    for (var key in objStoreStructure) {
      if (objStoreStructure[key].department_id === nDepartmentID) {
        return objStoreStructure[key].department_link;
      }
    }
  };
  
  objStoreCatalogue.getCategoryLink = function(nCategoryID) {
    var objStoreStructure = objStoreCatalogue.getSetting('objStoreStructure');
    
    for (var deptKey in objStoreStructure) {
      for (var catKey in objStoreStructure[deptKey].children) {
        if (objStoreStructure[deptKey].children[catKey].category_id === nCategoryID) {
          return objStoreStructure[deptKey].children[catKey].category_link;
        }
      }
    }
  };
  
  objStoreCatalogue.getItemsFromAPI = function() {
    var jsonData = objStoreCatalogue.objFilters;
    var arrItemIDs = [];
    
    var jqxhr = nsc.ajax({
      url      : objStoreCatalogue.getSetting('sItemURL'),
      data     : jsonData,
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      
      objStoreCatalogue.objFilters = responsedata.objFilters;
      
      objStoreCatalogue.nItemCount = parseInt(responsedata.nItemCount);
      
      objStoreCatalogue.loadItems(responsedata._embedded.items);
      
      for(var key in responsedata._embedded.items) {
        arrItemIDs.push(responsedata._embedded.items[key].product_id);
      }
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    jqxhr.always(function() {
      objStoreCatalogue.renderPanel(arrItemIDs);
      objStoreCatalogue.setListeners();
    });
    
  };
  
  objStoreCatalogue.getProductDetails = function(nProductID, bRenderDetails) {
    var objDetails = objStoreCatalogue.getItem(nProductID);
    
    /* If we already have a details panel open, we first close it */
    if (nsc('#item-listing-panel').attr('class') !== 'span12') {
      objStoreCatalogue.toggleDetailsPanel();
    }
    
    /* The general data fetch doesn't return product_weblinxcustomtextfields so
     * if it isn't present, we make the AJAX call. */
    if (typeof objDetails === 'undefined' 
      || typeof objDetails.product_weblinxcustomtext1 === 'undefined'
      || (objDetails.ttl < Date.now()) ) {
     
      var jsonData       = objStoreCatalogue.objFilters;
      jsonData.nID       = nProductID;
      jsonData.objFields = 'all';

      var jqxhr = nsc.ajax({
        url      : objStoreCatalogue.getSetting('sItemURL'),
        data     : jsonData,
        dataType : "json",
        type     : "get"
      });

      jqxhr.done(function(responsedata) {

        objStoreCatalogue.objFilters = responsedata.objFilters;

        objStoreCatalogue.loadItems(responsedata._embedded.items);

        if (bRenderDetails) {
          objStoreCatalogue.renderDetails(nProductID);
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
      objStoreCatalogue.renderDetails(nProductID);
    }
  };
  
  return objStoreCatalogue;
};

var EbayCatalogue = function() {
  
  var objEbayCatalogue = new Catalogue();
  objEbayCatalogue.sCode = 'ebaycatalogue';
  objEbayCatalogue.sName = 'eBay Catalogue';
  
  return objEbayCatalogue;
};

var EbayListings = function() {
  
  var objEbayListings = new Catalogue();
  objEbayListings.sCode = 'ebaylistings';
  objEbayListings.sName = 'eBay Listings';
  
  return objEbayListings;
};

var EbayOrders = function() {
  
  var objEbayOrders = new Catalogue();
  objEbayOrders.sCode = 'ebayorders';
  objEbayOrders.sName = 'eBay Orders';
  
  return objEbayOrders;
};

