define([
  'jquery', ,
  'modules/ebayApi/inventory'
  ],
  function(
    nsc, 
    objApiInventory
  ) {
   
  var objDataMappingModel = {};
  
  objDataMappingModel.objDatamappings = {
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
  
  objDataMappingModel.objFieldMetaData = {
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
          
  objDataMappingModel.arrProductFields = [
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
  
  objDataMappingModel.initialize = function() {
    objDataMappingModel.objDefaultMappings = objDataMappingModel.objDatamappings;
  };
  
  objDataMappingModel.setListeners = function() {};
  
  objDataMappingModel.getMissingMappings = function() {
    var arrMissingMappings = [];
    var objFieldData = {};
    for (var sFieldName in objDataMappingModel.objFieldMetaData) {
      objFieldData = objDataMappingModel.objFieldMetaData[sFieldName];
      if (objFieldData.required) {
        var sFieldContent = eval('objDataMappingPanel.objDatamappings.'+objFieldData.node);
        if (sFieldContent.length === 0) {
          arrMissingMappings.push(objFieldData.node);
        }
      }
    };
    return arrMissingMappings;
  };
  
  objDataMappingModel.updateDataMappings = function() {
    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sStoreURL+'/store/datamappings',
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      /* The first time this is used there are no mappings on the server */
      if (responsedata['saved_data_mappings'] === null) {
        objDataMappingModel.objDatamappings = objDataMappingModel.objDefaultMappings;
      } else {
        objDataMappingModel.objDatamappings = responsedata['saved_data_mappings'];
      }    
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    nsc(document).trigger('datamappingsupdated', objDataMappingModel.objDatamappings);
  };
  
  objDataMappingModel.getDataMappings = function() {
    return objDataMappingModel.objDatamappings;
  };
  
  objDataMappingModel.saveDataMappings = function() {
    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sStoreURL+'/store/datamappings',
      data     : {datamappings: objDataMappingModel.objDatamappings},
      dataType : "json",
      type     : "post"
    });

    jqxhr.done(function(responsedata) {
      objDataMappingModel.objDatamappings = responsedata['saved_data_mappings']['datamappings'];
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    nsc(document).trigger('datamappingsupdated', objDataMappingModel.objDatamappings);
  };
  
  objDataMappingModel.resetDataMappings = function() {
    objDataMappingModel.objDatamappings = objDataMappingModel.objDefaultMappings;
    objDataMappingModel.saveDataMappings();
  };
  
  return objDataMappingModel;
});   