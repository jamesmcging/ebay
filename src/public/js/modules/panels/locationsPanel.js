define(['jquery', 'modules/panels/statusPanel', 'modules/ebayApi/inventory'], function(nsc, objStatusPanel, objApiInventory) {
   
  var objLocationsPanel = {};

  objLocationsPanel.__proto__ = objStatusPanel;
  
  objLocationsPanel.sName = 'Locations';
  objLocationsPanel.sCode = 'locationspanel';

  objLocationsPanel.objChildPanels = {};
  
  objLocationsPanel.objSettings.objLocations = {};
  
  objLocationsPanel.initialize = function() {
    
    /* Ask eBay for any locations associated with this user */
    objApiInventory.getLocations(objLocationsPanel.setLocations);
    
    if (this.objSettings.bActive) {
      this.setActive();
    } else {
      this.setInactive();
    }
  };
  
  objLocationsPanel.getPanelContent = function() {    
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="status-panel-icon" id="'+this.sCode+'-status-icon"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-10">';
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+'</h3>';
    sHTML += '<p id="'+this.sCode+'-status-text">';
    if (this.objSettings.bActive) {
      sHTML += 'We have a valid location for you, click to add or edit.';
    } else {
      sHTML += 'Click to add your store location.';
    }
    sHTML += '</p>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- .row -->';

    return sHTML;
  };
  
  objLocationsPanel.setListeners = function() {
    nsc('#'+this.sCode+'-panel').off().on('click', function() {
      objLocationsPanel.showModal();
      objLocationsPanel.setListeners();
    });
    
    nsc('.location-item').on('click', function() {
      var sLocationKey = nsc(this).data('locationkey');
      console.log(sLocationKey);
    });
  };
  
  objLocationsPanel.getModalBodyMarkup = function() {
    var sHTML = '';

    sHTML += '<p>Items sold on eBay are sold from a location. Use this panel to add and or edit locations from which you sell your goods.</p>';
    sHTML += objLocationsPanel.getLocationListMarkup();
    
    return sHTML;
  };
  
  objLocationsPanel.getLocationListMarkup = function() {
    var sHTML = '';
    sHTML += '<div id="location-list">';
    for (var i in objLocationsPanel.objSettings.objLocations) {
      var objLocation = objLocationsPanel.objSettings.objLocations[i];
      sHTML += '<div class="location-item" data-locationkey="'+objLocation.sLocationKey+'">';
      sHTML += '<span class="location-name">' + objLocation.sLocationName + '</span>';
      sHTML += '</div>';
    }
    
    /* Make it possible to add a new location */
    sHTML += '<div class="location-item" data-locationkey="newlocation">';
    sHTML += '<span class="location-name">New Location</span>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- #location-list -->';
    return sHTML;
  };
  
  objLocationsPanel.getLocationFormMarkup = function() {
    var sHTML = '';
    return sHTML;    
  };
  
  /**
   * Callback function that is passed the response payload from 
   * getLocations(). The function is charged with putting the newly acquired 
   * location data into objLocationsPanel.objSettings.objLocations
   * 
   * @param {json} objData
   * @returns {undefined}
   */
  objLocationsPanel.setLocations = function(objData) {
    if (objData.bOutcome) {
      
      
    } else {
      var sMessage = 'getLocations failed to return any locations. Response message : ' + objData.sResponseMessage;
      console.log(sMessage);
    }
  };
  
  objLocationsPanel.getLocations = function() {};
  
  objLocationsPanel.getLocation = function() {};
  
  objLocationsPanel.createLocation = function() {};
  
  objLocationsPanel.deleteLocations = function() {};
  
  objLocationsPanel.updateLocations = function() {};
  
  objLocationsPanel.enableLocation = function() {};
  
  objLocationsPanel.disableLocation = function() {};
  
  return objLocationsPanel;
});