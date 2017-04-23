define(['jquery', 
  'modules/panels/panel',
  'modules/models/storeCatalogueModel'
  ], 
  function(nsc, 
  objPanel,
  objStoreCatalogueModel
  ) {
   
  var objStoreCatalogueFilterPanel = {};

  objStoreCatalogueFilterPanel.__proto__ = objPanel;
  
  objStoreCatalogueFilterPanel.sName = 'Store Catalogue Filter Panel';
  objStoreCatalogueFilterPanel.sCode = 'storecataloguefilterpanel';

  objStoreCatalogueFilterPanel.objChildPanels = {};
  
  objStoreCatalogueFilterPanel.objSettings.bActive = false;

  objStoreCatalogueFilterPanel.getPanelContent = function() {
    var sHTML = '';
    sHTML += '<div id="store-catalogue-filter-box">';
  
    if (objStoreCatalogueFilterPanel.objSettings.bActive) {
      sHTML += '<label>Filters&nbsp;</label>';
      sHTML += objStoreCatalogueFilterPanel.getDepartmentFilterMarkup();
      sHTML += objStoreCatalogueFilterPanel.getCategoryFilterMarkup();
      sHTML += objStoreCatalogueFilterPanel.getBrandFilterMarkup();
      sHTML += objStoreCatalogueFilterPanel.getThemeFilterMarkup();
//      sHTML += objStoreCatalogueFilterPanel.getPriceFilterMarkup();
//      sHTML += objStoreCatalogueFilterPanel.getStockFilterMarkup();
      sHTML += '<div class="btn-group pull-right">';
      sHTML += '<button id="button-filter-reset" class="btn btn-xs">Clear Filters</button>';
      sHTML += '<button id="button-filter" class="btn btn-xs btn-info pull-right">Filter</button>';
      sHTML += '</div><!-- .btn-group -->';
      
    } else {
      sHTML += 'Panel loading...';
    }
    sHTML += '</div><!-- #store-catalogue-filter-box -->';
    
    return sHTML;
  };
  
  objStoreCatalogueFilterPanel.setListeners = function() {
    // When the storeCatalogueModel has updated due to a completed AJAX request
    // we redraw the panel. This happens when the tab is clicked
    nsc(document).on('storestructureupdated', function() {
      objStoreCatalogueFilterPanel.objSettings.bActive = true;
      objStoreCatalogueFilterPanel.render();
    });
    
    nsc('#button-filter-reset').off().on('click', function() {
      app.objModel.objStoreCatalogueModel.objFilters.nID        = '';
      app.objModel.objStoreCatalogueModel.objFilters.nCatID     = 'all';
      app.objModel.objStoreCatalogueModel.objFilters.nDeptID    = 'all';
      app.objModel.objStoreCatalogueModel.objFilters.sBrandName = '';
      app.objModel.objStoreCatalogueModel.objFilters.sTheme     = '';
      nsc('#store-catalogue-filter-box').replaceWith(objStoreCatalogueFilterPanel.getPanelContent());
      app.objModel.objStoreCatalogueModel.getItemsFromAPI();
      objStoreCatalogueFilterPanel.setListeners();
    });
    
    nsc('#button-filter').off().on('click', function() {
      app.objModel.objStoreCatalogueModel.getItemsFromAPI();
    });
    
    /**
     * Changing the department filter causes the category drop down to be 
     * re-rendered to reflect the selected department
     */
    nsc('#department-filter').off().on('change', function(event) {  
      app.objModel.objStoreCatalogueModel.objFilters.nDeptID = event.target.value;
      nsc('#category-filter').replaceWith(objStoreCatalogueFilterPanel.getCategoryFilterMarkup(event.target.value));
      app.objModel.objStoreCatalogueModel.objFilters.nOffset = 0;
      objStoreCatalogueFilterPanel.setListeners();
    });
    
    /**
     * Changing the category filter will set the department filter to the parent
     * department of the selected category
     */
    nsc('#category-filter').off().on('change', function(event) {
      app.objModel.objStoreCatalogueModel.objFilters.nCatID = event.target.value;

      var objStoreStructure = app.objModel.objStoreCatalogueModel.getStoreStructure();
      for (var nDeptID in objStoreStructure) {
        for (var nCatID in objStoreStructure[nDeptID].children) {
          if (objStoreStructure[nDeptID].children[nCatID].category_id === event.target.value) {
            app.objModel.objStoreCatalogueModel.objFilters.nDeptID = nDeptID;
          }
        }
      }
      
      /* Reset the offset */
      app.objModel.objStoreCatalogueModel.objFilters.nOffset = 0;
      nsc('#department-filter').val(app.objModel.objStoreCatalogueModel.objFilters.nDeptID);
    });
    
    nsc('#brand-filter').off().on('change', function(event) {
      app.objModel.objStoreCatalogueModel.objFilters.sBrandName = event.target.value;
    });
    
    nsc('#theme-filter').off().on('change', function(event) {
      app.objModel.objStoreCatalogueModel.objFilters.sTheme = event.target.value;
    });
  };

  objStoreCatalogueFilterPanel.initialize = function() {
    
    objStoreCatalogueFilterPanel.setListeners();
    
    /* Ensure the app has its store catalogue model */
    if (typeof app.objModel.objStoreCatalogueModel === 'undefined') {
      app.objModel.objStoreCatalogueModel = objStoreCatalogueModel;
      app.objModel.objStoreCatalogueModel.initialize();
    } else if (app.objModel.objStoreCatalogueModel.objData.objStoreStructure) {
      objStoreCatalogueFilterPanel.objSettings.bActive = true;
      objStoreCatalogueFilterPanel.render();
    } else {
      console.log('The filter panel needs a store structure to render');
    }

  };
  
  objStoreCatalogueFilterPanel.getDepartmentFilterMarkup = function() {
    var sHTML = '';
    var objStoreStructure = app.objModel.objStoreCatalogueModel.getStoreStructure();

    sHTML += '<span class="catalogue-filter">';
    sHTML += '<select id="department-filter">';
    sHTML += '<option value="all">All Departments</option>';
    for (var key in objStoreStructure) {
      if (objStoreStructure[key].department_id === '0') {
        sHTML += '<option value="0">No Department</option>';
      } else {
        sHTML += '<option value="'+objStoreStructure[key].department_id+'"';
        if (objStoreStructure[key].department_id == app.objModel.objStoreCatalogueModel.objFilters.nDeptID) {
          sHTML += 'selected="selected"';
        }
        sHTML += '>'+objStoreStructure[key].department_name+'</option>';
      }
    }
    sHTML += '</select>';
    sHTML += '</span>';
    return sHTML;
  };

  objStoreCatalogueFilterPanel.getCategoryFilterMarkup = function(nDepartmentID) {
    var sHTML = '';
    var objStoreStructure = app.objModel.objStoreCatalogueModel.getStoreStructure();
    
    if (typeof nDepartmentID === 'undefined') {
      nDepartmentID = app.objModel.objStoreCatalogueModel.objFilters.nDeptID;
    }
    
    sHTML += '<span class="catalogue-filter">';
    sHTML += '<select id="category-filter">';
    sHTML += '<option value="all">All Categories</option>';
    sHTML += '<option value="0">No Category</option>';
    
    // If we are showing all categories
    if (nDepartmentID === 'all') {
      for (var nDepartmentKey in objStoreStructure) {
        for (var nCategoryKey in objStoreStructure[nDepartmentKey].children) {
          sHTML += '<option value="'+objStoreStructure[nDepartmentKey].children[nCategoryKey].category_id+'"';
          if (objStoreStructure[nDepartmentKey].children[nCategoryKey].category_id == app.objModel.objStoreCatalogueModel.objFilters.nCatID) {
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
  
  objStoreCatalogueFilterPanel.getBrandFilterMarkup = function() {
    var sHTML = '';
    var objStoreBrands = app.objModel.objStoreCatalogueModel.getBrands();
    if (objStoreBrands.length > 0) {
      sHTML += '<span class="catalogue-filter">';
      sHTML += '<select id="brand-filter">';
      sHTML += '<option value="all">All Brands</option>';
      for (var key in objStoreBrands) {
        sHTML += '<option value="'+objStoreBrands[key]+'"';
        if (app.objModel.objStoreCatalogueModel.objFilters.sBrandName === objStoreBrands[key]) {
          sHTML += ' selected="select"';
        }
        sHTML += '>'+objStoreBrands[key]+'</option>';
      }
      sHTML += '</select>';
      sHTML += '</span>';
    }
  
    return sHTML;
  };
  
  objStoreCatalogueFilterPanel.getThemeFilterMarkup = function() {
    var sHTML = '';
    var objStoreThemes = app.objModel.objStoreCatalogueModel.getThemes();

    if (objStoreThemes.length > 0) {
      sHTML += '<span class="catalogue-filter">';
      sHTML += '<select id="theme-filter">';
      sHTML += '<option value="all">All Themes</option>';
      for (var key in objStoreThemes) {
        sHTML += '<option value="'+objStoreThemes[key]+'"';
        if (app.objModel.objStoreCatalogueModel.objFilters.sTheme === objStoreThemes[key]) {
          sHTML += ' selected="select"';
        }
        sHTML += '>'+objStoreThemes[key]+'</option>';
      }
      sHTML += '</select>';
      sHTML += '</span>';
    }
    return sHTML;
  };
  
  objStoreCatalogueFilterPanel.getPriceFilterMarkup = function() {
    var sHTML = '';
    return sHTML;
  };  
  
  objStoreCatalogueFilterPanel.getStockFilterMarkup = function() {
    var sHTML = '';
    return sHTML;
  };
  
  return objStoreCatalogueFilterPanel;
});