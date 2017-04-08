define([
  'jquery', 
  'modules/panels/statusPanel',
  'modules/panels/credentialsPanel',
  'modules/ebayApi/inventory',
  'modules/panels/summaryPanel'],
  function(
    nsc, 
    objStatusPanel,
    objCredentialsPanel,
    objApiInventory,
    objSummaryPanel) {
   
  var objDataMappingPanel = {};

  objDataMappingPanel.__proto__ = objStatusPanel;
  
  objDataMappingPanel.sName = 'Data Mapping';
  objDataMappingPanel.sCode = 'datamappingpanel';

  objDataMappingPanel.objChildPanels = {};
  
  objDataMappingPanel.objSettings.objDatamappings = {
    /* InventoryItem */
    availability : {
//      /* Might skip this for the prototype */
//      pickupAtLocationAvailability : [
//        {
//        availabilityType : 'string',
//        fulfillmentTime : {
//          /* TimeDuration */
//          unit  : 'string',
//          value : 'integer'
//        },
//          merchantLocationKey : 'string',
//          quantity            : 'integer'
//        }
//        /* More PickupAtLocationAvailability nodes here */
//      ],
      shipToLocationAvailability : {
        quantity : 'product_stock' // 0 > 
      }
    },
    condition            : 'product_weblinxcustomtext1',//'string ENUM[FOR_PARTS_OR_NOT_WORKING, LIKE_NEW, MANUFACTURER_REFURBISHED, NEW, NEW_OTHER, NEW_WITH_DEFECTS, SELLER_REFURBISHED, USED_ACCEPTABLE, USED_EXCELLENT, USED_GOOD, USED_VERY_GOOD]',
    conditionDescription : '',//'string, optional, 1000',
    packageWeightAndSize : {
      /* PackageWeightAndSize */
      dimensions : {
        /* Dimension */
        height : '', //number', 
        length : '', //number',
        unit   : '', //string',
        width  : '', //number'
      },
      packageType : '',//string', // ENUM[]
      weight      : {
        /* Weight */
        unit  : '', // ENUM [FROM, KILOGRAM, OUNCE, POUND]
        value : 'product_weight'
      }
    },
    product : {
      /* Product */
      aspects : [
        '' //'string' // maxlength : 40 example: Brand: ['GoPro']
        /* More string nodes here */
      ],
      brand       : 'product_brandname',
      description : 'product_desc',
      ean         : [
        '' //string'
        /* More string nodes here */
      ],
      imageUrls   : [
        'product_image'
        /* More string nodes here */
      ],
      isbn        : [
        '' //'string'
        /* More string nodes here */
      ],
      mpn      : '', // max length 65
      subtitle : '', // adds to the cost of listing
      title    : 'product_name',
      upc      : [
        '' //'string'
        /* More string nodes here */
      ]
    },
    sku : 'product_code'
  };
  
  objDataMappingPanel.objSettings.objFieldMetaData = {
    quantity             : {node: 'availability.shipToLocationAvailability.quantity', required: true, default: 'product_stock', datatype:'integer'},
    condition            : {node: 'condition', required: true, default: '', datatype:'enum', possible_values: ['NEW', 'NEW_OTHER', 'NEW_WITH_DEFECTS', 'SELLER_REFURBISHED', 'USED_ACCEPTABLE', 'USED_EXCELLENT', 'USED_GOOD', 'USED_VERY_GOOD', 'FOR_PARTS_OR_NOT_WORKING', 'LIKE_NEW', 'MANUFACTURER_REFURBISHED']},
    conditionDescription : {node: 'conditionDescription', required: false, default: '', datatype: 'string', maxlength: 1000},
    unit                 : {node: 'packageWeightAndSize.weight', required: false, default: '', datatype: 'enum', possible_values: ['GRAM', 'KILGRAM', 'OUNCE', 'POUND']},
    value                : {node: 'packageWeightAndSize.unit', required: false, default: 'product_weight', datatype: 'number'},
    aspects              : {node: 'product.aspects', required: false, default: '', datatype:'array_of_strings'},
    brand                : {node: 'product.brand', required: false, default: 'product_brandname', datatype: 'string', maxlength: 65},
    description          : {node: 'product.description', required: false, default: 'product_desc', datatype: 'string', maxlength: 4000},
    ean                  : {node: 'product.ean', required: false, default: '', datatype: 'array_of_strings'},
    imageUrls            : {node: 'product.imageUrls', required: false, default: '', datatype: 'array_of_strings'},
    isbn                 : {node: 'product.isbn', required: false, default: '', datatype: 'array_of_strings'},
    mpn                  : {node: 'product.mpn', required: false, default: '', datatype: 'string', maxlength: 65},
    subtitle             : {node: 'product.subtitle', required: false, default: '', datatype: 'string', maxlength: 55},      
    title                : {node: 'product.title', required: false, default: '', datatype: 'string', maxlength: 80},
    upc                  : {node: 'product.upc', required: false, default: '', datatype: 'array_of_strings'},
    sku                  : {node: 'sku', required: true, default: 'product_code', datatype: 'strings', maxlength: 50},
  };
          
  objDataMappingPanel.objSettings.arrProductFields = [
    '',
    'product_id',
    'product_code',
    'product_name',
    'product_price',
    'product_image',
    'category_link',
    'product_desc',
    'product_modified', 
    'product_stock',
    'product_pricea',
    'product_priceb',
    'product_pricec',
    'product_promotion',
    'product_specialoffer',
    'product_newproduct',
    'product_theme',
    'product_rating',
    'product_subdescription1',
    'product_subdescription2',
    'product_subdescription3',
    'product_leadtime',
    'product_lastreceived',
    'product_releasedate',
    'product_priority',
    'product_weight',
    'product_onorder',
    'product_orderdate',
    'product_restocklevel',
    'product_taxable',
    'product_itemtaxid',
    'product_brandname',
    'product_subcategory',
    'product_priceweb',
    'product_nowebsale',
    'product_shortdesc',
    'product_matrixid',
    'product_weblinxcustomnumber1',
    'product_weblinxcustomnumber2',
    'product_weblinxcustomnumber3',
    'product_weblinxcustomnumber4',
    'product_weblinxcustomnumber5',
    'product_weblinxcustomtext1',
    'product_weblinxcustomtext2',
    'product_weblinxcustomtext3',
    'product_weblinxcustomtext4',
    'product_weblinxcustomtext5',
    'product_weblinxcustomtext6',
    'product_weblinxcustomtext7',
    'product_weblinxcustomtext8',
    'product_weblinxcustomtext9',
    'product_weblinxcustomtext10',
    'product_weblinxcustomtext11',
    'product_weblinxcustomtext12',
    'product_weblinxcustomtext13',
    'product_weblinxcustomtext14',
    'product_weblinxcustomtext15',
    'product_weblinxcustomtext16',
    'product_weblinxcustomtext17',
    'product_weblinxcustomtext18',
    'product_weblinxcustomtext19',
    'product_weblinxcustomtext20',
    'product_notdiscountable',
    'product_qtydiscountid',
    'product_departmentid',
    'product_keywords',
    'product_tagalong',
    'product_timestamp',
    'product_type'
  ];
  
  objDataMappingPanel.initialize = function() {
    objDataMappingPanel.objSettings.objDefaultMappings = objDataMappingPanel.objSettings.objDatamappings;
    objDataMappingPanel.getDataMappings();
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
      objDataMappingPanel.saveDataMappings();
      objDataMappingPanel.refreshModal();
    });
    
    nsc('#resetDataMappings').off().on('click', function() {
      objDataMappingPanel.resetDataMappings();
      objDataMappingPanel.refreshModal();
    });    

    nsc('#mappingfield-quantity').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.availability.shipToLocationAvailability.quantity = event.target.value;
    });
        
    nsc('#mappingfield-condition').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.condition = event.target.value;
    });
    
    nsc('#mappingfield-conditionDescription').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.conditionDescription = event.target.value;
    });
        
    nsc('#mappingfield-unit').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.packageWeightAndSize.weight = event.target.value;
    });    
    
    nsc('#mappingfield-value').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.packageWeightAndSize.unit = event.target.value;
    });    
    
    nsc('#mappingfield-aspects').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.aspects = [event.target.value];
    });

    nsc('#mappingfield-brand').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.brand = event.target.value;
    });
    
    nsc('#mappingfield-description').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.description = event.target.value;
    });

    nsc('#mappingfield-ean').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.ean = [event.target.value];
    });
    
    nsc('#mappingfield-imageUrls').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.imageUrls = [event.target.value];
    });
    
    nsc('#mappingfield-isbn').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.isbn = [event.target.value];
    });
    
    nsc('#mappingfield-mpn').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.mpn = [event.target.value];
    });
    
    nsc('#mappingfield-title').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.title = event.target.value;
    });
    
    nsc('#mappingfield-subtitle').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.subtitle = event.target.value;
    });
    
    nsc('#mappingfield-upc').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.product.upc = [event.target.value];
    });
    
    nsc('#mappingfield-sku').off().on('change', function(event) {
      objDataMappingPanel.objSettings.objDatamappings.sku = event.target.value;
    });

    var arrMissingMappings = objDataMappingPanel.getMissingMappings();
    if (arrMissingMappings.length) {
      objDataMappingPanel.setInactive('The following fields require mappings: '+arrMissingMappings.join(', '));
    } else {
      objDataMappingPanel.setActive('Mappings set. You can push products to Ebay.');
    }
  };
  
  objDataMappingPanel.getModalBodyMarkup = function() {
    var objMappings = objDataMappingPanel.objSettings.objDatamappings;
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
    sHTML += '<select';
    sHTML += ' id="mappingfield-'+sNodeName+'"';
    sHTML += '>';
    for (var i = 0; i < objDataMappingPanel.objSettings.arrProductFields.length; i++) {
      sHTML += '<option ';
      sHTML += 'value="'+objDataMappingPanel.objSettings.arrProductFields[i]+'" ';
      if (objDataMappingPanel.objSettings.arrProductFields[i] == sSelectedField) {
        sHTML += ' selected';
      }
      sHTML += '>';
      sHTML += objDataMappingPanel.objSettings.arrProductFields[i];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    return sHTML;
  };
  
  objDataMappingPanel.getMissingMappings = function() {
    var arrMissingMappings = [];
    var objFieldData = {};
    for (var sFieldName in objDataMappingPanel.objSettings.objFieldMetaData) {
      objFieldData = objDataMappingPanel.objSettings.objFieldMetaData[sFieldName];
      if (objFieldData.required) {
        var sFieldContent = eval('objDataMappingPanel.objSettings.objDatamappings.'+objFieldData.node);
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
  
  objDataMappingPanel.getDataMappings = function() {
    var jqxhr = nsc.ajax({
      url      : '/store/datamappings',
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      /* The first time this is used there are no mappings on the server */
      if (responsedata['saved_data_mappings'] === null) {
        objDataMappingPanel.objSettings.objDatamappings = objDataMappingPanel.objSettings.objDefaultMappings;
      } else {
        objDataMappingPanel.objSettings.objDatamappings = responsedata['saved_data_mappings'];
      }    
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
  };
  
  objDataMappingPanel.saveDataMappings = function() {
    objDataMappingPanel.setUpdating('Saving data mappings');
    var jqxhr = nsc.ajax({
      url      : '/store/datamappings',
      data     : {datamappings: objDataMappingPanel.objSettings.objDatamappings},
      dataType : "json",
      type     : "post"
    });

    jqxhr.done(function(responsedata) {
      objDataMappingPanel.objSettings.objDatamappings = responsedata['saved_data_mappings']['datamappings'];
      objDataMappingPanel.render();
      objDataMappingPanel.hideModal();
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
  };
  
  objDataMappingPanel.resetDataMappings = function() {
    objDataMappingPanel.objSettings.objDatamappings = objDataMappingPanel.objSettings.objDefaultMappings;
    objDataMappingPanel.render();
  };
  
  return objDataMappingPanel;
});   