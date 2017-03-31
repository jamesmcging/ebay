define([
  'jquery', 
  'modules/panels/statusPanel',
  'modules/panels/credentialsPanel',
  'modules/ebayApi/inventory'],
  function(
    nsc, 
    objStatusPanel,
    objCredentialsPanel,
    objApiInventory) {
   
  var objLocationsPanel = {};

  objLocationsPanel.__proto__ = objStatusPanel;
  
  objLocationsPanel.sName = 'Locations';
  objLocationsPanel.sCode = 'locationspanel';

  objLocationsPanel.objChildPanels = {};
  
  objLocationsPanel.objSettings.objLocations = {};
  
  objLocationsPanel.initialize = function() {
    /* Panel starts of as inactive */
    objLocationsPanel.setInactive();
    
    /* We only try to initialize this panel if the credentials are valid */
    if (objCredentialsPanel.getIsPanelActive()) {
      /* Ask eBay for any locations associated with this user */
      objLocationsPanel.getLocations(objLocationsPanel.setLocations);
    } else {
      console.log('credentials panel inactive');
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
      
      if (sLocationKey === 'newlocation') {
        nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(objLocationsPanel.objLocation));
      } else {
        if (typeof (objLocationsPanel.objSettings.objLocations[sLocationKey]) !== 'undefined') {
          nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(objLocationsPanel.objSettings.objLocations[sLocationKey]));
        } else {
          nsc('#location-form').replaceWith('<div id="location-form">Unable to find location ('+sLocationKey+')</div>');
        }
      }
      
      nsc('#create-location').off().on('click', function() {
        if (nsc('#location-merchantLocationKey').val()) {
          objLocationsPanel.createLocation();
        } else {
          alert('Please give the new location a key');
        }
      });
      
      nsc('#update-location').off().on('click', function() {
        objLocationsPanel.updateLocation();
      });
    });

    nsc(document).on("credentialsPanelUpdated", function(event, nCredentialsPanelStatus, bCredentialsPanelActive) {
      if (nCredentialsPanelStatus === 4) {
        objLocationsPanel.setUpdating();
        objLocationsPanel.initialize();
      } else {
        objLocationsPanel.setInactive();
      }
    });
  };
  
  objLocationsPanel.getModalBodyMarkup = function() {
    var sHTML = '';
    if (objCredentialsPanel.getIsPanelActive()) {
      sHTML += '<p>Items sold on eBay are sold from a location. Use this panel to add and or edit locations from which you sell your goods.</p>';
      sHTML += objLocationsPanel.getLocationListMarkup();
      sHTML += '<div id="location-form"></div>';
    } else {
      sHTML += '<p>Please start with the credentials panel.</p>';
    }
    return sHTML;
  };
  
  objLocationsPanel.getLocationListMarkup = function() {
    var sHTML = '';
    sHTML += '<div id="location-list">';
    for (var i = 0; i < objLocationsPanel.objSettings.objLocations.length; i++) {
      var objLocation = objLocationsPanel.objSettings.objLocations[i];
      sHTML += '<div class="location-item" data-locationkey="'+objLocation.merchantLocationKey+'">';
      sHTML += '<span class="location-name">' + objLocation.name + '</span>';
      sHTML += '</div>';
    }
    
    /* Make it possible to add a new location */
    sHTML += '<div class="location-item" data-locationkey="newlocation">';
    sHTML += '<span class="location-name">New Location</span>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- #location-list -->';
    return sHTML;
  };
  
  /**
   * 
   * @param {string} sLocationKey
   * @returns {String}
   */
  objLocationsPanel.getLocationFormMarkup = function(objLocation) {
    console.log(objLocation);
    var sHTML = '<hr>';
    sHTML += '<form name="location-form" id="location-form">';
  
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-name">Location Name</label>';
    sHTML += '<input type="text" name="name" id="location-name" class="form-control" maxlength="1000" value="'+objLocation.name+'">';
    sHTML += '</div>';

    /* If we are creating a new location we need to be able to set this, 
     * otherwise, if we are viewing/updating a location, the key is immutable */
    var sReadOnly = (objLocation.merchantLocationKey.length === 0) ? '' : 'readonly';
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-merchantLocationKey">Location Key</label>';
    sHTML += '<input type="text" name="merchantLocationKey" id="location-merchantLocationKey" class="form-control" maxlength="36" value="'+objLocation.merchantLocationKey+'" '+sReadOnly+'>';
    sHTML += '</div>';

    // ENUM [ ENABLED | DISABLED ]
    var sChecked = (objLocation.merchantLocationStatus === 'ENABLED') ? ' checked="checked"' : '';
    sHTML += '<div class="checkbox">';
    sHTML += '<label>';
    sHTML += '<input type="checkbox" name="merchantLocationStatus" id="location-merchantLocationStatus"'+sChecked+'>Status';
    sHTML += '</label>';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group required">';
    sHTML += '<label for="location-address-addressLine1" class="required">Address 1</label>';
    sHTML += '<input type="text" name="addressLine1" id="location-address-addressLine1" class="form-control required" maxlength="128" value="'+objLocation.location.address.addressLine1+'">';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-address-addressLine2">Address 2</label>';
    sHTML += '<input type="text" name="addressLine2" id="location-address-addressLine2" class="form-control" maxlength="128" value="'+objLocation.location.address.addressLine2+'">';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group required">';
    sHTML += '<label for="location-address-city">City</label>';
    sHTML += '<input type="text" name="city" id="location-address-city" class="form-control" maxlength="128" value="'+objLocation.location.address.city+'">';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group required">';
    sHTML += '<label for="location-address-postalCode">Postal Code/ Zip</label>';
    sHTML += '<input type="text" name="postalCode" id="location-address-postalCode" class="form-control" maxlength="16" value="'+objLocation.location.address.postalCode+'">';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group required">';
    sHTML += '<label for="location-address-stateOrProvince">State/ Province</label>';
    sHTML += '<input type="text" name="stateOrProvince" id="location-address-stateOrProvince" class="form-control" maxlength="128" value="'+objLocation.location.address.postalCode+'">';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group required">';
    sHTML += '<label for="location-address-country">Country Code</label>';
    sHTML += '<input type="text" name="country" id="location-address-country" class="form-control" maxlength="2" title="Two-letter ISO 3166-1 Alpha-2 country code"  value="'+objLocation.location.address.country+'" placeholder="2-letter ISO country code">';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-locationAdditionalInformation">Additional Information</label>';
    sHTML += '<input type="text" name="locationAdditionalInformation" id="location-locationAdditionalInformation" class="form-control" maxlength="256" value="'+objLocation.locationAdditionalInformation+'">'; 
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-locationId">eBay ID</label>';
    sHTML += '<input type="text" name="locationId" id="location-locationId" class="form-control" value="'+objLocation.locationId+'" readonly>'; 
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-locationWebUrl">URL</label>';
    sHTML += '<input type="text" name="locationURL" id="location-locationWebUrl" class="form-control" maxlength="512" value="'+objLocation.locationWebUrl+'">'; 
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-phone">Phone</label>';
    sHTML += '<input type="text" name="phone" id="location-phone" class="form-control" maxlength="36" value="'+objLocation.phone+'">'; 
    sHTML += '</div>';
    
    /* Button for creating a new location */
    if (objLocation.merchantLocationKey.length === 0) {
      sHTML += '<button type="button" id="create-location" class="btn btn-default">Create New Location</button>';
      
    /* Button for updating an existing location */
    } else {
      sHTML += '<button type="button" id="update-location" class="btn btn-default">Update Location</button>';
    }
    
    sHTML += '</form>';
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
      objLocationsPanel.objSettings.objLocations = objData.sResponseMessage.locations || {};
      
    } else {
      var sMessage = 'getLocations failed to return any locations. Response message : ' + objData.sResponseMessage;
      console.log(sMessage);
    }
    
    console.log(objLocationsPanel.objSettings);
    
    if (objLocationsPanel.objSettings.objLocations.length) {
      objLocationsPanel.setActive();
    } else {
      objLocationsPanel.setInactive();
    }
  };
  
  objLocationsPanel.getLocations = function() {
    /* Ask eBay for any locations associated with this user */
    objApiInventory.getLocations(objLocationsPanel.setLocations);
  };
  
  objLocationsPanel.getLocation = function() {
    
  };
  
  objLocationsPanel.createLocation = function() {
    console.log('createLocation called');
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
    locationAdditionalInformation : nsc('#location-locationAdditionalInformation').val(),
    name : nsc('#location-name').val(),
    merchantLocationStatus : (nsc('#location-merchantLocationStatus:checked') ? 'ENABLED' : 'DISABLED'),
    locationTypes : [
      "STORE"
    ]
    };
    
    console.log(objLocationData);
    
    objApiInventory.createLocation(sLocationKey, objLocationData, objLocationsPanel.setLocations);
  };
  
  objLocationsPanel.objectifyForm = function(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
  }
  
  objLocationsPanel.deleteLocations = function() {};
  
  objLocationsPanel.updateLocation = function() {
    console.log('updateLocation called');
  };
  
  objLocationsPanel.updateLocations = function() {};
  
  objLocationsPanel.enableLocation = function() {};
  
  objLocationsPanel.disableLocation = function() {};
  
  objLocationsPanel.objLocation = {
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
      },
      locationId: ''
    },
    locationAdditionalInformation : 'This is a test location',
    locationInstructions          : 'Please do not buy from this test store',
    locationTypes                 : ['STORE'],
    locationWebUrl                : 'jamesmcging.demostore.nitrosell.com',
    merchantLocationKey           : '',
    merchantLocationStatus        : 'ENABLED',
    name                          : 'Test store',
    phone                         : '0123456789'
  };

  return objLocationsPanel;
});