// Start the main app logic.
requirejs(['jquery',
  'modules/interface',
  'modules/models/ebayAuthorizationModel',
  'modules/models/datamappingModel',
  'modules/models/storeCatalogueModel',
  'modules/models/ebayCatalogueModel',
  'modules/models/ebayOffersModel',
  'modules/models/policyModel',
  'bootstrap'],
  function(
    nsc,
    objInterface,
    objEbayAuthorizationModel,
    objDataMappings,
    objStoreCatalogueModel,
    objEbayCatalogueModel,
    objEbayOffersModel,
    objPolicyModel
  ) {
  
  app = {};
  
  app.objModel = {};
  
  /* These are loaded into the global space by the backend on page load */
  app.objModel.objURLs = objURLs;
  
  /* Load the following models that will be required regardless of the selected 
   * tab */
  app.objModel.objEbayAuthorization = objEbayAuthorizationModel;
  app.objModel.objEbayAuthorization.initialize();
  
  app.objModel.objDataMappings = objDataMappings;
  app.objModel.objDataMappings.initialize();
  
  app.objModel.objStoreCatalogueModel = objStoreCatalogueModel;
  app.objModel.objStoreCatalogueModel.initialize();
  
  app.objModel.objEbayCatalogueModel = objEbayCatalogueModel;
  app.objModel.objEbayCatalogueModel.initialize();
  
  app.objModel.objEbayOffersModel = objEbayOffersModel;
  app.objModel.objEbayOffersModel.initialize();
  
  app.objModel.objPolicyModel = objPolicyModel;
  app.objModel.objPolicyModel.initialize();
    
    
  /* Now load the interface */
  app.objInterface = objInterface;
  app.objInterface.render();
  app.objInterface.setListeners();
  app.objInterface.initialize();
    
  /* Will eventually have to allow passing of app state but for now we'll just 
   * start with the dashboard selected. */
  nsc('#main-nav a[href="#dashboard-panel"]').tab('show');
  //nsc('#main-nav a[href="#storeCatalogue-panel"]').tab('show');

});