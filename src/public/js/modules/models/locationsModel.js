define([
  'jquery', 
  'modules/ebayApi/inventory'],
  function(
    nsc, 
    objApiInventory
  ) {
   
  var objLocationsModel = {};
  
  objLocationsModel.objLocations = {};
  
  objLocationsModel.initialize = function() {};
  
  objLocationsModel.setListeners = function() {};
    
  /**
   * Callback function that is passed the response payload from 
   * getLocations(). The function is charged with putting the newly acquired 
   * location data into objLocationsPanel.objSettings.objLocations
   * 
   * @param {json} objData
   * @returns {undefined}
   */
  objLocationsModel.setLocations = function(objData) {
    objLocationsModel.objLocations = {};
    
    if (objData.bOutcome && objData.sResponseMessage && objData.sResponseMessage.locations && objData.sResponseMessage.locations.length) {
      for (var i = 0; i < objData.sResponseMessage.locations.length; i++) {
        var objLocation = objData.sResponseMessage.locations[i];
        objLocationsModel.objLocations[objLocation.merchantLocationKey] = objLocation;
      }
    }
    
    nsc(document).trigger('locationsRetrieved');
  };
  
  objLocationsModel.getLocation = function(sLocationKey) {
    var sResponse = false;
    if (typeof objLocationsModel.objLocations[sLocationKey] !== 'undefined') {
      sResponse = objLocationsModel.objLocations[sLocationKey];
    }
    return sResponse;
  };
  
  objLocationsModel.getDefaultLocation = function() {
    return objLocationsModel.objDefaultLocation;
  };
  
  objLocationsModel.getLocations = function() {
    return objLocationsModel.objLocations;
  };
  
  objLocationsModel.createLocation = function() {
    var sLocationKey  = nsc('#location-merchantLocationKey').val();
    var objLocationData = {
      location : {
        address : {
          addressLine1    : nsc('#location-address-addressLine1').val(),
          addressLine2    : nsc('#location-address-addressLine2').val(),
          city            : nsc('#location-address-city').val(),
          stateOrProvince : nsc('#location-address-stateOrProvince').val(),
          postalCode      : nsc('#location-address-postalCode').val(),
          country         : nsc('#location-address-country').val()
        }
      },
      
      name                          : nsc('#location-name').val(),
      phone                         : nsc('#location-phone').val(),
      locationWebUrl                : nsc('#location-locationWebUrl').val(),
      locationInstructions          : nsc('#location-locationInstructions').val(),
      locationAdditionalInformation : nsc('#location-locationAdditionalInformation').val(),
      
      merchantLocationStatus : (nsc('#location-merchantLocationStatus:checked') ? 'ENABLED' : 'DISABLED'),
      locationTypes : [
        "STORE"
      ]
    };

    objLocationsModel.setUpdating('Adding '+nsc('#location-name').val()+' as a new location');
    objApiInventory.createLocation(sLocationKey, objLocationData, objLocationsModel.getLocations);
  };
  
  objLocationsModel.deleteLocation = function(sLocationKey) {
    objLocationsModel.setUpdating('Deleting location '+objLocationsModel.objLocations[sLocationKey].name);
    objApiInventory.deleteLocation(sLocationKey, objLocationsModel.getLocations);
  };
  
  objLocationsModel.updateLocation = function(sLocationKey) {
    var objLocationData = {
      name                          : nsc('#location-name').val(),
      phone                         : nsc('#location-phone').val(),
      locationWebUrl                : nsc('#location-locationWebUrl').val(),
      locationInstructions          : nsc('#location-locationInstructions').val(),
      locationAdditionalInformation : nsc('#location-locationAdditionalInformation').val()
    };

    objLocationsModel.setUpdating('Updating '+nsc('#location-name').val());
    objApiInventory.updateLocation(sLocationKey, objLocationData, objLocationsModel.getLocations);
  };
  
  objLocationsModel.enableLocation = function(sLocationKey) {
    objLocationsModel.setUpdating('Setting '+objLocationsModel.objLocations[sLocationKey].name+' status to enabled');
    objApiInventory.enableLocation(sLocationKey, objLocationsModel.setLocationEnabled);
  };
  
  objLocationsModel.disableLocation = function(sLocationKey) {
    objLocationsModel.setUpdating('Setting '+objLocationsModel.objLocations[sLocationKey].name+' status to disabled');
    objApiInventory.disableLocation(sLocationKey, objLocationsModel.setLocationDisabled);    
  };
    
  objLocationsModel.setLocationDisabled = function(objResponse) {
    if (objResponse.bOutcome && objResponse.nResponseCode === 200) {
      // Extract the location from the target URL
      var arrUrlElements = objResponse.sTargetURL.split("/");
      var sLocationKey = arrUrlElements[7];
      objLocationsModel.objLocations[sLocationKey].merchantLocationStatus = 'DISABLED';
      nsc(document).trigger('locationUpdateSuccess');
    } else {
      nsc(document).trigger('locationUpdatedFail');
    }
  };
  
  objLocationsModel.setLocationEnabled = function(objResponse) {
    if (objResponse.bOutcome && objResponse.nResponseCode === 200) {
      // Extract the location from the target URL
      var arrUrlElements = objResponse.sTargetURL.split("/");
      var sLocationKey = arrUrlElements[7];
      objLocationsModel.objLocations[sLocationKey].merchantLocationStatus = 'ENABLED';
      nsc(document).trigger('locationUpdateSuccess');
    } else {
      nsc(document).trigger('locationUpdatedFail');
    }
  };
  
  objLocationsModel.objDefaultLocation = {
    location : {
      address : {
        addressLine1    : 'Test Address 1',
        addressLine2    : 'Test Address 2',
        city            : 'Cork',
        country         : 'IE',
        county          : 'Cork',
        postalCode      : 'T23 F88F',
        stateOrProvince : 'Cork'
      },
      geoCoordinates : {
        latitude  : -8.469289,
        longitude : 51.900956
      }
    },
    name                          : 'Test Location Name',
    phone                         : '0123456789',
    locationWebUrl                : 'jamesmcging.demostore.nitrosell.com',
    locationInstructions          : 'Instructions for find this test location',
    locationAdditionalInformation : 'Additional information about this store',
    locationTypes                 : ['STORE'],
    merchantLocationKey           : '',
    merchantLocationStatus        : 'ENABLED',
  };

  return objLocationsModel;
});