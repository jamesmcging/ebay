define([
  'jquery', 
  'modules/panels/statusPanel',
  'modules/models/datamappingModel'],
  function(
    nsc, 
    objStatusPanel,
    objDataMappingsModel
  ) {
   
  var objDataMappingPanel = {};

  objDataMappingPanel.__proto__ = objStatusPanel;
  
  objDataMappingPanel.sName = 'Data Mapping';
  objDataMappingPanel.sCode = 'datamappingpanel';

  objDataMappingPanel.objChildPanels = {};
  
  objDataMappingPanel.initialize = function() {
    
    /* Ensure the app has its data mappings model */
    if (typeof app.objModel.objDataMappings === 'undefined') {
      app.objModel.objDataMappings = objDataMappingsModel;
    }
    
    app.objModel.objDataMappings.initialize();
    app.objModel.objDataMappings.updateDataMappings();
  };
  
  objDataMappingPanel.getPanelContent = function() {
    /* See if we are missing any mappings */
    var arrMissingMappings = objDataMappingPanel.getMissingMappings();
    if (arrMissingMappings.length) {
      objDataMappingPanel.objSettings.bActive = false;
    } else {
      objDataMappingPanel.objSettings.bActive = true;
    }
    
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="status-panel-icon" id="'+this.sCode+'-status-icon"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-10">';
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+'</h3>';
    sHTML += '<p id="'+this.sCode+'-status-text">';
    if (objDataMappingPanel.objSettings.bActive) {
      sHTML += 'Mappings set.';
    } else {
      sHTML += 'The following fields require mappings: '+arrMissingMappings.join(', ');
    } 
    sHTML += '</p>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- .row -->';
    return sHTML;
  };
  
  objDataMappingPanel.setListeners = function() {
    nsc('#'+this.sCode+'-panel').off().on('click', function() {
      objDataMappingPanel.showModal();
      objDataMappingPanel.setListeners();
    });
    
    nsc('#saveDataMappings').off().on('click', function() {
      objDataMappingPanel.setUpdating('Saving data mappings');
      app.objModel.objDataMappings.saveDataMappings();
    });
    
    nsc('#resetDataMappings').off().on('click', function() {
      objDataMappingPanel.setUpdating('Resetting data mappings');
      objDataMappingPanel.resetDataMappings();
      // objDataMappingPanel.refreshModal();
    });
    
    nsc(document).off('datamappingsupdated').on('datamappingsupdated', function() {
      objDataMappingPanel.setActive('Data mappings updated');
      if ((nsc('#modal-anchor').data('bs.modal') || {}).isShown) {
        objDataMappingPanel.hideModal();
      }
    });

    nsc('#mappingfield-quantity').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.availability.shipToLocationAvailability.quantity = event.target.value;
    });
        
    nsc('#mappingfield-condition').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.condition = event.target.value;
    });
    
    nsc('#mappingfield-conditionDescriptiom').off().on('change', function(event) {
      app.objModel.objDataMappings.objDataMappings.conditionDescription = event.target.value;
    });
        
    nsc('#mappingfield-unit').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.packageWeightAndSize.weight = event.target.value;
    });    
    
    nsc('#mappingfield-value').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.packageWeightAndSize.unit = event.target.value;
    });    
    
    nsc('#mappingfield-aspects').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.aspects = [event.target.value];
    });

    nsc('#mappingfield-brand').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.brand = event.target.value;
    });
    
    nsc('#mappingfield-description').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.description = event.target.value;
    });

    nsc('#mappingfield-ean').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.ean = [event.target.value];
    });
    
    nsc('#mappingfield-imageUrls').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.imageUrls = [event.target.value];
    });
    
    nsc('#mappingfield-isbn').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.isbn = [event.target.value];
    });
    
    nsc('#mappingfield-mpn').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.mpn = [event.target.value];
    });
    
    nsc('#mappingfield-title').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.title = event.target.value;
    });
    
    nsc('#mappingfield-subtitle').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.subtitle = event.target.value;
    });
    
    nsc('#mappingfield-upc').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.product.upc = [event.target.value];
    });
    
    nsc('#mappingfield-sku').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.sku = event.target.value;
    });
    
    nsc('#mappingfield-location').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.location = event.target.value;
    });

    nsc('#mappingfield-price').off().on('change', function(event) {
      app.objModel.objDataMappings.objDatamappings.price = event.target.value;
    });
    
    var arrMissingMappings = objDataMappingPanel.getMissingMappings();
    if (arrMissingMappings.length) {
      objDataMappingPanel.setInactive('The following fields require mappings: '+arrMissingMappings.join(', '));
    } else {
      objDataMappingPanel.setActive('Mappings set. You can push products to Ebay.');
    }
  };
  
  objDataMappingPanel.getModalBodyMarkup = function() {
    var objMappings = app.objModel.objDataMappings.getDataMappings();
    
    var sHTML = '';
    sHTML += '<div class="alert alert-warning">';
    sHTML += 'Use this interface to map data from your web store to eBay. The default mappings will suit most stores.';
    sHTML += '</div>';
    sHTML += '<table class="table">';
    sHTML += '  <thead>';
    sHTML += '    <tr>';
    sHTML += '      <th>Target eBay Field</th>';
    sHTML += '      <th>Local Field</th>';
    sHTML += '    <tr>';
    sHTML += '  </thead>';
    
    sHTML += '  <tbody>';
    sHTML += '    <tr>';
    sHTML += '      <td class="required">SKU</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.sku, 'sku') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td class="required">Title</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.title, 'title') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>Sub-title</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.subtitle, 'subtitle') + '</td>';
    sHTML += '    </tr>';    
    sHTML += '    <tr>';
    sHTML += '      <td class="required">Description</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.description, 'description') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>Brand</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.brand, 'brand') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>EAN</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.ean[0], 'ean') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>UPC</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.upc[0], 'upc') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>ISBN</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.isbn[0], 'isbn') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>MPN</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.mpn[0], 'mpn') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td class="required">Condition</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.condition, 'condition') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>Condition Description</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.conditionDescription, 'conditionDescription') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>Image URL</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.imageUrls[0], 'imageUrls') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>Aspects</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.product.aspects[0], 'aspects') + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td class="required">Quantity</td>';
    sHTML += '      <td>' + objDataMappingPanel.getFieldMarkup(objMappings.availability.shipToLocationAvailability.quantity, 'quantity') + '</td>';
    sHTML += '    </tr>';
    
    /* Meta (non-ebay fields */
    sHTML += '    <tr>';
    sHTML += '      <td>Default location</td>';
    sHTML += '      <td>' + objDataMappingPanel.getLocationMarkup() + '</td>';
    sHTML += '    </tr>';
    sHTML += '    <tr>';
    sHTML += '      <td>Price</td>';
    sHTML += '      <td>' + objDataMappingPanel.getPriceMarkup() + '</td>';
    sHTML += '    </tr>';
    
    sHTML += '  </tbody>';
    
    sHTML += '  <tfoot>';
    sHTML += '    <tr>';
    sHTML += '      <td></td>';
    sHTML += '      <td>';
    sHTML += '        <button id="resetDataMappings" class="btn btn-warning">Reset Mappings</button>';
    sHTML += '        <button id="saveDataMappings" class="btn btn-success">Save Mappings</button>';
    sHTML += '      </td>';
    sHTML += '    </tr>';
    sHTML += '  </tfoot>';
    
    sHTML += '</table>';

    return sHTML;
  };
  
  objDataMappingPanel.getFieldMarkup = function(sSelectedField, sNodeName) {
    var sHTML = '';
    sHTML += '<select class="form-control"';
    sHTML += ' id="mappingfield-'+sNodeName+'"';
    sHTML += '>';
    for (var i = 0; i < app.objModel.objDataMappings.arrProductFields.length; i++) {
      sHTML += '<option ';
      sHTML += 'value="'+app.objModel.objDataMappings.arrProductFields[i]+'" ';
      if (app.objModel.objDataMappings.arrProductFields[i] == sSelectedField) {
        sHTML += ' selected';
      }
      sHTML += '>';
      sHTML += app.objModel.objDataMappings.arrProductFields[i];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    return sHTML;
  };
  
  objDataMappingPanel.getLocationMarkup = function() {
    var objLocations = app.objModel.objLocationModel.getLocations();
    var sDefaultLocation = app.objModel.objDataMappings.getStoreFieldDefaultByEbayField('location');
    var sHTML = '';
    
    sHTML += '<select id="mappingfield-location" class="form-control">';
    for (var sLocationKey in objLocations) {
      sHTML += '<option value="'+sLocationKey+'"';
      if (objLocations[sLocationKey].merchantLocationKey === sDefaultLocation) {
        sHTML += ' selected="selected"';
      }
      sHTML += '>';
      sHTML += objLocations[sLocationKey].name;
      if (objLocations[sLocationKey].merchantLocationStatus === 'DISABLED') {
        sHTML += ' - disabled';
      }
      sHTML += '</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  };
  
  objDataMappingPanel.getPriceMarkup = function() {
    var objPriceFields = {
      product_price : 'Price',
      product_priceweb : 'Web price',
      product_pricea : 'Price A',
      product_priceb : 'Price B',
      product_pricec : 'Price C'
    };
    var sDefaultField = app.objModel.objDataMappings.getStoreFieldDefaultByEbayField('price');
    var sHTML = '';
    
    sHTML += '<select id="mappingfield-price" class="form-control">';
    for (var sField in objPriceFields) {
      sHTML += '<option value="'+sField+'"';
      if (sField === sDefaultField) {
        sHTML += ' selected="selected"';
      }
      sHTML += '>';
      sHTML += objPriceFields[sField];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  }
  
  objDataMappingPanel.getMissingMappings = function() {
    var arrMissingMappings = [];
    var objFieldData = {};
    for (var sFieldName in objDataMappingPanel.objSettings.objFieldMetaData) {
      objFieldData = objDataMappingPanel.objSettings.objFieldMetaData[sFieldName];
      if (objFieldData.required) {
        var sFieldContent = eval('app.objModel.objDataMappings.objDatamappings.'+objFieldData.node);
        if (sFieldContent.length === 0) {
          arrMissingMappings.push(objFieldData.node);
        }
      }
    };
    return arrMissingMappings;
  };
  
  objDataMappingPanel.refreshModal = function() {
    var sNewModalContent = '<div class="modal-body">';  
    sNewModalContent += objDataMappingPanel.getModalBodyMarkup();
    sNewModalContent += '</div>';
    nsc('.modal-body').replaceWith(sNewModalContent);
    objDataMappingPanel.setListeners();
  };
  
  objDataMappingPanel.resetDataMappings = function() {
    app.objModel.objDataMappings.resetDataMappings();
    objDataMappingPanel.render();
  };
  
  return objDataMappingPanel;
});   