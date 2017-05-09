define([
  'jquery',
  'modules/panels/statusPanel',
  'modules/ebayApi/inventory',
  'modules/models/locationsModel'],
  function(
    nsc, 
    objStatusPanel,
    objApiInventory,
    objLocationsModel) {
   
  var objLocationsPanel = {};

  objLocationsPanel.__proto__ = objStatusPanel;
  
  objLocationsPanel.sName = 'Locations';
  objLocationsPanel.sCode = 'locationspanel';

  objLocationsPanel.objChildPanels = {};
  
  objLocationsPanel.initialize = function() {
    
    /* Ensure the app has its locations model */
    if (typeof app.objModel.objLocationModel === 'undefined') {
      app.objModel.objLocationModel = objLocationsModel;
    }
    
    /* Panel starts of as inactive */
    objLocationsPanel.setInactive('Please sign in to eBay to use the locations panel');
    
    /* We only try to initialize this panel if the credentials are valid */
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      /* Ask eBay for any locations associated with this user */
      objLocationsPanel.getLocations(objLocationsPanel.setLocations);
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
    
    nsc('.location-item').off().on('click', function(event) {
      /* We don't want to open the form when clicking the buttons in the 
       * location list */
      if (event.target !== this && nsc(event.target).attr('class') !== 'location-name') {
        return;
      }
  
      var sLocationKey = nsc(this).data('locationkey');
      
      if (sLocationKey === 'newlocation') {
        nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(app.objModel.objLocationModel.getDefaultLocation()));
      } else {
        var objLocation = app.objModel.objLocationModel.getLocation(sLocationKey);
        if (objLocation) {
          nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(objLocation));
        } else {
          nsc('#location-form').text('Unable to find location ('+sLocationKey+')');
        }
        nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(objLocation));
      }
      
      nsc('.amendlocation').on('click', function() {
        var sLocationKey = nsc(event.target).data('merchantlocationkey');
        var objLocation = app.objModel.objLocationModel.getLocation(sLocationKey);
        nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(objLocation));
      });  
      
      /* This listens for the button at the bottom of the new location form */
      nsc('#create-location').off().on('click', function() {
        if (nsc('#location-merchantLocationKey').val()) {
          if (/\s/.test(nsc('#location-merchantLocationKey').val())) {
            alert('Your Location Key cannot contain spaces');
          } else {
            objLocationsPanel.createLocation();
          }
        } else {
          alert('Please give the new location a key');
        }
      });
      
      /* This listens for the button at the bottom of the update location form */
      nsc('#update-location').off().on('click', function(event, ele) {
        console.log('update location clicked');
        var sLocationKey = nsc(event.target).data('merchantlocationkey');
        objLocationsPanel.updateLocation(sLocationKey);
      });
    });
    
    nsc('.amendlocation').on('click', function() {
      var sLocationKey = nsc(event.target).data('merchantlocationkey');
      var objLocation = app.objModel.objLocationModel.getLocation(sLocationKey);
      nsc('#location-form').replaceWith(objLocationsPanel.getLocationFormMarkup(objLocation));
    });
      
    nsc(document).on('credentialsPanelUpdated', function(event, nCredentialsPanelStatus, bCredentialsPanelActive) {
      if (nCredentialsPanelStatus === 4) {
        objLocationsPanel.initialize();
      } else {
        objLocationsPanel.setInactive('Location panel needs the credentials panel to be active');
      }
    });

    nsc(document).on('locationsRetrieved', function() {
      if ((nsc('#modal-anchor').data('bs.modal') || {}).isShown) {
        objLocationsPanel.refreshModal();
      }
    });
    
    nsc(document).on('locationUpdateSuccess', function() {
      if ((nsc('#modal-anchor').data('bs.modal') || {}).isShown) {
        objLocationsPanel.refreshModal();
      } else {
        console.log('locations retrieved but modal closed');
      }
      objLocationsPanel.setActive('Location update saved');
    });
    
    nsc(document).on('locationUpdateFail', function() {
      if ((nsc('#modal-anchor').data('bs.modal') || {}).isShown) {
        objLocationsPanel.refreshModal();
      } else {
        console.log('locations retrieved but modal closed');
      }
      objLocationsPanel.setActive('Location update failed');
    });    
    
    nsc('.disablelocationbutton').on('click', function() {
      var sLocationKey = nsc(event.target).data('merchantlocationkey');
      console.log('disable '+sLocationKey+' called');
      objLocationsPanel.disableLocation(sLocationKey);
    });
    
    nsc('.enablelocationbutton').on('click', function() {
      var sLocationKey = nsc(event.target).data('merchantlocationkey');
      console.log('enable '+sLocationKey+' called');
      objLocationsPanel.enableLocation(sLocationKey);
    });    
    
    nsc('.deletelocationbutton').on('click', function() {
      var sLocationKey = nsc(event.target).data('merchantlocationkey');
      objLocationsPanel.deleteLocation(sLocationKey);
    });
      
  };
  
  objLocationsPanel.getModalBodyMarkup = function() {
    var sHTML = '';
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      sHTML += objLocationsPanel.getLocationListMarkup();
      sHTML += '<div id="location-form"></div>';
    } else {
      sHTML += '<p>Please start with the credentials panel.</p>';
    }
    return sHTML;
  };
  
  objLocationsPanel.refreshModal = function() {
    var sNewModalContent = '<div class="modal-body">';  
    sNewModalContent += objLocationsPanel.getModalBodyMarkup();
    sNewModalContent += '</div>';
    nsc('.modal-body').replaceWith(sNewModalContent);
    objLocationsPanel.setListeners();
  };
  
  objLocationsPanel.getLocationListMarkup = function() {
    var objLocations = app.objModel.objLocationModel.getLocations();
    var sHTML = '';
    sHTML += '<div id="location-list" class="panel panel-default">';
    sHTML += '  <div class="panel-heading">List of Locations</div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Items sold on eBay are sold from a location. Use this panel to add and or edit locations from which you sell your goods.</p>';
    sHTML += '    <button class="btn btn-primary location-item" data-locationkey="newlocation">Add New Location</button>';
    sHTML += '  </div>';
    sHTML += '  <ul class="list-group">';

    /* List all existing locations */
    for (var sLocationKey in objLocations) {
      var objLocation = objLocations[sLocationKey];
      sHTML += '<li class="location-item list-group-item" data-locationkey="'+sLocationKey+'">';
      sHTML += '  <span class="location-name">' + objLocation.name + '</span>';
      sHTML += '  <span class="btn-group pull-right">';
      sHTML += '    <button class="btn btn-default btn-xs amendlocation" data-merchantlocationkey="'+sLocationKey+'">Amend</button>';      
      sHTML += objLocationsPanel.getLocationEnabledButtonMarkup(objLocation);      
      sHTML += '    <button class="btn btn-danger btn-xs deletelocationbutton" data-merchantlocationkey="'+sLocationKey+'">Delete</button>';
      sHTML += '  </span>';
      sHTML += '</li>';
    }
    
    sHTML += '  </ul>';
    sHTML += '</div><!-- #location-list -->';
    
    return sHTML;
  };
  
  objLocationsPanel.getLocationEnabledButtonMarkup = function(objLocation) {
    var sHTML = '';
    
    if (objLocation.merchantLocationStatus === 'ENABLED') {
      sHTML += '<button class="btn btn-xs btn-success disablelocationbutton" data-merchantLocationKey="'+objLocation.merchantLocationKey+'">Enabled</button>';
    } else {
      sHTML += '<button class="btn btn-xs btn-danger enablelocationbutton" data-merchantLocationKey="'+objLocation.merchantLocationKey+'">Disabled</button>';
    }
    
    return sHTML;
  };
  
  /**
   * 
   * @param {obj} objLocation
   * @returns {String}
   */
  objLocationsPanel.getLocationFormMarkup = function(objLocation) {
    var bNewLocation = objLocation.merchantLocationKey.length === 0 ? true : false;
    
    var sReadonly = (bNewLocation) ? '' : ' readonly';
    
    var sRequired = (bNewLocation) ? ' required' : ''; 
    
    var sHTML = ''
    sHTML += '<div  id="location-form" class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>'+objLocation.name+'</span>';
    if (!bNewLocation) {
      sHTML += '<span class="pull-right" title="merchant location key"><em>'+objLocation.merchantLocationKey+'</em></span>';
    }
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    
    /* Some tips for the user */
    if (bNewLocation) {
      sHTML += '<div class="alert alert-warning">Take care filling out this fields, eBay only allows the following fields to be amended: Name, Phone, Store Website, Location Instructions and Additional Information</div>';
    }

    sHTML += '<form name="location-form">';
  
    sHTML += '<div class="form-group required">';
    sHTML += '<label for="location-name">Name</label>';
    sHTML += '<input type="text" name="name" id="location-name" class="form-control" maxlength="1000" value="'+objLocation.name+'">';
    sHTML += '</div>';

    /* If we are creating a new location we need to be able to set this, 
     * otherwise, if we are viewing/updating a location, the key is immutable */
    if (bNewLocation) {
      sHTML += '<div class="form-group required">';
      sHTML += '<label for="location-merchantLocationKey">Location Key</label>';
      sHTML += '<input type="text" name="merchantLocationKey" id="location-merchantLocationKey" class="form-control" maxlength="36" value="'+objLocation.merchantLocationKey+'" title="No spaces or any other funny characters please!">';
      sHTML += '</div>';
    }
    
    sHTML += '<div class="form-group '+sRequired+'">';
    sHTML += '<label for="location-address-addressLine1">Address 1</label>';
    sHTML += '<input type="text" name="addressLine1" id="location-address-addressLine1" class="form-control required" maxlength="128" value="'+objLocation.location.address.addressLine1+'"'+sReadonly+'>';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-address-addressLine2">Address 2</label>';
    sHTML += '<input type="text" name="addressLine2" id="location-address-addressLine2" class="form-control" maxlength="128" value="'+objLocation.location.address.addressLine2+'"'+sReadonly+'>';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group'+sRequired+'">';
    sHTML += '<label for="location-address-city">City</label>';
    sHTML += '<input type="text" name="city" id="location-address-city" class="form-control" maxlength="128" value="'+objLocation.location.address.city+'"'+sReadonly+'>';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group'+sRequired+'">';
    sHTML += '<label for="location-address-postalCode">Postal Code/ Zip</label>';
    sHTML += '<input type="text" name="postalCode" id="location-address-postalCode" class="form-control" maxlength="16" value="'+objLocation.location.address.postalCode+'"'+sReadonly+'>';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group'+sRequired+'">';
    sHTML += '<label for="location-address-stateOrProvince">State/ Province</label>';
    sHTML += '<input type="text" name="stateOrProvince" id="location-address-stateOrProvince" class="form-control" maxlength="128" value="'+objLocation.location.address.postalCode+'"'+sReadonly+'>';
    sHTML += '</div>';
    
    sHTML += '<div class="form-group'+sRequired+'">';
    sHTML += '<label for="location-address-country">Country Code</label>';
    sHTML += '<input type="text" name="country" id="location-address-country" class="form-control" maxlength="2" title="Two-letter ISO 3166-1 Alpha-2 country code" value="'+objLocation.location.address.country+'" placeholder="2-letter ISO country code"'+sReadonly+'>';
    sHTML += '</div>';
  
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-locationInstructions">Location Instructions (how to find the location)</label>';
    sHTML += '<input type="text" name="locationInstructions" id="location-locationInstructions" class="form-control" maxlength="256" value="'+objLocation.locationInstructions+'">'; 
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-locationAdditionalInformation">Additional Information</label>';
    sHTML += '<input type="text" name="locationAdditionalInformation" id="location-locationAdditionalInformation" class="form-control" maxlength="256" value="'+objLocation.locationAdditionalInformation+'">'; 
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-locationWebUrl">Store Website</label>';
    sHTML += '<input type="text" name="locationURL" id="location-locationWebUrl" class="form-control" maxlength="512" value="'+objLocation.locationWebUrl+'">'; 
    sHTML += '</div>';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="location-phone">Phone</label>';
    sHTML += '<input type="text" name="phone" id="location-phone" class="form-control" maxlength="36" value="'+objLocation.phone+'">'; 
    sHTML += '</div>';
    
    /* Button for creating a new location */
    if (objLocation.merchantLocationKey.length === 0) {
      sHTML += '<button type="button" id="create-location" class="btn btn-primary">Create New Location</button>';
      
    /* Button for updating an existing location */
    } else {
      sHTML += '<button type="button" id="update-location" class="btn btn-primary" data-merchantlocationkey="'+objLocation.merchantLocationKey+'">Update Location</button>';
    }
    
    sHTML += '</form>';
    sHTML += '</div><!-- .panelbody -->';
    sHTML += '</div><!-- .panel -->';
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
    app.objModel.objLocationModel.setLocations(objData);
    
    var objLocations = app.objModel.objLocationModel.getLocations();
    var nNumberOfLocations = Object.keys(objLocations).length;
    if (nNumberOfLocations === 0) {
      objLocationsPanel.setInactive('Click here to set up a selling location.');
    } else if (nNumberOfLocations === 1) {
      var sLocationName = objLocations[Object.keys(objLocations)[0]].name;
      objLocationsPanel.setActive(sLocationName + ' is set up. Click to update or add a new location');
    } else {
      objLocationsPanel.setActive('You have '+nNumberOfLocations+' locations set up. Click to update or add a new location');
    }
  };
  
  objLocationsPanel.getLocations = function() {
    /* Only carry this out if we have eBay authorization */
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      objLocationsPanel.setUpdating('Fetching locations');

      /* Ask eBay for any locations associated with this user */
      objApiInventory.getLocations(objLocationsPanel.setLocations);
    }
  };
  
  objLocationsPanel.createLocation = function() {
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

    objLocationsPanel.setUpdating('Adding '+nsc('#location-name').val()+' as a new location');
    objApiInventory.createLocation(sLocationKey, objLocationData, objLocationsPanel.getLocations);
  };
  
  objLocationsPanel.deleteLocation = function(sLocationKey) {
    var objLocation = app.objModel.objLocationModel.getLocation(sLocationKey);
    objLocationsPanel.setUpdating('Deleting location '+objLocation.name);
    objApiInventory.deleteLocation(sLocationKey, objLocationsPanel.getLocations);
  };
  
  objLocationsPanel.updateLocation = function(sLocationKey) {
    var objLocationData = {
      name                          : nsc('#location-name').val(),
      phone                         : nsc('#location-phone').val(),
      locationWebUrl                : nsc('#location-locationWebUrl').val(),
      locationInstructions          : nsc('#location-locationInstructions').val(),
      locationAdditionalInformation : nsc('#location-locationAdditionalInformation').val()
    };

    objLocationsPanel.setUpdating('Updating '+nsc('#location-name').val());
    objApiInventory.updateLocation(sLocationKey, objLocationData, objLocationsPanel.getLocations);
  };
  
  objLocationsPanel.enableLocation = function(sLocationKey) {
    var objLocation = app.objModel.objLocationModel.getLocation(sLocationKey);
    objLocationsPanel.setUpdating('Setting '+objLocation.name+' status to enabled');
    objApiInventory.enableLocation(sLocationKey, app.objModel.objLocationModel.setLocationEnabled);
  };
  
  objLocationsPanel.disableLocation = function(sLocationKey) {
    var objLocation = app.objModel.objLocationModel.getLocation(sLocationKey);
    objLocationsPanel.setUpdating('Setting '+objLocation.name+' status to disabled');
    objApiInventory.disableLocation(sLocationKey, app.objModel.objLocationModel.setLocationDisabled);    
  };

  return objLocationsPanel;
});